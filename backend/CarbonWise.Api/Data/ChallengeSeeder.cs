using CarbonWise.Api.Entities;

namespace CarbonWise.Api.Data;

public static class ChallengeSeeder
{
    public static List<Challenge> GetSeedData()
    {
        return new()
        {
            new Challenge
            {
                Title = "Walk 2 km today",
                Description = "Replace a short car trip with walking.",
                Difficulty = "Easy",
                Points = 25,
                CarbonSaved = 2
            },

            new Challenge
            {
                Title = "Skip one food delivery",
                Description = "Cook at home instead of ordering.",
                Difficulty = "Easy",
                Points = 30,
                CarbonSaved = 3
            },

            new Challenge
            {
                Title = "Reduce AC usage by 1 hour",
                Description = "Lower electricity consumption.",
                Difficulty = "Medium",
                Points = 40,
                CarbonSaved = 5
            },

            new Challenge
            {
                Title = "Use public transport today",
                Description = "Replace a car commute.",
                Difficulty = "Medium",
                Points = 50,
                CarbonSaved = 7
            },

            new Challenge
            {
                Title = "Have a vegetarian meal",
                Description = "Reduce food emissions.",
                Difficulty = "Easy",
                Points = 35,
                CarbonSaved = 4
            }
        };
    }
}