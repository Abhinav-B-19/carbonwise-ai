namespace CarbonWise.Api.DTOs.Dashboard;

public class DashboardSummaryResponse
{
    public decimal LatestEmission { get; set; }

    public decimal AverageEmission { get; set; }

    public int CarbonScore { get; set; }

    public int ActiveGoals { get; set; }

    public int CompletedChallenges { get; set; }

    public int TotalCalculations { get; set; }
}