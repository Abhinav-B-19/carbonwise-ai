using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Users;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class UsersControllerTests
{
    [Fact]
    public async Task Register_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        var response =
            new RegisterUserResponse
            {
                UserKey = "user1",
                Name = "Abhinav",
                IsExistingUser = false
            };

        service
            .Setup(x =>
                x.RegisterUserAsync(
                    It.IsAny<RegisterUserRequest>()))
            .ReturnsAsync(response);

        var controller =
            new UsersController(
                service.Object);

        var request =
            new RegisterUserRequest
            {
                Name = "Abhinav",
                Email = "abhinav@test.com"
            };

        // Act
        var result =
            await controller.Register(request);

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.RegisterUserAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Validate_ShouldReturnBadRequest_WhenHeaderMissing()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        var controller =
            new UsersController(
                service.Object);

        // Act
        var result =
            await controller.Validate("");

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should()
            .Be("User key is required.");

        service.Verify(
            x => x.ValidateUserAsync(
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task Validate_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        var response =
            new ValidateUserResponse
            {
                IsValid = true,
                Name = "Abhinav"
            };

        service
            .Setup(x =>
                x.ValidateUserAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new UsersController(
                service.Object);

        // Act
        var result =
            await controller.Validate(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.ValidateUserAsync("user1"),
            Times.Once);
    }

    [Fact]
    public async Task Profile_ShouldReturnBadRequest_WhenHeaderMissing()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        var controller =
            new UsersController(
                service.Object);

        // Act
        var result =
            await controller.Profile("");

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should()
            .Be("User key is required.");

        service.Verify(
            x => x.GetProfileAsync(
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task Profile_ShouldReturnNotFound_WhenProfileMissing()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        service
            .Setup(x =>
                x.GetProfileAsync("user1"))
            .ReturnsAsync(
                (UserProfileResponse?)null);

        var controller =
            new UsersController(
                service.Object);

        // Act
        var result =
            await controller.Profile(
                "user1");

        // Assert
        result.Should()
            .BeOfType<NotFoundResult>();

        service.Verify(
            x => x.GetProfileAsync("user1"),
            Times.Once);
    }

    [Fact]
    public async Task Profile_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IUserService>();

        var profile =
            new UserProfileResponse
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "abhinav@test.com",
                PreferredGoal = "Reduce Carbon"
            };

        service
            .Setup(x =>
                x.GetProfileAsync("user1"))
            .ReturnsAsync(profile);

        var controller =
            new UsersController(
                service.Object);

        // Act
        var result =
            await controller.Profile(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(profile);

        service.Verify(
            x => x.GetProfileAsync("user1"),
            Times.Once);
    }
}