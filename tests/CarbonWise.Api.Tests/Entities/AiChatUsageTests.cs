using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class AiChatUsageTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var user = new User();
        var date = DateTime.UtcNow;

        var entity = new AiChatUsage
        {
            Id = 1,
            UserId = 2,
            UsageDate = date,
            MessageCount = 10,
            User = user
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal(date, entity.UsageDate);
        Assert.Equal(10, entity.MessageCount);
        Assert.Same(user, entity.User);
    }
}