using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly IAiCoachService _service;

    public AiController(
        IAiCoachService service)
    {
        _service = service;
    }

    [HttpPost("coach")]
    public async Task<IActionResult> Coach(
        [FromQuery] string userKey)
    {
        var result =
            await _service.GenerateAdviceAsync(
                userKey);

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> History(
        [FromQuery] string userKey)
    {
        var result =
            await _service.GetHistoryAsync(
                userKey);

        return Ok(result);
    }
}