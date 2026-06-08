namespace CarbonWise.Api.Entities;

public class Challenge
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Difficulty { get; set; } = string.Empty;

    public int Points { get; set; }

    public decimal CarbonSaved { get; set; }
}