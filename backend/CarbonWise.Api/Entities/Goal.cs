namespace CarbonWise.Api.Entities;

public class Goal
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string GoalType { get; set; } = string.Empty;

    public decimal TargetValue { get; set; }

    public decimal CurrentValue { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}