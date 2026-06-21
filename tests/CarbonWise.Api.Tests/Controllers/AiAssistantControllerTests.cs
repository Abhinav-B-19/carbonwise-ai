using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class AiAssistantControllerTests
{
    [Fact]
    public async Task Chat_ShouldReturnOk_WithChatResponse()
    {
        // Arrange
        var service =
            new Mock<IAiAssistantService>();

        var request =
            new ChatRequest
            {
                UserKey = "user1",
                Message = "Hello"
            };

        var response =
            new ChatResponse
            {
                Response = "Hi there",
                RemainingMessages = 24
            };

        service
            .Setup(x =>
                x.SendMessageAsync(request))
            .ReturnsAsync(response);

        var controller =
            new AiAssistantController(
                service.Object);

        // Act
        var result =
            await controller.Chat(request);

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.SendMessageAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task History_ShouldReturnOk_WithHistory()
    {
        // Arrange
        var service =
            new Mock<IAiAssistantService>();

        var history =
            new List<ChatHistoryResponse>
            {
                new()
                {
                    Role = "assistant",
                    Message = "Hello",
                    CreatedAt = DateTime.UtcNow
                }
            };

        service
            .Setup(x =>
                x.GetHistoryAsync("user1"))
            .ReturnsAsync(history);

        var controller =
            new AiAssistantController(
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

    [Fact]
    public async Task Clear_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IAiAssistantService>();

        service
            .Setup(x =>
                x.ClearHistoryAsync("user1"))
            .Returns(Task.CompletedTask);

        var controller =
            new AiAssistantController(
                service.Object);

        // Act
        var result =
            await controller.Clear("user1");

        // Assert
        result.Should()
            .BeOfType<OkResult>();

        service.Verify(
            x => x.ClearHistoryAsync("user1"),
            Times.Once);
    }

    [Fact]
    public async Task Usage_ShouldReturnOk_WithUsage()
    {
        // Arrange
        var service =
            new Mock<IAiAssistantService>();

        var usage =
            new ChatUsageResponse
            {
                Used = 5,
                Limit = 25,
                Remaining = 20
            };

        service
            .Setup(x =>
                x.GetUsageAsync("user1"))
            .ReturnsAsync(usage);

        var controller =
            new AiAssistantController(
                service.Object);

        // Act
        var result =
            await controller.Usage("user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(usage);

        service.Verify(
            x => x.GetUsageAsync("user1"),
            Times.Once);
    }
}