namespace CarbonWise.Api.Entities;

public class AiChatUsage
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime UsageDate { get; set; }

    public int MessageCount { get; set; }

    public User User { get; set; } = null!;
}