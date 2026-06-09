using CarbonWise.Api.DTOs.Goals;

namespace CarbonWise.Api.Services.Interfaces;

public interface IGoalService
{
    Task<GoalResponse> CreateGoalAsync(
        string userKey,
        CreateGoalRequest request);

    Task<List<GoalResponse>> GetGoalsAsync(
        string userKey);

    Task<GoalResponse?> UpdateGoalAsync(
        int goalId,
        UpdateGoalRequest request);

    Task<bool> DeleteGoalAsync(
        int goalId);
}