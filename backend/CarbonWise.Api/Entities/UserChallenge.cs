namespace CarbonWise.Api.Entities;

public class UserChallenge
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ChallengeId { get; set; }

    public bool Completed { get; set; }

    public DateTime? CompletedAt { get; set; }
}