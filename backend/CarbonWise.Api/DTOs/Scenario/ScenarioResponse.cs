namespace CarbonWise.Api.DTOs.Scenario;

public class ScenarioResponse
{
    public decimal CurrentEmission { get; set; }

    public decimal ProjectedEmission { get; set; }

    public decimal Reduction { get; set; }

    public int CurrentScore { get; set; }

    public int ProjectedScore { get; set; }

    public string AiExplanation { get; set; } = string.Empty;
}