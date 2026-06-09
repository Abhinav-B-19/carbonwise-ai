using CarbonWise.Api.DTOs.AI;

namespace CarbonWise.Api.Services.Interfaces;

public interface IAiCoachService
{
    Task<AiCoachResponse> GenerateAdviceAsync(
        string userKey);

    Task<List<AiHistoryResponse>> GetHistoryAsync(
        string userKey);
}