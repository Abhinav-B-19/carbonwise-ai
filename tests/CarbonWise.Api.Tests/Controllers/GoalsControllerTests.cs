using CarbonWise.Api.Controllers;
using CarbonWise.Api.DTOs.Goals;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CarbonWise.Api.Tests.Controllers;

public class GoalsControllerTests
{
    [Fact]
    public async Task CreateGoal_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        var response =
            new GoalResponse
            {
                Id = 1,
                GoalType = "Reduce Carbon",
                TargetValue = 100,
                CurrentValue = 0,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

        service
            .Setup(x =>
                x.CreateGoalAsync(
                    "user1",
                    It.IsAny<CreateGoalRequest>()))
            .ReturnsAsync(response);

        var controller =
            new GoalsController(
                service.Object);

        var request =
            new CreateGoalRequest
            {
                GoalType = "Reduce Carbon",
                TargetValue = 100
            };

        // Act
        var result =
            await controller.CreateGoal(
                "user1",
                request);

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);
    }

    [Fact]
    public async Task GetGoals_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        var response =
            new List<GoalResponse>
            {
                new()
                {
                    Id = 1,
                    GoalType = "Reduce Carbon",
                    Status = "Active"
                }
            };

        service
            .Setup(x =>
                x.GetGoalsAsync("user1"))
            .ReturnsAsync(response);

        var controller =
            new GoalsController(
                service.Object);

        // Act
        var result =
            await controller.GetGoals(
                "user1");

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);
    }

    [Fact]
    public async Task UpdateGoal_ShouldReturnNotFound_WhenGoalMissing()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        service
            .Setup(x =>
                x.UpdateGoalAsync(
                    1,
                    It.IsAny<UpdateGoalRequest>()))
            .ReturnsAsync((GoalResponse?)null);

        var controller =
            new GoalsController(
                service.Object);

        // Act
        var result =
            await controller.UpdateGoal(
                1,
                new UpdateGoalRequest());

        // Assert
        result.Should()
            .BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task UpdateGoal_ShouldReturnOk()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        var response =
            new GoalResponse
            {
                Id = 1,
                GoalType = "Reduce Carbon",
                CurrentValue = 50,
                Status = "Completed"
            };

        service
            .Setup(x =>
                x.UpdateGoalAsync(
                    1,
                    It.IsAny<UpdateGoalRequest>()))
            .ReturnsAsync(response);

        var controller =
            new GoalsController(
                service.Object);

        // Act
        var result =
            await controller.UpdateGoal(
                1,
                new UpdateGoalRequest
                {
                    CurrentValue = 50,
                    Status = "Completed"
                });

        // Assert
        var ok =
            result.Should()
                .BeOfType<OkObjectResult>()
                .Subject;

        ok.StatusCode.Should().Be(200);
        ok.Value.Should().Be(response);
    }

    [Fact]
    public async Task DeleteGoal_ShouldReturnNotFound_WhenGoalMissing()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        service
            .Setup(x =>
                x.DeleteGoalAsync(1))
            .ReturnsAsync(false);

        var controller =
            new GoalsController(
                service.Object);

        // Act
        var result =
            await controller.DeleteGoal(1);

        // Assert
        result.Should()
            .BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task DeleteGoal_ShouldReturnNoContent_WhenDeleted()
    {
        // Arrange
        var service =
            new Mock<IGoalService>();

        service
            .Setup(x =>
                x.DeleteGoalAsync(1))
            .ReturnsAsync(true);

        var controller =
            new GoalsController(
                service.Object);

        // Act
        var result =
            await controller.DeleteGoal(1);

        // Assert
        result.Should()
            .BeOfType<NoContentResult>();
    }
}