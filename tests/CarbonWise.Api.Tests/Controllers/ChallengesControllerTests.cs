using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Challenges;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class ChallengesControllerTests
{
    [Fact]
    public async Task GetDailyChallenge_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IChallengeService>();

        var response =
            new DailyChallengeResponse
            {
                ChallengeId = 1,
                Title = "Walk to work"
            };

        service
            .Setup(x =>
                x.GetDailyChallengeAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new ChallengesController(
                service.Object);

        // Act
        var result =
            await controller.GetDailyChallenge(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.GetDailyChallengeAsync(
                "user1"),
            Times.Once);
    }

    [Fact]
    public async Task CompleteChallenge_ShouldReturnNotFound_WhenChallengeNotCompleted()
    {
        // Arrange
        var service =
            new Mock<IChallengeService>();

        service
            .Setup(x =>
                x.CompleteChallengeAsync(
                    "user1",
                    1))
            .ReturnsAsync(false);

        var controller =
            new ChallengesController(
                service.Object);

        // Act
        var result =
            await controller.CompleteChallenge(
                "user1",
                new CompleteChallengeRequest
                {
                    ChallengeId = 1
                });

        // Assert
        result.Should()
            .BeOfType<NotFoundResult>();

        service.Verify(
            x => x.CompleteChallengeAsync(
                "user1",
                1),
            Times.Once);
    }

    [Fact]
    public async Task CompleteChallenge_ShouldReturnOk_WhenChallengeCompleted()
    {
        // Arrange
        var service =
            new Mock<IChallengeService>();

        service
            .Setup(x =>
                x.CompleteChallengeAsync(
                    "user1",
                    1))
            .ReturnsAsync(true);

        var controller =
            new ChallengesController(
                service.Object);

        // Act
        var result =
            await controller.CompleteChallenge(
                "user1",
                new CompleteChallengeRequest
                {
                    ChallengeId = 1
                });

        // Assert
        result.Should()
            .BeOfType<OkResult>();

        service.Verify(
            x => x.CompleteChallengeAsync(
                "user1",
                1),
            Times.Once);
    }

    [Fact]
    public async Task GetHistory_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IChallengeService>();

        var history =
            new List<DailyChallengeResponse>
            {
                new()
                {
                    ChallengeId = 1,
                    Title = "Walk to work"
                }
            };

        service
            .Setup(x =>
                x.GetHistoryAsync("user1"))
            .ReturnsAsync(history);

        var controller =
            new ChallengesController(
                service.Object);

        // Act
        var result =
            await controller.GetHistory(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(history);

        service.Verify(
            x => x.GetHistoryAsync(
                "user1"),
            Times.Once);
    }

    [Fact]
    public async Task GetMissions_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IChallengeService>();

        var missions =
            new MissionsResponse
            {
                Daily = new(),
                Weekly = new(),
                Monthly = new()
            };

        service
            .Setup(x =>
                x.GetMissionsAsync())
            .ReturnsAsync(missions);

        var controller =
            new ChallengesController(
                service.Object);

        // Act
        var result =
            await controller.GetMissions();

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(missions);

        service.Verify(
            x => x.GetMissionsAsync(),
            Times.Once);
    }
}