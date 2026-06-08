namespace CarbonWise.Api.DTOs.Carbon;

public class CalculateCarbonRequest
{
    public decimal CarKmPerWeek { get; set; }

    public decimal BikeKmPerWeek { get; set; }

    public decimal PublicTransportKmPerWeek { get; set; }

    public int FlightsPerYear { get; set; }

    public decimal ElectricityKwh { get; set; }

    public decimal AcHoursPerDay { get; set; }

    public string DietType { get; set; } = string.Empty;

    public int OnlineDeliveriesPerMonth { get; set; }
}