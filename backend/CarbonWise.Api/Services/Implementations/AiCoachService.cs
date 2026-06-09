using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Google.GenAI;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class AiCoachService : IAiCoachService
{
    private readonly CarbonWiseDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AiCoachService(
        CarbonWiseDbContext dbContext,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<AiCoachResponse> GenerateAdviceAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var latestEntry = await _dbContext.CarbonEntries
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (latestEntry == null)
        {
            throw new InvalidOperationException(
                "No carbon calculation found.");
        }

        var goals = await _dbContext.Goals
            .Where(x => x.UserId == user.Id)
            .ToListAsync();

        var apiKey = _configuration["Gemini:ApiKey"];

        var client = new Client(apiKey: apiKey);

        var prompt = $"""
You are a sustainability coach.

User Name: {user.Name}

Carbon Score: {latestEntry.CarbonScore}

Transportation Emission: {latestEntry.TransportationEmission}

Home Emission: {latestEntry.HomeEmission}

Food Emission: {latestEntry.FoodEmission}

Lifestyle Emission: {latestEntry.LifestyleEmission}

Provide:

1. Personalized analysis
2. Three practical actions
3. Estimated improvements
4. Motivation

Keep under 250 words.
""";

        var response = await client.Models.GenerateContentAsync("gemini-2.5-flash", prompt);

        var insight = response.Text ?? "No advice generated.";

        var aiInsight = new AiInsight
        {
            UserId = user.Id,
            InsightType = "CarbonCoach",
            Prompt = prompt,
            Response = insight,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.AiInsights.Add(aiInsight);

        await _dbContext.SaveChangesAsync();

        return new AiCoachResponse
        {
            Insight = insight,
            GeneratedAt = DateTime.UtcNow
        };
    }

    public async Task<List<AiHistoryResponse>> GetHistoryAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return new();
        }

        return await _dbContext.AiInsights
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AiHistoryResponse
            {
                Insight = x.Response,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }
}