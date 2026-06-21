using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class UserTests
{
    [Fact]
    public void Default_Values_Should_Be_Initialized()
    {
        var user = new User();

        Assert.Equal(string.Empty, user.UserKey);
        Assert.Equal(string.Empty, user.Name);
        Assert.Equal(string.Empty, user.Email);
        Assert.Null(user.PreferredGoal);
        Assert.Equal(0, user.GreenPoints);

        Assert.NotNull(user.CarbonEntries);
        Assert.NotNull(user.Goals);
        Assert.Empty(user.CarbonEntries);
        Assert.Empty(user.Goals);
    }

    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var created = DateTime.UtcNow;
        var active = created.AddHours(1);

        var user = new User
        {
            Id = 1,
            UserKey = "USER001",
            Name = "John",
            Email = "john@example.com",
            PreferredGoal = "Reduce CO2",
            CreatedAt = created,
            LastActiveAt = active,
            GreenPoints = 500
        };

        Assert.Equal(1, user.Id);
        Assert.Equal("USER001", user.UserKey);
        Assert.Equal("John", user.Name);
        Assert.Equal("john@example.com", user.Email);
        Assert.Equal("Reduce CO2", user.PreferredGoal);
        Assert.Equal(created, user.CreatedAt);
        Assert.Equal(active, user.LastActiveAt);
        Assert.Equal(500, user.GreenPoints);
    }
}