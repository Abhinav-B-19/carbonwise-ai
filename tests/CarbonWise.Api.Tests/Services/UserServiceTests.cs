using CarbonWise.Api.DTOs.Users;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Services;

public class UserServiceTests
{
    [Fact]
    public async Task RegisterUser_ShouldCreateNewUser()
    {
        var db = DbContextFactory.Create();

        var service =
            new UserService(db);

        var response =
            await service.RegisterUserAsync(
                new RegisterUserRequest
                {
                    Name = "Abhinav",
                    Email = "abhinav@test.com"
                });

        response.Should().NotBeNull();

        response.IsExistingUser.Should().BeFalse();

        db.Users.Count().Should().Be(1);
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnExistingUser()
    {
        var db = DbContextFactory.Create();

        db.Users.Add(
            new User
            {
                UserKey = "abc",
                Name = "Abhinav",
                Email = "abhinav@test.com"
            });

        await db.SaveChangesAsync();

        var service =
            new UserService(db);

        var response =
            await service.RegisterUserAsync(
                new RegisterUserRequest
                {
                    Name = "Abhinav",
                    Email = "abhinav@test.com"
                });

        response.IsExistingUser.Should().BeTrue();

        db.Users.Count().Should().Be(1);
    }
}