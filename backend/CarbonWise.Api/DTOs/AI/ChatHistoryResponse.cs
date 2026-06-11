namespace CarbonWise.Api.DTOs.AI;

public class ChatHistoryResponse
{
    public string Role { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}