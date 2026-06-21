using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class UserAchievementTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var date = DateTime.UtcNow;

        var entity = new UserAchievement
        {
            Id = 1,
            UserId = 2,
            AchievementName = "Eco Hero",
            EarnedAt = date
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal("Eco Hero", entity.AchievementName);
        Assert.Equal(date, entity.EarnedAt);
    }

    [Fact]
    public void AchievementName_Should_Default_To_Empty()
    {
        var entity = new UserAchievement();

        Assert.Equal(string.Empty, entity.AchievementName);
    }
}