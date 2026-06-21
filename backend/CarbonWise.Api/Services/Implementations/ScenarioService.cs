using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Scenario;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class ScenarioService : IScenarioService
{
    private readonly CarbonWiseDbContext _dbContext;
    private readonly IGeminiService _gemini;

    public ScenarioService(
        CarbonWiseDbContext dbContext,
        IGeminiService gemini)
    {
        _dbContext = dbContext;
        _gemini = gemini;
    }

    public async Task<ScenarioResponse> SimulateAsync(
        string userKey,
        ScenarioRequest request)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var latest = await _dbContext.CarbonEntries
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (latest == null)
        {
            throw new InvalidOperationException(
                "No carbon calculation found.");
        }

        var projectedEmission = latest.TotalEmission;

        projectedEmission -=
            request.CarKmReduction * 0.21m;

        projectedEmission -=
            request.AcHoursReduction * 15m;

        projectedEmission -=
            request.DeliveryReduction * 2m;

        if (request.SwitchToVegetarian)
        {
            projectedEmission -= 40m;
        }

        projectedEmission =
            Math.Max(0, projectedEmission);

        projectedEmission =
            Math.Round(projectedEmission, 2);

        var projectedScore =
            Math.Max(
                0,
                100 - (int)(projectedEmission / 10));

        var reduction =
            Math.Round(
                latest.TotalEmission -
                projectedEmission,
                2);

        var aiExplanation =
            await GenerateScenarioExplanation(
                latest.TotalEmission,
                projectedEmission,
                latest.CarbonScore,
                projectedScore);

        return new ScenarioResponse
        {
            CurrentEmission = latest.TotalEmission,
            ProjectedEmission = projectedEmission,
            Reduction = reduction,
            CurrentScore = latest.CarbonScore,
            ProjectedScore = projectedScore,
            AiExplanation = aiExplanation
        };
    }

    private async Task<string> GenerateScenarioExplanation(
    decimal currentEmission,
    decimal projectedEmission,
    int currentScore,
    int projectedScore)
    {
        try
        {
            var reduction =
                Math.Round(
                    currentEmission - projectedEmission,
                    2);

            var prompt = $"""
    You are an expert sustainability advisor.

    Current Carbon Emission:
    {currentEmission}

    Projected Carbon Emission:
    {projectedEmission}

    Emission Reduction:
    {reduction}

    Current Carbon Score:
    {currentScore}

    Projected Carbon Score:
    {projectedScore}

    Explain:

    1. What improvements the user made
    2. Environmental benefits
    3. Expected impact on carbon footprint
    4. A motivational message

    Keep the response under 150 words.
    """;

            var explanation =
     await _gemini.GenerateAsync(
         prompt);

            return explanation ??
                $"Your projected carbon score improves from {currentScore} to {projectedScore}.";
        }
        catch
        {
            return
                $"Your projected carbon score improves from {currentScore} to {projectedScore}. " +
                $"You could reduce emissions by {(currentEmission - projectedEmission):F2}.";
        }
    }
}