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

    [Fact]
    public async Task ValidateUser_ShouldReturnInvalid_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new UserService(db);

        var result =
            await service.ValidateUserAsync(
                "missing");

        result.IsValid.Should().BeFalse();
        result.Name.Should().BeNull();
    }

    [Fact]
    public async Task ValidateUser_ShouldReturnValid_WhenUserExists()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "abc",
            Name = "Abhinav",
            Email = "a@test.com",
            LastActiveAt = DateTime.UtcNow.AddDays(-1)
        };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        var previous =
            user.LastActiveAt;

        var service =
            new UserService(db);

        var result =
            await service.ValidateUserAsync(
                "abc");

        result.IsValid.Should().BeTrue();
        result.Name.Should().Be("Abhinav");

        user.LastActiveAt
            .Should()
            .BeAfter(previous);
    }

    [Fact]
    public async Task GetProfile_ShouldReturnNull_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new UserService(db);

        var result =
            await service.GetProfileAsync(
                "missing");

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetProfile_ShouldReturnProfile_WhenUserExists()
    {
        var db = DbContextFactory.Create();

        db.Users.Add(
            new User
            {
                UserKey = "abc",
                Name = "Abhinav",
                Email = "a@test.com",
                PreferredGoal = "Reduce Carbon"
            });

        await db.SaveChangesAsync();

        var service =
            new UserService(db);

        var result =
            await service.GetProfileAsync(
                "abc");

        result.Should().NotBeNull();

        result!.UserKey
            .Should().Be("abc");

        result.Name
            .Should().Be("Abhinav");

        result.Email
            .Should().Be("a@test.com");

        result.PreferredGoal
            .Should().Be("Reduce Carbon");
    }

    [Fact]
    public async Task RegisterUser_ShouldTrimValues()
    {
        var db = DbContextFactory.Create();

        var service =
            new UserService(db);

        var result =
            await service.RegisterUserAsync(
                new RegisterUserRequest
                {
                    Name = "  Abhinav  ",
                    Email = "  ABHINAV@TEST.COM  ",
                    PreferredGoal = "Reduce Carbon"
                });

        var user =
            db.Users.Single();

        user.Name
            .Should().Be("Abhinav");

        user.Email
            .Should().Be("abhinav@test.com");

        user.PreferredGoal
            .Should().Be("Reduce Carbon");
    }
}