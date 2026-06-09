namespace CarbonWise.Api.DTOs.Dashboard;

public class DashboardTrendsResponse
{
    public List<TrendPointResponse> Weekly { get; set; }
        = new();

    public List<TrendPointResponse> Monthly { get; set; }
        = new();
}