using CarbonWise.Api.DTOs.Carbon;

namespace CarbonWise.Api.Services.Interfaces;

public interface ICarbonCalculationService
{
    Task<CalculateCarbonResponse> CalculateAsync(
        string userKey,
        CalculateCarbonRequest request);

    Task<List<CarbonHistoryResponse>> GetHistoryAsync(
        string userKey);
}