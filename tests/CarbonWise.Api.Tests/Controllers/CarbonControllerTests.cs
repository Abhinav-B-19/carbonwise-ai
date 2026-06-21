using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Carbon;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class CarbonControllerTests
{
    [Fact]
    public async Task Calculate_ShouldReturnBadRequest_WhenUserKeyMissing()
    {
        // Arrange
        var service =
            new Mock<ICarbonCalculationService>();

        var controller =
            new CarbonController(
                service.Object);

        // Act
        var result =
            await controller.Calculate(
                "",
                new CalculateCarbonRequest());

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should()
            .Be("Missing X-User-Key header");

        service.Verify(
            x => x.CalculateAsync(
                It.IsAny<string>(),
                It.IsAny<CalculateCarbonRequest>()),
            Times.Never);
    }

    [Fact]
    public async Task Calculate_ShouldReturnOk_WhenUserKeyProvided()
    {
        // Arrange
        var service =
            new Mock<ICarbonCalculationService>();

        var request =
            new CalculateCarbonRequest
            {
                CarKmPerWeek = 100
            };

        var response =
            new CalculateCarbonResponse
            {
                TotalEmission = 200,
                CarbonScore = 80
            };

        service
            .Setup(x =>
                x.CalculateAsync(
                    "user1",
                    request))
            .ReturnsAsync(response);

        var controller =
            new CarbonController(
                service.Object);

        // Act
        var result =
            await controller.Calculate(
                "user1",
                request);

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.CalculateAsync(
                "user1",
                request),
            Times.Once);
    }

    [Fact]
    public async Task History_ShouldReturnBadRequest_WhenUserKeyMissing()
    {
        // Arrange
        var service =
            new Mock<ICarbonCalculationService>();

        var controller =
            new CarbonController(
                service.Object);

        // Act
        var result =
            await controller.History("");

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should()
            .Be("Missing X-User-Key header");

        service.Verify(
            x => x.GetHistoryAsync(
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task History_ShouldReturnOk_WhenUserKeyProvided()
    {
        // Arrange
        var service =
            new Mock<ICarbonCalculationService>();

        var history =
            new List<CarbonHistoryResponse>
            {
                new()
                {
                    TotalEmission = 150,
                    CarbonScore = 85,
                    CreatedAt = DateTime.UtcNow
                }
            };

        service
            .Setup(x =>
                x.GetHistoryAsync("user1"))
            .ReturnsAsync(history);

        var controller =
            new CarbonController(
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