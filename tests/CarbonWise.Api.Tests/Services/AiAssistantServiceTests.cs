using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace CarbonWise.Api.Tests.Services;

public sealed class AiAssistantServiceTests : IDisposable
{
    private readonly CarbonWiseDbContext _dbContext;
    private readonly Mock<IGeminiService> _geminiMock = new();
    private readonly Mock<IConfiguration> _configurationMock = new();

    private readonly AiAssistantService _service;

    public AiAssistantServiceTests()
    {
        var options =
            new DbContextOptionsBuilder<CarbonWiseDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

        _dbContext = new CarbonWiseDbContext(options);

        _service = new AiAssistantService(
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
            Id = 1,
            UserKey = "user-1",
            Name = "Abhinav",
            Email = "a@test.com",
            CreatedAt = DateTime.UtcNow,
            LastActiveAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    [Fact]
    public async Task SendMessageAsync_ShouldThrow_WhenUserNotFound()
    {
        var request = new ChatRequest
        {
            UserKey = "missing",
            Message = "hello"
        };

        var act = () =>
            _service.SendMessageAsync(request);

        var ex =
            await Assert.ThrowsAsync<KeyNotFoundException>(
                act);

        Assert.Equal(
            "User not found: missing",
            ex.Message);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldCreateUsageAndMessages_WhenUsageDoesNotExist()
    {
        var user = await CreateUserAsync();

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(It.IsAny<string>()))
            .ReturnsAsync("AI response");

        var result =
            await _service.SendMessageAsync(
                new ChatRequest
                {
                    UserKey = user.UserKey,
                    Message = "hello"
                });

        Assert.Equal(
            "AI response",
            result.Response);

        Assert.Equal(
            24,
            result.RemainingMessages);

        Assert.Single(_dbContext.AiChatUsages);

        Assert.Equal(
            2,
            _dbContext.ChatMessages.Count());

        var usage =
            await _dbContext.AiChatUsages
                .SingleAsync();

        Assert.Equal(
            1,
            usage.MessageCount);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldReturnLimitMessage_WhenDailyLimitReached()
    {
        var user = await CreateUserAsync();

        _dbContext.AiChatUsages.Add(
            new AiChatUsage
            {
                UserId = user.Id,
                UsageDate = DateTime.UtcNow.Date,
                MessageCount = 25
            });

        await _dbContext.SaveChangesAsync();

        var result =
            await _service.SendMessageAsync(
                new ChatRequest
                {
                    UserKey = user.UserKey,
                    Message = "hello"
                });

        Assert.Equal(
            "You have reached today's AI assistant limit. Please come back tomorrow.",
            result.Response);

        Assert.Equal(
            0,
            result.RemainingMessages);

        Assert.Empty(_dbContext.ChatMessages);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldUseFallbackMessage_WhenGeminiReturnsNull()
    {
        var user = await CreateUserAsync();

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(It.IsAny<string>()))
            .ReturnsAsync((string?)null);

        var result =
            await _service.SendMessageAsync(
                new ChatRequest
                {
                    UserKey = user.UserKey,
                    Message = "hello"
                });

        Assert.Equal(
            "Sorry, I couldn't generate a response.",
            result.Response);

        Assert.Equal(
            24,
            result.RemainingMessages);

        Assert.Equal(
            2,
            _dbContext.ChatMessages.Count());
    }

    [Fact]
    public async Task SendMessageAsync_ShouldIncludeCarbonContext_WhenCarbonEntryExists()
    {
        var user = await CreateUserAsync();

        _dbContext.CarbonEntries.Add(
            new CarbonEntry
            {
                UserId = user.Id,
                CarbonScore = 75,
                TransportationEmission = 1,
                HomeEmission = 2,
                FoodEmission = 3,
                LifestyleEmission = 4,
                TotalEmission = 10,
                CreatedAt = DateTime.UtcNow
            });

        await _dbContext.SaveChangesAsync();

        string? capturedPrompt = null;

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(It.IsAny<string>()))
            .Callback<string>(p =>
                capturedPrompt = p)
            .ReturnsAsync("AI response");

        await _service.SendMessageAsync(
            new ChatRequest
            {
                UserKey = user.UserKey,
                Message = "hello"
            });

        Assert.NotNull(capturedPrompt);
        Assert.Contains(
            "Carbon Score: 75",
            capturedPrompt);
        Assert.Contains(
            "Total Emission:",
            capturedPrompt);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldIncludeHistory_WhenRecentMessagesExist()
    {
        var user = await CreateUserAsync();

        _dbContext.ChatMessages.AddRange(
            new ChatMessage
            {
                UserId = user.Id,
                Role = "user",
                Message = "first",
                CreatedAt = DateTime.UtcNow.AddMinutes(-2)
            },
            new ChatMessage
            {
                UserId = user.Id,
                Role = "assistant",
                Message = "second",
                CreatedAt = DateTime.UtcNow.AddMinutes(-1)
            });

        await _dbContext.SaveChangesAsync();

        string? prompt = null;

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(It.IsAny<string>()))
            .Callback<string>(p =>
                prompt = p)
            .ReturnsAsync("AI response");

        await _service.SendMessageAsync(
            new ChatRequest
            {
                UserKey = user.UserKey,
                Message = "hello"
            });

        Assert.NotNull(prompt);
        Assert.Contains(
            "user: first",
            prompt);

        Assert.Contains(
            "assistant: second",
            prompt);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldTrimHistory_WhenMoreThanHundredMessagesExist()
    {
        var user = await CreateUserAsync();

        for (var i = 0; i < 101; i++)
        {
            _dbContext.ChatMessages.Add(
                new ChatMessage
                {
                    UserId = user.Id,
                    Role = "user",
                    Message = $"m{i}",
                    CreatedAt =
                        DateTime.UtcNow.AddMinutes(-i)
                });
        }

        await _dbContext.SaveChangesAsync();

        _geminiMock
            .Setup(x =>
                x.GenerateAsync(It.IsAny<string>()))
            .ReturnsAsync("AI response");

        await _service.SendMessageAsync(
            new ChatRequest
            {
                UserKey = user.UserKey,
                Message = "hello"
            });

        Assert.True(
            _dbContext.ChatMessages.Count() <= 100);
    }

    [Fact]
    public async Task GetHistoryAsync_ShouldReturnEmpty_WhenUserNotFound()
    {
        var result =
            await _service.GetHistoryAsync(
                "missing");

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetHistoryAsync_ShouldReturnMessagesOrderedByDate()
    {
        var user = await CreateUserAsync();

        _dbContext.ChatMessages.AddRange(
            new ChatMessage
            {
                UserId = user.Id,
                Role = "assistant",
                Message = "second",
                CreatedAt = DateTime.UtcNow
            },
            new ChatMessage
            {
                UserId = user.Id,
                Role = "user",
                Message = "first",
                CreatedAt =
                    DateTime.UtcNow.AddMinutes(-1)
            });

        await _dbContext.SaveChangesAsync();

        var result =
            await _service.GetHistoryAsync(
                user.UserKey);

        Assert.Equal(
            2,
            result.Count);

        Assert.Equal(
            "first",
            result[0].Message);

        Assert.Equal(
            "second",
            result[1].Message);
    }

    [Fact]
    public async Task ClearHistoryAsync_ShouldDoNothing_WhenUserNotFound()
    {
        await _service.ClearHistoryAsync(
            "missing");

        Assert.Empty(
            _dbContext.ChatMessages);
    }

    [Fact]
    public async Task ClearHistoryAsync_ShouldRemoveMessages()
    {
        var user = await CreateUserAsync();

        _dbContext.ChatMessages.Add(
            new ChatMessage
            {
                UserId = user.Id,
                Role = "user",
                Message = "hello",
                CreatedAt = DateTime.UtcNow
            });

        await _dbContext.SaveChangesAsync();

        await _service.ClearHistoryAsync(
            user.UserKey);

        Assert.Empty(
            _dbContext.ChatMessages);
    }

    [Fact]
    public async Task GetUsageAsync_ShouldReturnDefaults_WhenUserNotFound()
    {
        var result =
            await _service.GetUsageAsync(
                "missing");

        Assert.Equal(0, result.Used);
        Assert.Equal(25, result.Limit);
        Assert.Equal(25, result.Remaining);
    }

    [Fact]
    public async Task GetUsageAsync_ShouldReturnDefaults_WhenUsageDoesNotExist()
    {
        var user = await CreateUserAsync();

        var result =
            await _service.GetUsageAsync(
                user.UserKey);

        Assert.Equal(0, result.Used);
        Assert.Equal(25, result.Limit);
        Assert.Equal(25, result.Remaining);
    }

    [Fact]
    public async Task GetUsageAsync_ShouldReturnUsage()
    {
        var user = await CreateUserAsync();

        _dbContext.AiChatUsages.Add(
            new AiChatUsage
            {
                UserId = user.Id,
                UsageDate = DateTime.UtcNow.Date,
                MessageCount = 25
            });

        await _dbContext.SaveChangesAsync();

        var result =
            await _service.GetUsageAsync(
                user.UserKey);

        Assert.Equal(25, result.Used);
        Assert.Equal(25, result.Limit);
        Assert.Equal(0, result.Remaining);
    }
}