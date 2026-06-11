namespace CarbonWise.Api.DTOs.AI;

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;

    public int RemainingMessages { get; set; }
}