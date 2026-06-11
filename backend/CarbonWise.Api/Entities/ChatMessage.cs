namespace CarbonWise.Api.Entities;

public class ChatMessage
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Role { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}