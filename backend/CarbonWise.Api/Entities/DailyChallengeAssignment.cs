namespace CarbonWise.Api.Entities;

public class DailyChallengeAssignment
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ChallengeId { get; set; }

    public DateOnly AssignedDate { get; set; }

    public bool Completed { get; set; }

    public DateTime? CompletedAt { get; set; }
}