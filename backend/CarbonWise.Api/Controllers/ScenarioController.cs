using CarbonWise.Api.DTOs.Scenario;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/scenario")]
public class ScenarioController : ControllerBase
{
    private readonly IScenarioService _service;

    public ScenarioController(
        IScenarioService service)
    {
        _service = service;
    }

    [HttpPost("simulate")]
    public async Task<IActionResult> Simulate(
        [FromQuery] string userKey,
        ScenarioRequest request)
    {
        var result =
            await _service.SimulateAsync(
                userKey,
                request);

        return Ok(result);
    }
}