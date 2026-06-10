using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Services;

public class ChallengeServiceTests
{
    [Fact]
    public async Task GetDailyChallenge_ShouldReturnFallback_WhenNoChallengesExist()
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
            new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync(
                "user1");

        result.Title.Should()
            .Be("No challenges available");
    }

    [Fact]
    public async Task CompleteChallenge_ShouldReturnFalse_WhenAssignmentMissing()
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
            new ChallengeService(db);

        var result =
            await service.CompleteChallengeAsync(
                "user1",
                1);

        result.Should().BeFalse();
    }
}