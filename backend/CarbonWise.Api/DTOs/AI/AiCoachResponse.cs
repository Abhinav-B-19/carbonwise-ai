namespace CarbonWise.Api.DTOs.AI;

public class AiCoachResponse
{
    public string Insight { get; set; } = string.Empty;

    public DateTime GeneratedAt { get; set; }
}