using CarbonWise.Api.DTOs.AI;

namespace CarbonWise.Api.Services.Interfaces;

public interface IAiAssistantService
{
    Task<ChatResponse> SendMessageAsync(
        ChatRequest request);

    Task<List<ChatHistoryResponse>> GetHistoryAsync(
        string userKey);

    Task ClearHistoryAsync(
        string userKey);

    Task<ChatUsageResponse> GetUsageAsync(
        string userKey);
}