namespace CarbonWise.Api.Entities;

public class ScenarioHistory
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal CurrentEmission { get; set; }

    public decimal ProjectedEmission { get; set; }

    public decimal AnnualSaving { get; set; }

    public string ScenarioJson { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}