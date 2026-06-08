using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Carbon;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class CarbonCalculationService : ICarbonCalculationService
{
    private readonly CarbonWiseDbContext _dbContext;

    public CarbonCalculationService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CalculateCarbonResponse> CalculateAsync(
        string userKey,
        CalculateCarbonRequest request)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var transportationEmission =
            (request.CarKmPerWeek * 0.21m)
            + (request.PublicTransportKmPerWeek * 0.08m)
            + (request.FlightsPerYear * 250m / 12m);

        var homeEmission =
            (request.ElectricityKwh * 0.82m)
            + (request.AcHoursPerDay * 30m * 0.5m);

        decimal foodEmission =
            request.DietType.ToLower() switch
            {
                "vegan" => 20m,
                "vegetarian" => 40m,
                "mixed" => 80m,
                "heavymeat" => 120m,
                _ => 80m
            };

        var lifestyleEmission =
            request.OnlineDeliveriesPerMonth * 2m;

        var totalEmission =
            transportationEmission
            + homeEmission
            + foodEmission
            + lifestyleEmission;

        transportationEmission =
            Math.Round(transportationEmission, 2);

        homeEmission =
            Math.Round(homeEmission, 2);

        foodEmission =
            Math.Round(foodEmission, 2);

        lifestyleEmission =
            Math.Round(lifestyleEmission, 2);

        totalEmission =
            Math.Round(totalEmission, 2);

        var carbonScore =
            Math.Max(
                0,
                100 - (int)(totalEmission / 10));

        var entry = new CarbonEntry
        {
            UserId = user.Id,
            TransportationEmission = transportationEmission,
            HomeEmission = homeEmission,
            FoodEmission = foodEmission,
            LifestyleEmission = lifestyleEmission,
            TotalEmission = totalEmission,
            CarbonScore = carbonScore,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.CarbonEntries.Add(entry);

        await _dbContext.SaveChangesAsync();

        return new CalculateCarbonResponse
        {
            TransportationEmission = transportationEmission,
            HomeEmission = homeEmission,
            FoodEmission = foodEmission,
            LifestyleEmission = lifestyleEmission,
            TotalEmission = totalEmission,
            CarbonScore = carbonScore
        };
    }

    public async Task<List<CarbonHistoryResponse>> GetHistoryAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return new List<CarbonHistoryResponse>();
        }

        return await _dbContext.CarbonEntries
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CarbonHistoryResponse
            {
                CreatedAt = x.CreatedAt,
                TotalEmission = x.TotalEmission,
                CarbonScore = x.CarbonScore
            })
            .ToListAsync();
    }
}