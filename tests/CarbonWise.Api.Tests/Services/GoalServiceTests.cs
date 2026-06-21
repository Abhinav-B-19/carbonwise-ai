using CarbonWise.Api.DTOs.Goals;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Services;

public class GoalServiceTests
{
    [Fact]
    public async Task CreateGoal_ShouldCreateGoal()
    {
        var db = DbContextFactory.Create();

        db.Users.Add(
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            });

        await db.SaveChangesAsync();

        var service =
            new GoalService(db);

        var goal =
            await service.CreateGoalAsync(
                "user1",
                new CreateGoalRequest
                {
                    GoalType = "Reduce Carbon",
                    TargetValue = 20
                });

        goal.Should().NotBeNull();

        goal.Status.Should().Be("Active");
    }

    [Fact]
    public async Task DeleteGoal_ShouldReturnFalse_WhenMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new GoalService(db);

        var result =
            await service.DeleteGoalAsync(
                999);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CreateGoal_ShouldThrow_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new GoalService(db);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () =>
                service.CreateGoalAsync(
                    "missing",
                    new CreateGoalRequest()));
    }

    [Fact]
    public async Task GetGoals_ShouldReturnEmpty_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new GoalService(db);

        var result =
            await service.GetGoalsAsync(
                "missing");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetGoals_ShouldReturnGoalsOrderedDescending()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "Abhinav",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.Goals.AddRange(
            new Goal
            {
                UserId = user.Id,
                GoalType = "Old",
                Status = "Active",
                CreatedAt =
                    DateTime.UtcNow.AddDays(-1)
            },
            new Goal
            {
                UserId = user.Id,
                GoalType = "New",
                Status = "Completed",
                CreatedAt =
                    DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var service =
            new GoalService(db);

        var result =
            await service.GetGoalsAsync(
                "user1");

        result.Should().HaveCount(2);

        result[0].GoalType
            .Should().Be("New");

        result[1].GoalType
            .Should().Be("Old");
    }

    [Fact]
    public async Task UpdateGoal_ShouldReturnNull_WhenGoalMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new GoalService(db);

        var result =
            await service.UpdateGoalAsync(
                999,
                new UpdateGoalRequest());

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateGoal_ShouldUpdateGoal()
    {
        var db = DbContextFactory.Create();

        var goal = new Goal
        {
            GoalType = "Reduce Carbon",
            TargetValue = 20,
            CurrentValue = 0,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        db.Goals.Add(goal);

        await db.SaveChangesAsync();

        var service =
            new GoalService(db);

        var result =
            await service.UpdateGoalAsync(
                goal.Id,
                new UpdateGoalRequest
                {
                    CurrentValue = 10,
                    Status = "Completed"
                });

        result.Should().NotBeNull();

        result!.CurrentValue
            .Should().Be(10);

        result.Status
            .Should().Be("Completed");

        var saved =
            await db.Goals.FindAsync(goal.Id);

        saved!.CurrentValue
            .Should().Be(10);

        saved.Status
            .Should().Be("Completed");
    }

    [Fact]
    public async Task DeleteGoal_ShouldRemoveGoal()
    {
        var db = DbContextFactory.Create();

        var goal = new Goal
        {
            GoalType = "Reduce Carbon",
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        db.Goals.Add(goal);

        await db.SaveChangesAsync();

        var service =
            new GoalService(db);

        var result =
            await service.DeleteGoalAsync(
                goal.Id);

        result.Should().BeTrue();

        db.Goals.Should().BeEmpty();
    }
}