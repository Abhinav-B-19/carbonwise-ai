using CarbonWise.Api.DTOs.Scenario;

namespace CarbonWise.Api.Services.Interfaces;

public interface IScenarioService
{
    Task<ScenarioResponse> SimulateAsync(
        string userKey,
        ScenarioRequest request);
}