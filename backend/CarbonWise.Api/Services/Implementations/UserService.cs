using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.Users;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class UserService : IUserService
{
    private readonly CarbonWiseDbContext _dbContext;

    public UserService(
        CarbonWiseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RegisterUserResponse> RegisterUserAsync(
        RegisterUserRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLower();

        var existingUser = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (existingUser != null)
        {
            existingUser.LastActiveAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return new RegisterUserResponse
            {
                UserKey = existingUser.UserKey,
                Name = existingUser.Name,
                IsExistingUser = true
            };
        }

        var user = new User
        {
            UserKey = Guid.NewGuid().ToString(),
            Name = request.Name.Trim(),
            Email = email,
            PreferredGoal = request.PreferredGoal,
            CreatedAt = DateTime.UtcNow,
            LastActiveAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);

        await _dbContext.SaveChangesAsync();

        return new RegisterUserResponse
        {
            UserKey = user.UserKey,
            Name = user.Name,
            IsExistingUser = false
        };
    }

    public async Task<ValidateUserResponse> ValidateUserAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return new ValidateUserResponse
            {
                IsValid = false
            };
        }

        user.LastActiveAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new ValidateUserResponse
        {
            IsValid = true,
            Name = user.Name
        };
    }

    public async Task<UserProfileResponse?> GetProfileAsync(
        string userKey)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserKey == userKey);

        if (user == null)
        {
            return null;
        }

        return new UserProfileResponse
        {
            UserKey = user.UserKey,
            Name = user.Name,
            Email = user.Email,
            PreferredGoal = user.PreferredGoal
        };
    }
}