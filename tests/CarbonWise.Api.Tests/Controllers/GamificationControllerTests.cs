using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Gamification;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class GamificationControllerTests
{
    [Fact]
    public async Task Get_ShouldReturnOk_WithGamificationData()
    {
        // Arrange
        var service =
            new Mock<IGamificationService>();

        var response =
            new GamificationResponse
            {
                GreenPoints = 150,
                CurrentStreak = 5,
                Level = "Eco Explorer",
                Achievements =
                [
                    "First Challenge",
                    "100 Green Points"
                ]
            };

        service
            .Setup(x =>
                x.GetAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new GamificationController(
                service.Object);

        // Act
        var result =
            await controller.Get("user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.GetAsync("user1"),
            Times.Once);
    }
}