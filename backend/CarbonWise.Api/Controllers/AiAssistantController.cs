using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/assistant")]
public class AiAssistantController : ControllerBase
{
    private readonly IAiAssistantService _service;

    public AiAssistantController(
        IAiAssistantService service)
    {
        _service = service;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat(
        [FromBody] ChatRequest request)
    {
        return Ok(
            await _service.SendMessageAsync(request));
    }

    [HttpGet("history")]
    public async Task<IActionResult> History(
        [FromQuery] string userKey)
    {
        return Ok(
            await _service.GetHistoryAsync(userKey));
    }

    [HttpDelete("history")]
    public async Task<IActionResult> Clear(
        [FromQuery] string userKey)
    {
        await _service.ClearHistoryAsync(userKey);

        return Ok();
    }

    [HttpGet("usage")]
    public async Task<IActionResult> Usage(
        [FromQuery] string userKey)
    {
        return Ok(
            await _service.GetUsageAsync(userKey));
    }
}