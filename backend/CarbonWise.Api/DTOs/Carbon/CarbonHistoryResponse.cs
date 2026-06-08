namespace CarbonWise.Api.DTOs.Carbon;

public class CarbonHistoryResponse
{
    public DateTime CreatedAt { get; set; }

    public decimal TotalEmission { get; set; }

    public int CarbonScore { get; set; }
}