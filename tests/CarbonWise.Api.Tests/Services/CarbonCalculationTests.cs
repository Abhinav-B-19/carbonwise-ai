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
}