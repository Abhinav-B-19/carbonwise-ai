namespace CarbonWise.Api.DTOs.Goals;

public class CreateGoalRequest
{
    [Required]
    [StringLength(100)]
    public string GoalType { get; set; } = string.Empty;

    [Range(1, 100000)]
    public decimal TargetValue { get; set; }
}