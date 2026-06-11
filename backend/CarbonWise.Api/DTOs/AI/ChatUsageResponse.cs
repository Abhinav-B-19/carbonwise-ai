namespace CarbonWise.Api.DTOs.AI;

public class ChatUsageResponse
{
    public int Used { get; set; }

    public int Limit { get; set; }

    public int Remaining { get; set; }
}