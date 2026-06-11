using CarbonWise.Api.Entities;

namespace CarbonWise.Api.Data;

public static class ChallengeSeeder
{
    public static List<Challenge> GetSeedData()
    {
        return new()
        {
            // DAILY

            new Challenge
            {
                Title = "Walk 2 km today",
                Description = "Replace a short car trip with walking.",
                Difficulty = "Easy",
                Points = 25,
                CarbonSaved = 2,
                Category = "Transport",
                ChallengeType = "Daily"
            },

            new Challenge
            {
                Title = "Use public transport today",
                Description = "Replace a private vehicle trip.",
                Difficulty = "Medium",
                Points = 50,
                CarbonSaved = 7,
                Category = "Transport",
                ChallengeType = "Daily"
            },

            new Challenge
            {
                Title = "Have a vegetarian meal",
                Description = "Reduce food-related emissions.",
                Difficulty = "Easy",
                Points = 35,
                CarbonSaved = 4,
                Category = "Food",
                ChallengeType = "Daily"
            },

            new Challenge
            {
                Title = "Reduce AC usage by 1 hour",
                Description = "Lower electricity consumption.",
                Difficulty = "Medium",
                Points = 40,
                CarbonSaved = 5,
                Category = "Energy",
                ChallengeType = "Daily"
            },

            new Challenge
            {
                Title = "Skip one food delivery",
                Description = "Cook at home instead.",
                Difficulty = "Easy",
                Points = 30,
                CarbonSaved = 3,
                Category = "Lifestyle",
                ChallengeType = "Daily"
            },

            // WEEKLY

            new Challenge
            {
                Title = "Use public transport 3 times",
                Description = "Reduce transportation emissions this week.",
                Difficulty = "Medium",
                Points = 100,
                CarbonSaved = 15,
                Category = "Transport",
                ChallengeType = "Weekly"
            },

            new Challenge
            {
                Title = "3 vegetarian days",
                Description = "Reduce food emissions for a week.",
                Difficulty = "Medium",
                Points = 90,
                CarbonSaved = 12,
                Category = "Food",
                ChallengeType = "Weekly"
            },

            new Challenge
            {
                Title = "Reduce electricity by 10%",
                Description = "Save energy this week.",
                Difficulty = "Hard",
                Points = 120,
                CarbonSaved = 18,
                Category = "Energy",
                ChallengeType = "Weekly"
            },

            // MONTHLY

            new Challenge
            {
                Title = "Reduce footprint by 10%",
                Description = "Lower overall emissions this month.",
                Difficulty = "Hard",
                Points = 250,
                CarbonSaved = 30,
                Category = "Lifestyle",
                ChallengeType = "Monthly"
            },

            new Challenge
            {
                Title = "Earn 500 Green Points",
                Description = "Complete missions consistently.",
                Difficulty = "Hard",
                Points = 300,
                CarbonSaved = 0,
                Category = "Lifestyle",
                ChallengeType = "Monthly"
            },

            new Challenge
            {
                Title = "Complete 20 eco actions",
                Description = "Build sustainable habits.",
                Difficulty = "Hard",
                Points = 350,
                CarbonSaved = 25,
                Category = "Lifestyle",
                ChallengeType = "Monthly"
            }
        };
    }
}