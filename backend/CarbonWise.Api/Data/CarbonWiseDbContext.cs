using CarbonWise.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Data;

public class CarbonWiseDbContext : DbContext
{
    public CarbonWiseDbContext(
        DbContextOptions<CarbonWiseDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<CarbonEntry> CarbonEntries => Set<CarbonEntry>();

    public DbSet<Goal> Goals => Set<Goal>();

    public DbSet<Challenge> Challenges => Set<Challenge>();

    public DbSet<UserChallenge> UserChallenges => Set<UserChallenge>();

    public DbSet<AiInsight> AiInsights => Set<AiInsight>();

    public DbSet<ScenarioHistory> ScenarioHistories => Set<ScenarioHistory>();

    public DbSet<DailyChallengeAssignment> DailyChallengeAssignments
        => Set<DailyChallengeAssignment>();

    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(x => x.UserKey)
            .IsUnique();

        modelBuilder.Entity<CarbonEntry>()
            .HasOne(x => x.User)
            .WithMany(x => x.CarbonEntries)
            .HasForeignKey(x => x.UserId);

        modelBuilder.Entity<Goal>()
            .HasOne(x => x.User)
            .WithMany(x => x.Goals)
            .HasForeignKey(x => x.UserId);

        base.OnModelCreating(modelBuilder);
    }
}