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
}