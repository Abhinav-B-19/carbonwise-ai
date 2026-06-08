namespace CarbonWise.Api.DTOs.Carbon;

public class CalculateCarbonResponse
{
    public decimal TransportationEmission { get; set; }

    public decimal HomeEmission { get; set; }

    public decimal FoodEmission { get; set; }

    public decimal LifestyleEmission { get; set; }

    public decimal TotalEmission { get; set; }

    public int CarbonScore { get; set; }
}