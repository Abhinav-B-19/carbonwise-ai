using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Dashboard;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly CarbonWiseDbContext _dbContext;

    public DashboardService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(
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

        var entries = await _dbContext.CarbonEntries
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        var latest = entries.FirstOrDefault();

        var activeGoals = await _dbContext.Goals
            .AsNoTracking()
            .CountAsync(x =>
                x.UserId == user.Id &&
                x.Status == "Active");

        var completedChallenges = await _dbContext.UserChallenges
            .AsNoTracking()
            .CountAsync(x =>
                x.UserId == user.Id &&
                x.Completed);

        return new DashboardSummaryResponse
        {
            LatestEmission =
                latest?.TotalEmission ?? 0,

            AverageEmission =
                entries.Any()
                    ? Math.Round(
                        entries.Average(x => x.TotalEmission),
                        2)
                    : 0,

            CarbonScore =
                latest?.CarbonScore ?? 0,

            ActiveGoals =
                activeGoals,

            CompletedChallenges =
                completedChallenges,

            TotalCalculations =
                entries.Count
        };
    }

    public async Task<DashboardTrendsResponse> GetTrendsAsync(
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

        var entries = await _dbContext.CarbonEntries
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();

        var weekly = entries
            .TakeLast(7)
            .Select(x => new TrendPointResponse
            {
                Label = x.CreatedAt.ToString("dd MMM"),
                Emission = x.TotalEmission
            })
            .ToList();

        var monthly = entries
            .GroupBy(x => new
            {
                x.CreatedAt.Year,
                x.CreatedAt.Month
            })
            .Select(g => new TrendPointResponse
            {
                Label =
                    $"{g.Key.Year}-{g.Key.Month:D2}",

                Emission =
                    Math.Round(
                        g.Average(x => x.TotalEmission),
                        2)
            })
            .ToList();

        return new DashboardTrendsResponse
        {
            Weekly = weekly,
            Monthly = monthly
        };
    }
}