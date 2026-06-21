using CarbonWise.Api.DTOs.Scenario;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Services.Interfaces;
using CarbonWise.Api.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace CarbonWise.Api.Tests.Services;

public class ScenarioServiceTests
{
    [Fact]
    public async Task Simulate_ShouldThrow_WhenUserMissing()
    {
        var db = DbContextFactory.Create();

        var gemini =
            new Mock<IGeminiService>();

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () =>
                service.SimulateAsync(
                    "missing",
                    new ScenarioRequest()));
    }

    [Fact]
    public async Task Simulate_ShouldThrow_WhenNoCarbonCalculationExists()
    {
        var db = DbContextFactory.Create();

        db.Users.Add(
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            });

        await db.SaveChangesAsync();

        var gemini =
            new Mock<IGeminiService>();

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () =>
                service.SimulateAsync(
                    "user1",
                    new ScenarioRequest()));
    }

    [Fact]
    public async Task Simulate_ShouldCalculateProjection_AndUseGeminiResponse()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 500,
                CarbonScore = 50,
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var gemini =
            new Mock<IGeminiService>();

        gemini
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .ReturnsAsync(
                "AI explanation");

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        var result =
            await service.SimulateAsync(
                "user1",
                new ScenarioRequest
                {
                    CarKmReduction = 100,
                    AcHoursReduction = 2,
                    DeliveryReduction = 5,
                    SwitchToVegetarian = true
                });

        result.CurrentEmission
            .Should().Be(500);

        result.ProjectedEmission
            .Should().Be(399);

        result.Reduction
            .Should().Be(101);

        result.CurrentScore
            .Should().Be(50);

        result.ProjectedScore
            .Should().Be(61);

        result.AiExplanation
            .Should().Be("AI explanation");

        gemini.Verify(
            x => x.GenerateAsync(
                It.IsAny<string>()),
            Times.Once);
    }

    [Fact]
    public async Task Simulate_ShouldUseFallback_WhenGeminiReturnsNull()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 100,
                CarbonScore = 90,
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var gemini =
            new Mock<IGeminiService>();

        gemini
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .ReturnsAsync(
                (string?)null);

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        var result =
            await service.SimulateAsync(
                "user1",
                new ScenarioRequest());

        result.AiExplanation
            .Should()
            .Contain(
                "Your projected carbon score improves from 90 to 90.");

        gemini.Verify(
            x => x.GenerateAsync(
                It.IsAny<string>()),
            Times.Once);
    }

    [Fact]
    public async Task Simulate_ShouldClampProjectedEmissionToZero()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 50,
                CarbonScore = 95,
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var gemini =
            new Mock<IGeminiService>();

        gemini
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .ReturnsAsync(
                "AI explanation");

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        var result =
            await service.SimulateAsync(
                "user1",
                new ScenarioRequest
                {
                    CarKmReduction = 1000,
                    AcHoursReduction = 20,
                    DeliveryReduction = 100,
                    SwitchToVegetarian = true
                });

        result.ProjectedEmission
            .Should().Be(0);

        result.Reduction
            .Should().Be(50);

        result.ProjectedScore
            .Should().Be(100);
    }

    [Fact]
    public async Task Simulate_ShouldUseFallback_WhenGeminiThrows()
    {
        var db = DbContextFactory.Create();

        var user =
            new User
            {
                UserKey = "user1",
                Name = "Abhinav",
                Email = "a@test.com"
            };

        db.Users.Add(user);

        await db.SaveChangesAsync();

        db.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                TotalEmission = 100,
                CarbonScore = 90,
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var gemini =
            new Mock<IGeminiService>();

        gemini
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .ThrowsAsync(
                new Exception("boom"));

        var service =
            new ScenarioService(
                db,
                gemini.Object);

        var result =
            await service.SimulateAsync(
                "user1",
                new ScenarioRequest());

        result.AiExplanation
            .Should()
            .Contain(
                "Your projected carbon score improves");

        result.AiExplanation
            .Should()
            .Contain(
                "You could reduce emissions");
    }
}