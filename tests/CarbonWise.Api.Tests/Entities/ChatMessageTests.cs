using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class ChatMessageTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var user = new User();
        var date = DateTime.UtcNow;

        var entity = new ChatMessage
        {
            Id = 1,
            UserId = 2,
            Role = "User",
            Message = "Hello",
            CreatedAt = date,
            User = user
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal("User", entity.Role);
        Assert.Equal("Hello", entity.Message);
        Assert.Equal(date, entity.CreatedAt);
        Assert.Same(user, entity.User);
    }

    [Fact]
    public void Default_Strings_Should_Be_Empty()
    {
        var entity = new ChatMessage();

        Assert.Equal(string.Empty, entity.Role);
        Assert.Equal(string.Empty, entity.Message);
    }
}