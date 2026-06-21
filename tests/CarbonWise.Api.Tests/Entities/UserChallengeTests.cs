using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class UserChallengeTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var completedAt = DateTime.UtcNow;

        var entity = new UserChallenge
        {
            Id = 1,
            UserId = 2,
            ChallengeId = 3,
            Completed = true,
            CompletedAt = completedAt
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal(3, entity.ChallengeId);
        Assert.True(entity.Completed);
        Assert.Equal(completedAt, entity.CompletedAt);
    }

    [Fact]
    public void CompletedAt_Should_Be_Null_By_Default()
    {
        var entity = new UserChallenge();

        Assert.False(entity.Completed);
        Assert.Null(entity.CompletedAt);
    }
}