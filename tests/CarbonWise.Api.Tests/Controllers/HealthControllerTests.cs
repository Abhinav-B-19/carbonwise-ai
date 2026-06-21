using CarbonWise.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Controllers;

public class HealthControllerTests
{
    [Fact]
    public void Get_ShouldReturnHealthyStatus()
    {
        // Arrange
        var controller = new HealthController();

        // Act
        var result = controller.Get();

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        var okResult = result as OkObjectResult;

        okResult!.StatusCode.Should().Be(200);

        var value = okResult.Value!;

        var status =
            value.GetType()
                .GetProperty("Status")!
                .GetValue(value)?
                .ToString();

        var timestamp =
            (DateTime)value.GetType()
                .GetProperty("Timestamp")!
                .GetValue(value)!;

        status.Should().Be("Healthy");
        timestamp.Should().BeCloseTo(
            DateTime.UtcNow,
            TimeSpan.FromSeconds(5));
    }
}