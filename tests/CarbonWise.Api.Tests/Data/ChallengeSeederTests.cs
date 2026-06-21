using CarbonWise.Api.Data;
using CarbonWise.Api.Entities;
using Xunit;

namespace CarbonWise.Api.Tests.Data;

public class ChallengeSeederTests
{
    [Fact]
    public void GetSeedData_Should_Return_All_Challenges()
    {
        // Act
        var challenges = ChallengeSeeder.GetSeedData();

        // Assert
        Assert.NotNull(challenges);
        Assert.Equal(11, challenges.Count);
        Assert.All(challenges, c => Assert.IsType<Challenge>(c));
    }

    [Fact]
    public void GetSeedData_Should_Return_Correct_Daily_Challenges()
    {
        // Act
        var daily = ChallengeSeeder.GetSeedData()
            .Where(c => c.ChallengeType == "Daily")
            .ToList();

        // Assert
        Assert.Equal(5, daily.Count);

        Assert.Contains(daily,
            c => c.Title == "Walk 2 km today"
                 && c.Description == "Replace a short car trip with walking."
                 && c.Difficulty == "Easy"
                 && c.Points == 25
                 && c.CarbonSaved == 2
                 && c.Category == "Transport");

        Assert.Contains(daily,
            c => c.Title == "Use public transport today");

        Assert.Contains(daily,
            c => c.Title == "Have a vegetarian meal");

        Assert.Contains(daily,
            c => c.Title == "Reduce AC usage by 1 hour");

        Assert.Contains(daily,
            c => c.Title == "Skip one food delivery");
    }

    [Fact]
    public void GetSeedData_Should_Return_Correct_Weekly_Challenges()
    {
        // Act
        var weekly = ChallengeSeeder.GetSeedData()
            .Where(c => c.ChallengeType == "Weekly")
            .ToList();

        // Assert
        Assert.Equal(3, weekly.Count);

        Assert.Contains(weekly,
            c => c.Title == "Use public transport 3 times"
                 && c.Points == 100
                 && c.CarbonSaved == 15);

        Assert.Contains(weekly,
            c => c.Title == "3 vegetarian days"
                 && c.Points == 90
                 && c.CarbonSaved == 12);

        Assert.Contains(weekly,
            c => c.Title == "Reduce electricity by 10%"
                 && c.Points == 120
                 && c.CarbonSaved == 18);
    }

    [Fact]
    public void GetSeedData_Should_Return_Correct_Monthly_Challenges()
    {
        // Act
        var monthly = ChallengeSeeder.GetSeedData()
            .Where(c => c.ChallengeType == "Monthly")
            .ToList();

        // Assert
        Assert.Equal(3, monthly.Count);

        Assert.Contains(monthly,
            c => c.Title == "Reduce footprint by 10%"
                 && c.Points == 250
                 && c.CarbonSaved == 30);

        Assert.Contains(monthly,
            c => c.Title == "Earn 500 Green Points"
                 && c.Points == 300
                 && c.CarbonSaved == 0);

        Assert.Contains(monthly,
            c => c.Title == "Complete 20 eco actions"
                 && c.Points == 350
                 && c.CarbonSaved == 25);
    }

    [Fact]
    public void GetSeedData_Should_Have_Expected_Type_Distribution()
    {
        // Act
        var challenges = ChallengeSeeder.GetSeedData();

        // Assert
        Assert.Equal(5, challenges.Count(c => c.ChallengeType == "Daily"));
        Assert.Equal(3, challenges.Count(c => c.ChallengeType == "Weekly"));
        Assert.Equal(3, challenges.Count(c => c.ChallengeType == "Monthly"));
    }
}