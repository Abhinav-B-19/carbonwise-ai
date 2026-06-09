namespace CarbonWise.Api.DTOs.Goals;

public class GoalResponse
{
    public int Id { get; set; }

    public string GoalType { get; set; } = string.Empty;

    public decimal TargetValue { get; set; }

    public decimal CurrentValue { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}