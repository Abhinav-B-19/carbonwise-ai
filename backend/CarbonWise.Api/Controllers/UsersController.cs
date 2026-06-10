using CarbonWise.Api.DTOs.Users;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarbonWise.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(
        IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserRequest request)
    {
        var result =
            await _userService.RegisterUserAsync(request);

        return Ok(result);
    }

    [HttpGet("validate")]
    public async Task<IActionResult> Validate(
        [FromHeader(Name = "X-User-Key")]
        string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest(
                "Missing X-User-Key header");
        }

        var result =
            await _userService.ValidateUserAsync(
                userKey);

        return Ok(result);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> Profile(
        [FromHeader(Name = "X-User-Key")]
        string userKey)
    {
        if (string.IsNullOrWhiteSpace(userKey))
        {
            return BadRequest(
                "Missing X-User-Key header");
        }

        var profile =
            await _userService.GetProfileAsync(
                userKey);

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(profile);
    }
}