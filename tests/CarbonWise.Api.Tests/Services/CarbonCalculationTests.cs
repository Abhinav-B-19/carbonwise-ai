using CarbonWise.Api.DTOs.Carbon;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;

namespace CarbonWise.Api.Tests.Services;

public class CarbonCalculationServiceTests
{
    [Fact]
    public async Task Calculate_ShouldReturnCarbonScore()
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

        var service =
            new CarbonCalculationService(db);

        var result =
            await service.CalculateAsync(
                "user1",
                new CalculateCarbonRequest
                {
                    CarKmPerWeek = 100,
                    PublicTransportKmPerWeek = 50,
                    FlightsPerYear = 1,
                    ElectricityKwh = 250,
                    AcHoursPerDay = 5,
                    DietType = "mixed",
                    OnlineDeliveriesPerMonth = 4
                });

        result.TotalEmission.Should().BeGreaterThan(0);

        result.CarbonScore.Should()
            .BeGreaterThan(0);
    }

    [Fact]
    public async Task Calculate_ShouldThrow_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new CarbonCalculationService(db);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            async () =>
            {
                await service.CalculateAsync(
                    "missing",
                    new CalculateCarbonRequest());
            });
    }

    [Fact]
    public async Task Calculate_ShouldUseDefaultDiet_AndClampScoreToZero()
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

        var service =
            new CarbonCalculationService(db);

        var result =
            await service.CalculateAsync(
                "user1",
                new CalculateCarbonRequest
                {
                    CarKmPerWeek = 5000,
                    PublicTransportKmPerWeek = 5000,
                    FlightsPerYear = 50,
                    ElectricityKwh = 5000,
                    AcHoursPerDay = 24,
                    DietType = "something",
                    OnlineDeliveriesPerMonth = 100
                });

        result.FoodEmission
            .Should()
            .Be(80);

        result.CarbonScore
            .Should()
            .Be(0);
    }

    [Theory]
    [InlineData("vegan", 20)]
    [InlineData("vegetarian", 40)]
    [InlineData("mixed", 80)]
    [InlineData("heavymeat", 120)]
    public async Task Calculate_ShouldCalculateFoodEmission(
        string diet,
        decimal expected)
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

        var service =
            new CarbonCalculationService(db);

        var result =
            await service.CalculateAsync(
                "user1",
                new CalculateCarbonRequest
                {
                    DietType = diet
                });

        result.FoodEmission
            .Should()
            .Be(expected);
    }

    [Fact]
    public async Task GetHistory_ShouldReturnEmpty_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var service =
            new CarbonCalculationService(db);

        var result =
            await service.GetHistoryAsync(
                "missing");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetHistory_ShouldReturnHistoryOrderedDescending()
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

        db.CarbonEntries.AddRange(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 100,
                CarbonScore = 90,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 200,
                CarbonScore = 80,
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var service =
            new CarbonCalculationService(db);

        var result =
            await service.GetHistoryAsync(
                "user1");

        result.Should().HaveCount(2);

        result[0].TotalEmission
            .Should()
            .Be(200);

        result[1].TotalEmission
            .Should()
            .Be(100);
    }
}