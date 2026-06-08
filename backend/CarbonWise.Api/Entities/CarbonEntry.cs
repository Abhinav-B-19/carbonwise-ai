namespace CarbonWise.Api.Entities;

public class CarbonEntry
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal TransportationEmission { get; set; }

    public decimal HomeEmission { get; set; }

    public decimal FoodEmission { get; set; }

    public decimal LifestyleEmission { get; set; }

    public decimal TotalEmission { get; set; }

    public int CarbonScore { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}