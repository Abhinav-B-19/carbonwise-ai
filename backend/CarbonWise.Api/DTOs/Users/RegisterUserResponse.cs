namespace CarbonWise.Api.DTOs.Users;

public class RegisterUserResponse
{
    public string UserKey { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public bool IsExistingUser { get; set; }
}