namespace CarbonWise.Api.DTOs.Users;

public class UserProfileResponse
{
    public string UserKey { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PreferredGoal { get; set; }
}