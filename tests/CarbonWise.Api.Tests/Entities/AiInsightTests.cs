using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class AiInsightTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var date = DateTime.UtcNow;

        var entity = new AiInsight
        {
            Id = 1,
            UserId = 2,
            InsightType = "Recommendation",
            Prompt = "Reduce emissions",
            Response = "Use public transport",
            CreatedAt = date
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal("Recommendation", entity.InsightType);
        Assert.Equal("Reduce emissions", entity.Prompt);
        Assert.Equal("Use public transport", entity.Response);
        Assert.Equal(date, entity.CreatedAt);
    }

    [Fact]
    public void Default_Strings_Should_Be_Empty()
    {
        var entity = new AiInsight();

        Assert.Equal(string.Empty, entity.InsightType);
        Assert.Equal(string.Empty, entity.Prompt);
        Assert.Equal(string.Empty, entity.Response);
    }
}