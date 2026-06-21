using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class ChallengeTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var entity = new Challenge
        {
            Id = 1,
            Title = "Walk to Work",
            Description = "Avoid using vehicles",
            Difficulty = "Easy",
            Points = 100,
            CarbonSaved = 5.5m,
            Category = "Transport",
            ChallengeType = "Daily"
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal("Walk to Work", entity.Title);
        Assert.Equal("Avoid using vehicles", entity.Description);
        Assert.Equal("Easy", entity.Difficulty);
        Assert.Equal(100, entity.Points);
        Assert.Equal(5.5m, entity.CarbonSaved);
        Assert.Equal("Transport", entity.Category);
        Assert.Equal("Daily", entity.ChallengeType);
    }

    [Fact]
    public void Default_Strings_Should_Be_Empty()
    {
        var entity = new Challenge();

        Assert.Equal(string.Empty, entity.Title);
        Assert.Equal(string.Empty, entity.Description);
        Assert.Equal(string.Empty, entity.Difficulty);
        Assert.Equal(string.Empty, entity.Category);
        Assert.Equal(string.Empty, entity.ChallengeType);
    }
}