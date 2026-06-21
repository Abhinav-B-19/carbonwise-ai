using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Entities;

public class DailyChallengeAssignmentTests
{
    [Fact]
    public void Properties_Should_Get_And_Set_Values()
    {
        var assignedDate = DateOnly.FromDateTime(DateTime.Today);
        var completedAt = DateTime.UtcNow;

        var entity = new DailyChallengeAssignment
        {
            Id = 1,
            UserId = 2,
            ChallengeId = 3,
            AssignedDate = assignedDate,
            Completed = true,
            CompletedAt = completedAt
        };

        Assert.Equal(1, entity.Id);
        Assert.Equal(2, entity.UserId);
        Assert.Equal(3, entity.ChallengeId);
        Assert.Equal(assignedDate, entity.AssignedDate);
        Assert.True(entity.Completed);
        Assert.Equal(completedAt, entity.CompletedAt);
    }

    [Fact]
    public void CompletedAt_Should_Be_Null_By_Default()
    {
        var entity = new DailyChallengeAssignment();

        Assert.Null(entity.CompletedAt);
        Assert.False(entity.Completed);
    }
}