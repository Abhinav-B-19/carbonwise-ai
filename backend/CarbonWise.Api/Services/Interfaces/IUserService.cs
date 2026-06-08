using CarbonWise.Api.DTOs.Users;

namespace CarbonWise.Api.Services.Interfaces;

public interface IUserService
{
    Task<RegisterUserResponse> RegisterUserAsync(
        RegisterUserRequest request);

    Task<ValidateUserResponse> ValidateUserAsync(
        string userKey);

    Task<UserProfileResponse?> GetProfileAsync(
        string userKey);
}