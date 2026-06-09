namespace CarbonWise.Api.DTOs.Goals;

public class UpdateGoalRequest
{
    public decimal CurrentValue { get; set; }

    public string Status { get; set; } = string.Empty;
}