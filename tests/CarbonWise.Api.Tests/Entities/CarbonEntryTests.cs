using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class CarbonEntryTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var user = new User();
        var date = DateTime.UtcNow;

        var entity = new CarbonEntry
        {
            Id = 1,
            UserId = 2,
            TransportationEmission = 1.5m,
            HomeEmission = 2.5m,
            FoodEmission = 3.5m,
            LifestyleEmission = 4.5m,
            TotalEmission = 12m,
            CarbonScore = 80,
            CreatedAt = date,
            User = user
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal(1.5m, entity.TransportationEmission);
        Assert.Equal(2.5m, entity.HomeEmission);
        Assert.Equal(3.5m, entity.FoodEmission);
        Assert.Equal(4.5m, entity.LifestyleEmission);
        Assert.Equal(12m, entity.TotalEmission);
        Assert.Equal(80, entity.CarbonScore);
        Assert.Equal(date, entity.CreatedAt);
        Assert.Same(user, entity.User);
    }
}