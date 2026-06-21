using CarbonWise.Api.DTOs.Challenges;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/challenges")]
public class ChallengesController : ControllerBase
{
    private readonly IChallengeService _service;

    public ChallengesController(
        IChallengeService service)
    {
        _service = service;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyChallenge(
        [FromQuery] string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("User key is required.");
        }

        var result =
            await _service.GetDailyChallengeAsync(
                userKey);

        return Ok(result);
    }

    [HttpPost("complete")]
    public async Task<IActionResult> CompleteChallenge(
        [FromQuery] string userKey,
        CompleteChallengeRequest request)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("User key is required.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success =
            await _service.CompleteChallengeAsync(
                userKey,
                request.ChallengeId);

        if (!success)
        {
            return NotFound();
        }

        return Ok();
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest("User key is required.");
        }

        var result =
            await _service.GetHistoryAsync(
                userKey);

        return Ok(result);
    }

    [HttpGet("missions")]
    public async Task<IActionResult> GetMissions()
    {
        var result =
            await _service.GetMissionsAsync();

        return Ok(result);
    }
}