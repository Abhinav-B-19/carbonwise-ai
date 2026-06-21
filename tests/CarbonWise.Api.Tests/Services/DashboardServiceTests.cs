using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Dashboard;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CarbonWise.Api.Tests.Services;

public class DashboardServiceTests : IDisposable
{
    private readonly CarbonWiseDbContext _dbContext;
    private readonly DashboardService _service;

    public DashboardServiceTests()
    {
        var options = new DbContextOptionsBuilder<CarbonWiseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _dbContext = new CarbonWiseDbContext(options);
        _service = new DashboardService(_dbContext);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    [Fact]
    public async Task GetSummaryAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.GetSummaryAsync("invalid-key"));

        Assert.Equal(
            "User not found for UserKey: invalid-key",
            ex.Message);
    }

    [Fact]
    public async Task GetSummaryAsync_ShouldReturnZeroValues_WhenNoEntriesExist()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            UserKey = "user-1"
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetSummaryAsync("user-1");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.LatestEmission);
        Assert.Equal(0, result.AverageEmission);
        Assert.Equal(0, result.CarbonScore);
        Assert.Equal(0, result.ActiveGoals);
        Assert.Equal(0, result.CompletedChallenges);
        Assert.Equal(0, result.TotalCalculations);
    }

    [Fact]
    public async Task GetSummaryAsync_ShouldReturnSummary_WhenDataExists()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            UserKey = "user-1"
        };

        _dbContext.Users.Add(user);

        _dbContext.CarbonEntries.AddRange(
            new CarbonEntry
            {
                UserId = 1,
                TotalEmission = 100,
                CarbonScore = 50,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new CarbonEntry
            {
                UserId = 1,
                TotalEmission = 200,
                CarbonScore = 80,
                CreatedAt = DateTime.UtcNow
            });

        _dbContext.Goals.AddRange(
            new Goal
            {
                UserId = 1,
                Status = "Active"
            },
            new Goal
            {
                UserId = 1,
                Status = "Completed"
            });

        _dbContext.UserChallenges.AddRange(
            new UserChallenge
            {
                UserId = 1,
                Completed = true
            },
            new UserChallenge
            {
                UserId = 1,
                Completed = false
            });

        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetSummaryAsync("user-1");

        // Assert
        Assert.Equal(200, result.LatestEmission);
        Assert.Equal(150, result.AverageEmission);
        Assert.Equal(80, result.CarbonScore);
        Assert.Equal(1, result.ActiveGoals);
        Assert.Equal(1, result.CompletedChallenges);
        Assert.Equal(2, result.TotalCalculations);
    }

    [Fact]
    public async Task GetTrendsAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.GetTrendsAsync("invalid-key"));

        Assert.Equal(
            "User not found for UserKey: invalid-key",
            ex.Message);
    }

    [Fact]
    public async Task GetTrendsAsync_ShouldReturnEmptyCollections_WhenNoEntriesExist()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            UserKey = "user-1"
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetTrendsAsync("user-1");

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Weekly);
        Assert.Empty(result.Monthly);
    }

    [Fact]
    public async Task GetTrendsAsync_ShouldReturnWeeklyAndMonthlyTrends()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            UserKey = "user-1"
        };

        _dbContext.Users.Add(user);

        var date1 = new DateTime(2024, 1, 1);
        var date2 = new DateTime(2024, 1, 2);
        var date3 = new DateTime(2024, 2, 1);

        _dbContext.CarbonEntries.AddRange(
            new CarbonEntry
            {
                UserId = 1,
                TotalEmission = 100,
                CreatedAt = date1
            },
            new CarbonEntry
            {
                UserId = 1,
                TotalEmission = 200,
                CreatedAt = date2
            },
            new CarbonEntry
            {
                UserId = 1,
                TotalEmission = 300,
                CreatedAt = date3
            });

        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetTrendsAsync("user-1");

        // Assert
        Assert.Equal(3, result.Weekly.Count);

        Assert.Equal("01 Jan", result.Weekly[0].Label);
        Assert.Equal(100, result.Weekly[0].Emission);

        Assert.Equal("02 Jan", result.Weekly[1].Label);
        Assert.Equal(200, result.Weekly[1].Emission);

        Assert.Equal("01 Feb", result.Weekly[2].Label);
        Assert.Equal(300, result.Weekly[2].Emission);

        Assert.Equal(2, result.Monthly.Count);

        var january = result.Monthly.Single(x => x.Label == "2024-01");
        Assert.Equal(150, january.Emission);

        var february = result.Monthly.Single(x => x.Label == "2024-02");
        Assert.Equal(300, february.Emission);
    }
}