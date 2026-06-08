namespace CarbonWise.Api.Entities;

public class AiInsight
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string InsightType { get; set; } = string.Empty;

    public string Prompt { get; set; } = string.Empty;

    public string Response { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}