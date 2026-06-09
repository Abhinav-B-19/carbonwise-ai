using CarbonWise.Api.DTOs.Gamification;

namespace CarbonWise.Api.Services.Interfaces;

public interface IGamificationService
{
    Task<GamificationResponse> GetAsync(
        string userKey);
}