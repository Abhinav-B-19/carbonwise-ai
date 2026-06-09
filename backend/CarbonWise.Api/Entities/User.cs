namespace CarbonWise.Api.Entities;

public class User
{
    public int Id { get; set; }

    public string UserKey { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PreferredGoal { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime LastActiveAt { get; set; }

    public ICollection<CarbonEntry> CarbonEntries { get; set; }
        = new List<CarbonEntry>();

    public ICollection<Goal> Goals { get; set; }
        = new List<Goal>();

    public int GreenPoints { get; set; }
}