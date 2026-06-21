using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Services;

public class GamificationServiceTests
{
    [Fact]
    public async Task Get_ShouldThrow_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new GamificationService(db);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => service.GetAsync("missing"));
    }

    [Fact]
    public async Task Get_ShouldReturnGreenBeginner_WhenNoActivity()
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
            new GamificationService(db);

        var result =
            await service.GetAsync("user1");

        result.GreenPoints.Should().Be(0);
        result.CurrentStreak.Should().Be(0);
        result.Level.Should().Be("Green Beginner");
        result.Achievements.Should().BeEmpty();
    }

    [Fact]
    public async Task Get_ShouldReturnEcoExplorer()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                Completed = true,
                AssignedDate =
                    DateOnly.FromDateTime(
                        DateTime.UtcNow)
            });

        db.Goals.AddRange(
            Enumerable.Range(1, 5)
                .Select(_ => new Goal
                {
                    UserId = user.Id,
                    GoalType = "Goal",
                    Status = "Active"
                }));

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 10,
                CarbonScore = 90
            });

        await db.SaveChangesAsync();

        var service =
            new GamificationService(db);

        var result =
            await service.GetAsync("user1");

        result.GreenPoints.Should().Be(80);
        result.Level.Should().Be("Green Beginner");
        result.Achievements.Should()
            .Contain("First Challenge");
    }

    [Fact]
    public async Task Get_ShouldReturnClimateHero_AndAchievements()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var today =
            DateOnly.FromDateTime(
                DateTime.UtcNow);

        for (int i = 0; i < 7; i++)
        {
            db.DailyChallengeAssignments.Add(
                new DailyChallengeAssignment
                {
                    UserId = user.Id,
                    Completed = true,
                    AssignedDate =
                        today.AddDays(-i)
                });
        }

        db.Goals.AddRange(
            Enumerable.Range(1, 5)
                .Select(_ => new Goal
                {
                    UserId = user.Id,
                    GoalType = "Goal",
                    Status = "Active"
                }));

        db.CarbonEntries.AddRange(
            Enumerable.Range(1, 10)
                .Select(_ => new CarbonEntry
                {
                    UserId = user.Id,
                    TotalEmission = 10,
                    CarbonScore = 90
                }));

        await db.SaveChangesAsync();

        var service =
            new GamificationService(db);

        var result =
            await service.GetAsync("user1");

        result.GreenPoints.Should().Be(275);
        result.Level.Should().Be("Climate Hero");

        result.CurrentStreak.Should().Be(7);

        result.Achievements.Should()
            .Contain("First Challenge");

        result.Achievements.Should()
            .Contain("7 Day Streak");

        result.Achievements.Should()
            .Contain("100 Green Points");
    }

    [Fact]
    public async Task Get_ShouldReturnEcoWarrior()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var today =
            DateOnly.FromDateTime(
                DateTime.UtcNow);

        for (int i = 0; i < 20; i++)
        {
            db.DailyChallengeAssignments.Add(
                new DailyChallengeAssignment
                {
                    UserId = user.Id,
                    Completed = true,
                    AssignedDate =
                        today.AddDays(-i)
                });
        }

        await db.SaveChangesAsync();

        var service =
            new GamificationService(db);

        var result =
            await service.GetAsync("user1");

        result.GreenPoints.Should().Be(500);
        result.Level.Should().Be("Eco Warrior");

        result.Achievements.Should()
            .Contain("Eco Warrior");
    }

    [Fact]
    public async Task Get_ShouldBreakStreak_WhenDatesAreNotConsecutive()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var today =
            DateOnly.FromDateTime(
                DateTime.UtcNow);

        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                Completed = true,
                AssignedDate = today
            });

        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                Completed = true,
                AssignedDate =
                    today.AddDays(-3)
            });

        await db.SaveChangesAsync();

        var service =
            new GamificationService(db);

        var result =
            await service.GetAsync("user1");

        result.CurrentStreak.Should().Be(1);
    }
}