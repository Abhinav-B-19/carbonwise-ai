using System.ComponentModel.DataAnnotations;

namespace CarbonWise.Api.DTOs.Carbon;

public class CalculateCarbonRequest
{
    [Range(0, 10000)]
    public decimal CarKmPerWeek { get; set; }

    [Range(0, 10000)]
    public decimal BikeKmPerWeek { get; set; }

    [Range(0, 10000)]
    public decimal PublicTransportKmPerWeek { get; set; }

    [Range(0, 10000)]
    public int FlightsPerYear { get; set; }

    [Range(0, 10000)]
    public decimal ElectricityKwh { get; set; }

    [Range(0, 10000)]
    public decimal AcHoursPerDay { get; set; }

    [Range(0, 10000)]
    public string DietType { get; set; } = string.Empty;

    [Range(0, 10000)]
    public int OnlineDeliveriesPerMonth { get; set; }
}