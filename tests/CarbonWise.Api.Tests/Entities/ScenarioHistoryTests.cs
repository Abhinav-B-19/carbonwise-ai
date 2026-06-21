using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class ScenarioHistoryTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var date = DateTime.UtcNow;

        var entity = new ScenarioHistory
        {
            Id = 1,
            UserId = 2,
            CurrentEmission = 10m,
            ProjectedEmission = 8m,
            AnnualSaving = 2m,
            ScenarioJson = "{}",
            CreatedAt = date
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal(10m, entity.CurrentEmission);
        Assert.Equal(8m, entity.ProjectedEmission);
        Assert.Equal(2m, entity.AnnualSaving);
        Assert.Equal("{}", entity.ScenarioJson);
        Assert.Equal(date, entity.CreatedAt);
    }

    [Fact]
    public void ScenarioJson_Should_Default_To_Empty()
    {
        var entity = new ScenarioHistory();

        Assert.Equal(string.Empty, entity.ScenarioJson);
    }
}