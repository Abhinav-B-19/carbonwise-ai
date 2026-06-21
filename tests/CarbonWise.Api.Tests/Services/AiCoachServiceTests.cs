using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Services.Interfaces;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace CarbonWise.Api.Tests.Services;

public class AiCoachServiceTests : IDisposable
{
    private readonly CarbonWiseDbContext _dbContext;
    private readonly Mock<IConfiguration> _configurationMock = new();
    private readonly Mock<IGeminiService> _geminiMock = new();

    private readonly AiCoachService _service;

    public AiCoachServiceTests()
    {
        var options =
            new DbContextOptionsBuilder<CarbonWiseDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

        _dbContext =
            new CarbonWiseDbContext(options);

        _service =
            new AiCoachService(
                _dbContext,
                _configurationMock.Object,
                _geminiMock.Object);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    private async Task<User> CreateUserAsync()
    {
        var user = new User
        {
            UserKey = "user-1",
            Name = "Abhinav",
            Email = "test@test.com",
            CreatedAt = DateTime.UtcNow,
            LastActiveAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    [Fact]
    public async Task GenerateAdviceAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        var act =
            () => _service.GenerateAdviceAsync("missing");

        await act
            .Should()
            .ThrowAsync<KeyNotFoundException>()
            .WithMessage(
                "User not found for UserKey: missing");
    }

    [Fact]
    public async Task GenerateAdviceAsync_ShouldThrow_WhenNoCarbonCalculationExists()
    {
        var user =
            await CreateUserAsync();

        var act =
            () => _service.GenerateAdviceAsync(
                user.UserKey);

        await act
            .Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage(
                "No carbon calculation found.");
    }

    [Fact]
    public async Task GenerateAdviceAsync_ShouldGenerateAdvice_AndPersistInsight()
    {
        var user =
            await CreateUserAsync();

        _dbContext.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                CarbonScore = 80,
                TransportationEmission = 10,
                HomeEmission = 5,
                FoodEmission = 3,
                LifestyleEmission = 2,
                TotalEmission = 20,
                CreatedAt = DateTime.UtcNow
            });

        await _dbContext.SaveChangesAsync();

        string? prompt = null;

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .Callback<string>(p =>
                prompt = p)
            .ReturnsAsync(
                "Reduce car usage.");

        var result =
            await _service.GenerateAdviceAsync(
                user.UserKey);

        result.Insight
            .Should()
            .Be("Reduce car usage.");

        result.GeneratedAt
            .Should()
            .BeCloseTo(
                DateTime.UtcNow,
                TimeSpan.FromSeconds(5));

        prompt.Should().NotBeNull();

        prompt.Should()
            .Contain("Abhinav");

        prompt.Should()
            .Contain("Carbon Score: 80");

        var insight =
            await _dbContext.AiInsights
                .SingleAsync();

        insight.UserId
            .Should()
            .Be(user.Id);

        insight.InsightType
            .Should()
            .Be("CarbonCoach");

        insight.Response
            .Should()
            .Be("Reduce car usage.");
    }

    [Fact]
    public async Task GenerateAdviceAsync_ShouldUseFallback_WhenGeminiReturnsNull()
    {
        var user =
            await CreateUserAsync();

        _dbContext.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                CarbonScore = 50,
                CreatedAt = DateTime.UtcNow
            });

        await _dbContext.SaveChangesAsync();

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(
                    It.IsAny<string>()))
            .ReturnsAsync(
                (string?)null);

        var result =
            await _service.GenerateAdviceAsync(
                user.UserKey);

        result.Insight
            .Should()
            .Be(
                "No advice generated.");

        var insight =
            await _dbContext.AiInsights
                .SingleAsync();

        insight.Response
            .Should()
            .Be(
                "No advice generated.");
    }

    [Fact]
    public async Task GetHistoryAsync_ShouldReturnEmpty_WhenUserDoesNotExist()
    {
        var result =
            await _service.GetHistoryAsync(
                "missing");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetHistoryAsync_ShouldReturnHistoryOrderedDescending()
    {
        var user =
            await CreateUserAsync();

        _dbContext.AiInsights.AddRange(
            new AiInsight
            {
                UserId = user.Id,
                Response = "Old",
                CreatedAt =
                    DateTime.UtcNow.AddDays(-1)
            },
            new AiInsight
            {
                UserId = user.Id,
                Response = "New",
                CreatedAt =
                    DateTime.UtcNow
            });

        await _dbContext.SaveChangesAsync();

        var result =
            await _service.GetHistoryAsync(
                user.UserKey);

        result.Should().HaveCount(2);

        result[0].Insight
            .Should()
            .Be("New");

        result[1].Insight
            .Should()
            .Be("Old");
    }
}