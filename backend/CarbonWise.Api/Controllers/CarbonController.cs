using CarbonWise.Api.DTOs.Carbon;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/carbon")]
public class CarbonController : ControllerBase
{
    private readonly ICarbonCalculationService _service;

    public CarbonController(
        ICarbonCalculationService service)
    {
        _service = service;
    }

    [HttpPost("calculate")]
    public async Task<IActionResult> Calculate(
        [FromHeader(Name = "X-User-Key")] string userKey,
        [FromBody] CalculateCarbonRequest request)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("User key is required.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _service.CalculateAsync(
            userKey,
            request);

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> History(
        [FromHeader(Name = "X-User-Key")] string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("User key is required.");
        }

        var result = await _service.GetHistoryAsync(
            userKey);

        return Ok(result);
    }
}