using CarbonWise.Api.Data;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CarbonWise.Api.Tests.Data;

public class CarbonWiseDbContextTests
{
    [Fact]
    public void Constructor_Should_Create_Context()
    {
        using var context = DbContextFactory.Create();

        Assert.NotNull(context);
    }

    [Fact]
    public void DbSet_Properties_Should_Be_Accessible()
    {
        using var context = DbContextFactory.Create();

        Assert.NotNull(context.Users);
        Assert.NotNull(context.CarbonEntries);
        Assert.NotNull(context.Goals);
        Assert.NotNull(context.Challenges);
        Assert.NotNull(context.UserChallenges);
        Assert.NotNull(context.AiInsights);
        Assert.NotNull(context.ScenarioHistories);
        Assert.NotNull(context.DailyChallengeAssignments);
        Assert.NotNull(context.UserAchievements);
        Assert.NotNull(context.ChatMessages);
        Assert.NotNull(context.AiChatUsages);
    }

    [Fact]
    public void Model_Should_Contain_Configured_Indexes_And_Relationships()
    {
        using var context = DbContextFactory.Create();

        // Forces OnModelCreating to execute
        var model = context.Model;

        Assert.NotNull(model);

        // User indexes
        var userEntity = model.FindEntityType(typeof(User));
        Assert.NotNull(userEntity);

        var indexes = userEntity!.GetIndexes().ToList();

        Assert.Contains(
            indexes,
            i => i.IsUnique &&
                 i.Properties.Single().Name == nameof(User.Email));

        Assert.Contains(
            indexes,
            i => i.IsUnique &&
                 i.Properties.Single().Name == nameof(User.UserKey));

        // CarbonEntry -> User relationship
        var carbonEntryEntity = model.FindEntityType(typeof(CarbonEntry));
        Assert.NotNull(carbonEntryEntity);

        var carbonEntryFk = carbonEntryEntity!
            .GetForeignKeys()
            .Single(fk => fk.Properties.Single().Name == nameof(CarbonEntry.UserId));

        Assert.Equal(typeof(User), carbonEntryFk.PrincipalEntityType.ClrType);

        // Goal -> User relationship
        var goalEntity = model.FindEntityType(typeof(Goal));
        Assert.NotNull(goalEntity);

        var goalFk = goalEntity!
            .GetForeignKeys()
            .Single(fk => fk.Properties.Single().Name == nameof(Goal.UserId));

        Assert.Equal(typeof(User), goalFk.PrincipalEntityType.ClrType);
    }
}