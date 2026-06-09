using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/gamification")]
public class GamificationController
    : ControllerBase
{
    private readonly IGamificationService
        _service;

    public GamificationController(
        IGamificationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string userKey)
    {
        var result =
            await _service.GetAsync(
                userKey);

        return Ok(result);
    }
}