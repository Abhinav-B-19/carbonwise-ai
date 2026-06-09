using CarbonWise.Api.DTOs.Challenges;

namespace CarbonWise.Api.Services.Interfaces;

public interface IChallengeService
{
    Task<DailyChallengeResponse> GetDailyChallengeAsync(
        string userKey);

    Task<bool> CompleteChallengeAsync(
        string userKey,
        int challengeId);

    Task<List<DailyChallengeResponse>> GetHistoryAsync(
        string userKey);
}