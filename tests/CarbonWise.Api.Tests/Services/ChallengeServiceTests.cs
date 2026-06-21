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

    [Fact]
    public async Task GetDailyChallenge_ShouldThrow_WhenUserMissing()
    {
        var db = DbContextFactory.Create();
        var service = new ChallengeService(db);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => service.GetDailyChallengeAsync("missing"));
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldReturnExistingAssignment()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        var challenge = new Challenge
        {
            Title = "Walk",
            Description = "Desc",
            Points = 10,
            CarbonSaved = 2
        };

        db.Users.Add(user);
        db.Challenges.Add(challenge);

        await db.SaveChangesAsync();

        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                ChallengeId = challenge.Id,
                AssignedDate =
                    DateOnly.FromDateTime(DateTime.UtcNow),
                Completed = true
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync(
                "user1");

        result.Title.Should().Be("Walk");
        result.Completed.Should().BeTrue();
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldThrow_WhenAssignedChallengeMissing()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        // Make AnyAsync() return true
        db.Challenges.Add(
            new Challenge
            {
                Id = 1,
                Title = "Walk",
                Description = "Desc",
                Points = 10,
                CarbonSaved = 5
            });

        await db.SaveChangesAsync();

        // Reference a challenge that doesn't exist
        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                ChallengeId = 999,
                AssignedDate =
                    DateOnly.FromDateTime(
                        DateTime.UtcNow)
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () =>
                service.GetDailyChallengeAsync(
                    "user1"));
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldSelectFirst_WhenNoCarbonHistory()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);

        db.Challenges.Add(
            new Challenge
            {
                Title = "Walk",
                Description = "Desc",
                Points = 1,
                CarbonSaved = 1
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync(
                "user1");

        result.Title.Should().Be("Walk");
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldPickTransportationChallenge()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TransportationEmission = 100,
                HomeEmission = 1,
                FoodEmission = 1,
                LifestyleEmission = 1
            });

        db.Challenges.Add(
            new Challenge
            {
                Title = "Walk today",
                Description = "Desc"
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync(
                "user1");

        result.Title.Should()
            .Contain("Walk");
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldFallback_WhenCategoryChallengeMissing()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TransportationEmission = 100
            });

        db.Challenges.Add(
            new Challenge
            {
                Title = "Fallback"
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync(
                "user1");

        result.Title.Should()
            .Be("Fallback");
    }

    [Fact]
    public async Task CompleteChallenge_ShouldReturnFalse_WhenUserMissing()
    {
        var db = DbContextFactory.Create();
        var service = new ChallengeService(db);

        var result =
            await service.CompleteChallengeAsync(
                "missing",
                1);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CompleteChallenge_ShouldMarkCompleted()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var assignment =
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                ChallengeId = 1
            };

        db.DailyChallengeAssignments.Add(
            assignment);

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.CompleteChallengeAsync(
                "user1",
                1);

        result.Should().BeTrue();

        assignment.Completed
            .Should().BeTrue();

        assignment.CompletedAt
            .Should().NotBeNull();
    }

    [Fact]
    public async Task GetHistory_ShouldReturnEmpty_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetHistoryAsync(
                "missing");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetMissions_ShouldGroupChallenges()
    {
        var db = DbContextFactory.Create();

        db.Challenges.AddRange(
            new Challenge
            {
                Title = "D",
                ChallengeType = "Daily",
                Category = "T"
            },
            new Challenge
            {
                Title = "W",
                ChallengeType = "Weekly",
                Category = "T"
            },
            new Challenge
            {
                Title = "M",
                ChallengeType = "Monthly",
                Category = "T"
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetMissionsAsync();

        result.Daily.Should().HaveCount(1);
        result.Weekly.Should().HaveCount(1);
        result.Monthly.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldSelectHomeChallenge()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                HomeEmission = 100,
                TransportationEmission = 1,
                FoodEmission = 1,
                LifestyleEmission = 1
            });

        db.Challenges.Add(
            new Challenge
            {
                Title = "Reduce AC usage",
                Description = "Desc",
                Points = 10,
                CarbonSaved = 5
            });

        await db.SaveChangesAsync();

        var service = new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync("user1");

        result.Title.Should().Be("Reduce AC usage");
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldSelectFoodChallenge()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                FoodEmission = 100,
                TransportationEmission = 1,
                HomeEmission = 1,
                LifestyleEmission = 1
            });

        db.Challenges.Add(
            new Challenge
            {
                Title = "Try vegetarian meals",
                Description = "Desc",
                Points = 10,
                CarbonSaved = 5
            });

        await db.SaveChangesAsync();

        var service = new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync("user1");

        result.Title.Should().Be("Try vegetarian meals");
    }

    [Fact]
    public async Task GetDailyChallenge_ShouldSelectLifestyleChallenge()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                LifestyleEmission = 100,
                TransportationEmission = 1,
                HomeEmission = 1,
                FoodEmission = 1
            });

        db.Challenges.Add(
            new Challenge
            {
                Title = "Reduce delivery orders",
                Description = "Desc",
                Points = 10,
                CarbonSaved = 5
            });

        await db.SaveChangesAsync();

        var service = new ChallengeService(db);

        var result =
            await service.GetDailyChallengeAsync("user1");

        result.Title.Should().Be("Reduce delivery orders");
    }

    [Fact]
    public async Task GetHistory_ShouldReturnAssignments()
    {
        var db = DbContextFactory.Create();

        var user = new User
        {
            UserKey = "user1",
            Name = "A",
            Email = "a@test.com"
        };

        db.Users.Add(user);

        var challenge = new Challenge
        {
            Title = "Walk",
            Description = "Desc",
            Points = 10,
            CarbonSaved = 5
        };

        db.Challenges.Add(challenge);

        await db.SaveChangesAsync();

        db.DailyChallengeAssignments.Add(
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                ChallengeId = challenge.Id,
                AssignedDate =
                    DateOnly.FromDateTime(
                        DateTime.UtcNow),
                Completed = true
            });

        await db.SaveChangesAsync();

        var service =
            new ChallengeService(db);

        var result =
            await service.GetHistoryAsync("user1");

        result.Should().HaveCount(1);

        result[0].ChallengeId
            .Should().Be(challenge.Id);

        result[0].Title
            .Should().Be("Walk");

        result[0].Completed
            .Should().BeTrue();
    }
}