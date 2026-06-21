namespace CarbonWise.Api.DTOs.Scenario;

public class ScenarioRequest
{
    [Range(0, 10000)]
    public decimal CarKmReduction { get; set; }

    [Range(0, 10000)]
    public decimal AcHoursReduction { get; set; }

    [Range(0, 10000)]
    public bool SwitchToVegetarian { get; set; }

    [Range(0, 10000)]
    public int DeliveryReduction { get; set; }
}