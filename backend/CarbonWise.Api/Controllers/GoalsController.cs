using CarbonWise.Api.DTOs.Goals;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/goals")]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _service;

    public GoalsController(
        IGoalService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGoal(
        [FromQuery] string userKey,
        CreateGoalRequest request)
    {
        var result =
            await _service.CreateGoalAsync(
                userKey,
                request);

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetGoals(
        [FromQuery] string userKey)
    {
        var result =
            await _service.GetGoalsAsync(
                userKey);

        return Ok(result);
    }

    [HttpPut("{goalId}")]
    public async Task<IActionResult> UpdateGoal(
        int goalId,
        UpdateGoalRequest request)
    {
        var result =
            await _service.UpdateGoalAsync(
                goalId,
                request);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{goalId}")]
    public async Task<IActionResult> DeleteGoal(
        int goalId)
    {
        var deleted =
            await _service.DeleteGoalAsync(
                goalId);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}