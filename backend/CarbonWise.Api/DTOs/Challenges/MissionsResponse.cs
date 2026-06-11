namespace CarbonWise.Api.DTOs.Challenges;

public class MissionsResponse
{
    public List<DailyChallengeResponse> Daily { get; set; }
        = new();

    public List<DailyChallengeResponse> Weekly { get; set; }
        = new();

    public List<DailyChallengeResponse> Monthly { get; set; }
        = new();
}