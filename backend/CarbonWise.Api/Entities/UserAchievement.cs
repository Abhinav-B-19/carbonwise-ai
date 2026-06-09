namespace CarbonWise.Api.Entities;

public class UserAchievement
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string AchievementName { get; set; } =
        string.Empty;

    public DateTime EarnedAt { get; set; }
}