using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(
        IDashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("UserKey is required.");
        }

        var result = await _service.GetSummaryAsync(userKey);

        return Ok(result);
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends(
        [FromQuery] string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("UserKey is required.");
        }

        var result = await _service.GetTrendsAsync(userKey);

        return Ok(result);
    }
}