using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Dashboard;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class DashboardControllerTests
{
    [Fact]
    public async Task GetDashboard_ShouldReturnBadRequest_WhenUserKeyMissing()
    {
        // Arrange
        var service =
            new Mock<IDashboardService>();

        var controller =
            new DashboardController(
                service.Object);

        // Act
        var result =
            await controller.GetDashboard("");

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should().Be("UserKey is required.");

        service.Verify(
            x => x.GetSummaryAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetDashboard_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IDashboardService>();

        var response =
            new DashboardSummaryResponse();

        service
            .Setup(x =>
                x.GetSummaryAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new DashboardController(
                service.Object);

        // Act
        var result =
            await controller.GetDashboard(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.GetSummaryAsync("user1"),
            Times.Once);
    }

    [Fact]
    public async Task GetTrends_ShouldReturnBadRequest_WhenUserKeyMissing()
    {
        // Arrange
        var service =
            new Mock<IDashboardService>();

        var controller =
            new DashboardController(
                service.Object);

        // Act
        var result =
            await controller.GetTrends("");

        // Assert
        var badRequest =
            result.Should()
                .BeOfType<BadRequestObjectResult>()
                .Subject;

        badRequest.StatusCode.Should().Be(400);
        badRequest.Value.Should().Be("UserKey is required.");

        service.Verify(
            x => x.GetTrendsAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetTrends_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IDashboardService>();

        var response =
            new DashboardTrendsResponse
            {
                Weekly = new List<TrendPointResponse>(),
                Monthly = new List<TrendPointResponse>()
            };

        service
            .Setup(x =>
                x.GetTrendsAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new DashboardController(
                service.Object);

        // Act
        var result =
            await controller.GetTrends(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);

        service.Verify(
            x => x.GetTrendsAsync("user1"),
            Times.Once);
    }
}