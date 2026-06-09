using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Gamification;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class GamificationService
    : IGamificationService
{
    private readonly CarbonWiseDbContext _dbContext;

    public GamificationService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GamificationResponse> GetAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x =>
                x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var completedChallenges =
            await _dbContext
                .DailyChallengeAssignments
                .Where(x =>
                    x.UserId == user.Id &&
                    x.Completed)
                .CountAsync();

        var goals =
            await _dbContext.Goals
                .Where(x =>
                    x.UserId == user.Id)
                .CountAsync();

        var carbonCalculations =
            await _dbContext.CarbonEntries
                .Where(x =>
                    x.UserId == user.Id)
                .CountAsync();

        var greenPoints =
            (completedChallenges * 25)
            + (goals * 10)
            + (carbonCalculations * 5);

        var streak =
            await CalculateStreak(user.Id);

        var achievements =
            BuildAchievements(
                completedChallenges,
                greenPoints);

        var level =
            GetLevel(greenPoints);

        return new GamificationResponse
        {
            GreenPoints = greenPoints,
            CurrentStreak = streak,
            Level = level,
            Achievements = achievements
        };
    }

    private async Task<int> CalculateStreak(
        int userId)
    {
        var completedDates =
            await _dbContext
                .DailyChallengeAssignments
                .Where(x =>
                    x.UserId == userId &&
                    x.Completed)
                .OrderByDescending(x =>
                    x.AssignedDate)
                .Select(x =>
                    x.AssignedDate)
                .ToListAsync();

        if (!completedDates.Any())
        {
            return 0;
        }

        var streak = 1;

        for (int i = 1; i < completedDates.Count; i++)
        {
            if (
                completedDates[i - 1]
                .DayNumber -
                completedDates[i]
                .DayNumber == 1)
            {
                streak++;
            }
            else
            {
                break;
            }
        }

        return streak;
    }

    private static List<string>
    BuildAchievements(
        int completedChallenges,
        int greenPoints)
    {
        var achievements =
            new List<string>();

        if (completedChallenges >= 1)
        {
            achievements.Add(
                "First Challenge");
        }

        if (completedChallenges >= 7)
        {
            achievements.Add(
                "7 Day Streak");
        }

        if (greenPoints >= 100)
        {
            achievements.Add(
                "100 Green Points");
        }

        if (greenPoints >= 500)
        {
            achievements.Add(
                "Eco Warrior");
        }

        return achievements;
    }

    private static string GetLevel(
        int greenPoints)
    {
        return greenPoints switch
        {
            < 100 =>
                "Green Beginner",

            < 250 =>
                "Eco Explorer",

            < 500 =>
                "Climate Hero",

            _ =>
                "Eco Warrior"
        };
    }
}