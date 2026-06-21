using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class AiControllerTests
{
    [Fact]
    public async Task Coach_ShouldReturnOk_WithAdvice()
    {
        // Arrange
        var service =
            new Mock<IAiCoachService>();

        var response =
            new AiCoachResponse
            {
                Insight = "Reduce car usage.",
                GeneratedAt = DateTime.UtcNow
            };

        service
            .Setup(x =>
                x.GenerateAdviceAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new AiController(
                service.Object);

        // Act
        var result =
            await controller.Coach("user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.GenerateAdviceAsync("user1"),
            Times.Once);
    }

    [Fact]
    public async Task History_ShouldReturnOk_WithHistory()
    {
        // Arrange
        var service =
            new Mock<IAiCoachService>();

        var history =
            new List<AiHistoryResponse>
            {
                new()
                {
                    Insight = "Walk more often.",
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Insight = "Reduce AC usage.",
                    CreatedAt = DateTime.UtcNow
                }
            };

        service
            .Setup(x =>
                x.GetHistoryAsync("user1"))
            .ReturnsAsync(history);

        var controller =
            new AiController(
                service.Object);

        // Act
        var result =
            await controller.History("user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(history);

        service.Verify(
            x => x.GetHistoryAsync("user1"),
            Times.Once);
    }
}