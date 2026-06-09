namespace CarbonWise.Api.DTOs.Gamification;

public class GamificationResponse
{
    public int GreenPoints { get; set; }

    public int CurrentStreak { get; set; }

    public string Level { get; set; } =
        string.Empty;

    public List<string> Achievements { get; set; } =
        new();
}