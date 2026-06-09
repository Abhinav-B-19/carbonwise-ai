namespace CarbonWise.Api.DTOs.Goals;

public class CreateGoalRequest
{
    public string GoalType { get; set; } = string.Empty;

    public decimal TargetValue { get; set; }
}