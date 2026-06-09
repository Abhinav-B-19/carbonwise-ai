using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Goals;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class GoalService : IGoalService
{
    private readonly CarbonWiseDbContext _dbContext;

    public GoalService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GoalResponse> CreateGoalAsync(
        string userKey,
        CreateGoalRequest request)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found for UserKey: {userKey}");
        }

        var goal = new Goal
        {
            UserId = user.Id,
            GoalType = request.GoalType,
            TargetValue = request.TargetValue,
            CurrentValue = 0,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Goals.Add(goal);

        await _dbContext.SaveChangesAsync();

        return new GoalResponse
        {
            Id = goal.Id,
            GoalType = goal.GoalType,
            TargetValue = goal.TargetValue,
            CurrentValue = goal.CurrentValue,
            Status = goal.Status,
            CreatedAt = goal.CreatedAt
        };
    }

    public async Task<List<GoalResponse>> GetGoalsAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return new List<GoalResponse>();
        }

        return await _dbContext.Goals
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new GoalResponse
            {
                Id = x.Id,
                GoalType = x.GoalType,
                TargetValue = x.TargetValue,
                CurrentValue = x.CurrentValue,
                Status = x.Status,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<GoalResponse?> UpdateGoalAsync(
        int goalId,
        UpdateGoalRequest request)
    {
        var goal = await _dbContext.Goals
            .FirstOrDefaultAsync(x => x.Id == goalId);

        if (goal == null)
        {
            return null;
        }

        goal.CurrentValue = request.CurrentValue;
        goal.Status = request.Status;

        await _dbContext.SaveChangesAsync();

        return new GoalResponse
        {
            Id = goal.Id,
            GoalType = goal.GoalType,
            TargetValue = goal.TargetValue,
            CurrentValue = goal.CurrentValue,
            Status = goal.Status,
            CreatedAt = goal.CreatedAt
        };
    }

    public async Task<bool> DeleteGoalAsync(
        int goalId)
    {
        var goal = await _dbContext.Goals
            .FirstOrDefaultAsync(x => x.Id == goalId);

        if (goal == null)
        {
            return false;
        }

        _dbContext.Goals.Remove(goal);

        await _dbContext.SaveChangesAsync();

        return true;
    }
}