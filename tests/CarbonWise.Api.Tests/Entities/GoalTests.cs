using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class GoalTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var user = new User();
        var date = DateTime.UtcNow;

        var entity = new Goal
        {
            Id = 1,
            UserId = 2,
            GoalType = "Emission Reduction",
            TargetValue = 100m,
            CurrentValue = 50m,
            Status = "In Progress",
            CreatedAt = date,
            User = user
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal("Emission Reduction", entity.GoalType);
        Assert.Equal(100m, entity.TargetValue);
        Assert.Equal(50m, entity.CurrentValue);
        Assert.Equal("In Progress", entity.Status);
        Assert.Equal(date, entity.CreatedAt);
        Assert.Same(user, entity.User);
    }

    [Fact]
    public void Default_Strings_Should_Be_Empty()
    {
        var entity = new Goal();

        Assert.Equal(string.Empty, entity.GoalType);
        Assert.Equal(string.Empty, entity.Status);
    }
}