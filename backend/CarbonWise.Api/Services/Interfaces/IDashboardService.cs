using CarbonWise.Api.DTOs.Dashboard;

namespace CarbonWise.Api.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(
        string userKey);

    Task<DashboardTrendsResponse> GetTrendsAsync(
        string userKey);
}