namespace CarbonWise.Api.DTOs.Challenges;

public class DailyChallengeResponse
{
    public int ChallengeId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Points { get; set; }

    public decimal CarbonSaved { get; set; }

    public bool Completed { get; set; }

    public string Category { get; set; } = string.Empty;

    public string ChallengeType { get; set; } = string.Empty;
}