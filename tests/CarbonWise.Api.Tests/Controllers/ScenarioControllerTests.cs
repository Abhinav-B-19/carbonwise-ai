using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Scenario;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CarbonWise.Api.Tests.Controllers;

public class ScenarioControllerTests
{
    private readonly Mock<IScenarioService> _serviceMock;
    private readonly ScenarioController _controller;

    public ScenarioControllerTests()
    {
        _serviceMock = new Mock<IScenarioService>();
        _controller = new ScenarioController(_serviceMock.Object);
    }

    [Fact]
    public async Task Simulate_ReturnsOk_WithServiceResult()
    {
        // Arrange
        const string userKey = "user1";

        var request = new ScenarioRequest();
        var response = new ScenarioResponse();

        _serviceMock
            .Setup(x => x.SimulateAsync(userKey, request))
            .Returns(Task.FromResult(response));

        // Act
        var result = await _controller.Simulate(userKey, request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Same(response, okResult.Value);

        _serviceMock.Verify(
            x => x.SimulateAsync(userKey, request),
            Times.Once);
    }
}