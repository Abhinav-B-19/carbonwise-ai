namespace CarbonWise.Api.DTOs.Scenario;

public class ScenarioRequest
{
    public decimal CarKmReduction { get; set; }

    public decimal AcHoursReduction { get; set; }

    public bool SwitchToVegetarian { get; set; }

    public int DeliveryReduction { get; set; }
}