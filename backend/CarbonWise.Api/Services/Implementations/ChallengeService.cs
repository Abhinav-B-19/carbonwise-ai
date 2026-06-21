using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Challenges;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class ChallengeService : IChallengeService
{
    private readonly CarbonWiseDbContext _dbContext;

    public ChallengeService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DailyChallengeResponse> GetDailyChallengeAsync(
    string userKey)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var hasChallenges =
            await _dbContext.Challenges.AsNoTracking().AnyAsync();

        if (!hasChallenges)
        {
            return new DailyChallengeResponse
            {
                ChallengeId = 0,
                Title = "No challenges available",
                Description = "Challenge data has not been configured yet.",
                Points = 0,
                CarbonSaved = 0,
                Completed = false
            };
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var existingAssignment =
            await _dbContext.DailyChallengeAssignments
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.UserId == user.Id &&
                    x.AssignedDate == today);

        if (existingAssignment != null)
        {
            var challenge =
                await _dbContext.Challenges
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x =>
                        x.Id == existingAssignment.ChallengeId);

            if (challenge == null)
            {
                throw new KeyNotFoundException(
                    $"Challenge not found for ChallengeId: {existingAssignment.ChallengeId}");
            }

            return new DailyChallengeResponse
            {
                ChallengeId = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Points = challenge.Points,
                CarbonSaved = challenge.CarbonSaved,
                Completed = existingAssignment.Completed
            };
        }

        var latestEntry =
            await _dbContext.CarbonEntries
                .AsNoTracking()
                .Where(x => x.UserId == user.Id)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

        Challenge? selectedChallenge = null;

        if (latestEntry == null)
        {
            selectedChallenge =
                await _dbContext.Challenges
                    .AsNoTracking()
                    .OrderBy(x => x.Id)
                    .FirstOrDefaultAsync();
        }
        else
        {
            var highestEmission =
                new Dictionary<string, decimal>
                {
                    { "Transportation", latestEntry.TransportationEmission },
                    { "Home", latestEntry.HomeEmission },
                    { "Food", latestEntry.FoodEmission },
                    { "Lifestyle", latestEntry.LifestyleEmission }
                }
                .OrderByDescending(x => x.Value)
                .First()
                .Key;

            selectedChallenge =
                highestEmission switch
                {
                    "Transportation" =>
                        await _dbContext.Challenges
                            .AsNoTracking()
                            .FirstOrDefaultAsync(x =>
                                x.Title.Contains("Walk")),

                    "Home" =>
                        await _dbContext.Challenges
                            .AsNoTracking()
                            .FirstOrDefaultAsync(x =>
                                x.Title.Contains("AC")),

                    "Food" =>
                        await _dbContext.Challenges
                            .AsNoTracking()
                            .FirstOrDefaultAsync(x =>
                                x.Title.Contains("vegetarian")),

                    "Lifestyle" =>
                        await _dbContext.Challenges
                            .AsNoTracking()
                            .FirstOrDefaultAsync(x =>
                                x.Title.Contains("delivery")),

                    _ => null
                };

            if (selectedChallenge == null)
            {
                selectedChallenge =
                    await _dbContext.Challenges
                        .AsNoTracking()
                        .OrderBy(x => x.Id)
                        .FirstOrDefaultAsync();
            }
        }

        if (selectedChallenge == null)
        {
            throw new InvalidOperationException(
                "No challenge could be selected.");
        }

        var assignment =
            new DailyChallengeAssignment
            {
                UserId = user.Id,
                ChallengeId = selectedChallenge.Id,
                AssignedDate = today,
                Completed = false
            };

        _dbContext.DailyChallengeAssignments.Add(
            assignment);

        await _dbContext.SaveChangesAsync();

        return new DailyChallengeResponse
        {
            ChallengeId = selectedChallenge.Id,
            Title = selectedChallenge.Title,
            Description = selectedChallenge.Description,
            Points = selectedChallenge.Points,
            CarbonSaved = selectedChallenge.CarbonSaved,
            Completed = false
        };
    }

    public async Task<bool> CompleteChallengeAsync(
        string userKey,
        int challengeId)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return false;
        }

        var assignment =
            await _dbContext.DailyChallengeAssignments
                .FirstOrDefaultAsync(x =>
                    x.UserId == user.Id &&
                    x.ChallengeId == challengeId);

        if (assignment == null)
        {
            return false;
        }

        assignment.Completed = true;
        assignment.CompletedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<List<DailyChallengeResponse>> GetHistoryAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return new List<DailyChallengeResponse>();
        }

        return await (
            from assignment in _dbContext.DailyChallengeAssignments.AsNoTracking()
            join challenge in _dbContext.Challenges.AsNoTracking()
                on assignment.ChallengeId equals challenge.Id
            where assignment.UserId == user.Id
            orderby assignment.AssignedDate descending
            select new DailyChallengeResponse
            {
                ChallengeId = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Points = challenge.Points,
                CarbonSaved = challenge.CarbonSaved,
                Completed = assignment.Completed
            }
        ).ToListAsync();
    }

    public async Task<MissionsResponse> GetMissionsAsync()
    {
        var challenges =
            await _dbContext.Challenges
                .AsNoTracking()
                .ToListAsync();

        return new MissionsResponse
        {
            Daily =
                challenges
                    .Where(x =>
                        x.ChallengeType == "Daily")
                    .Select(MapChallenge)
                    .ToList(),

            Weekly =
                challenges
                    .Where(x =>
                        x.ChallengeType == "Weekly")
                    .Select(MapChallenge)
                    .ToList(),

            Monthly =
                challenges
                    .Where(x =>
                        x.ChallengeType == "Monthly")
                    .Select(MapChallenge)
                    .ToList()
        };
    }

    private static DailyChallengeResponse
    MapChallenge(
        Challenge challenge)
    {
        return new DailyChallengeResponse
        {
            ChallengeId = challenge.Id,
            Title = challenge.Title,
            Description = challenge.Description,
            Points = challenge.Points,
            CarbonSaved = challenge.CarbonSaved,
            Completed = false,
            Category = challenge.Category,
            ChallengeType = challenge.ChallengeType
        };
    }
}