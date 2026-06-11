using CarbonWise.Api.Data;
using CarbonWise.Api.DTOs.AI;
using CarbonWise.Api.Entities;
using CarbonWise.Api.Services.Interfaces;
using Google.GenAI;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Services.Implementations;

public class AiAssistantService : IAiAssistantService
{
    private const int DailyLimit = 25;

    private readonly CarbonWiseDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AiAssistantService(
        CarbonWiseDbContext dbContext,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<ChatResponse> SendMessageAsync(
        ChatRequest request)
    {
        var user =
            await _dbContext.Users
                .FirstOrDefaultAsync(x =>
                    x.UserKey == request.UserKey);

        if (user == null)
        {
            throw new KeyNotFoundException(
                $"User not found: {request.UserKey}");
        }

        var today =
            DateTime.UtcNow.Date;

        var usage =
            await _dbContext.AiChatUsages
                .FirstOrDefaultAsync(x =>
                    x.UserId == user.Id &&
                    x.UsageDate == today);

        if (usage == null)
        {
            usage = new AiChatUsage
            {
                UserId = user.Id,
                UsageDate = today,
                MessageCount = 0
            };

            _dbContext.AiChatUsages.Add(
                usage);
        }

        if (usage.MessageCount >= DailyLimit)
        {
            return new ChatResponse
            {
                Response =
                    "You have reached today's AI assistant limit. Please come back tomorrow.",
                RemainingMessages = 0
            };
        }

        var latestCarbon =
            await _dbContext.CarbonEntries
                .Where(x =>
                    x.UserId == user.Id)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .FirstOrDefaultAsync();

        var recentMessages =
            await _dbContext.ChatMessages
                .Where(x =>
                    x.UserId == user.Id)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .Take(10)
                .OrderBy(x =>
                    x.CreatedAt)
                .ToListAsync();

        var historyText =
            string.Join(
                "\n",
                recentMessages.Select(x =>
                    $"{x.Role}: {x.Message}")
            );

        var carbonContext =
            latestCarbon == null
                ? "No carbon assessment available."
                : $"""
Carbon Score: {latestCarbon.CarbonScore}

Transportation Emission:
{latestCarbon.TransportationEmission}

Home Emission:
{latestCarbon.HomeEmission}

Food Emission:
{latestCarbon.FoodEmission}

Lifestyle Emission:
{latestCarbon.LifestyleEmission}

Total Emission:
{latestCarbon.TotalEmission}
""";

        var prompt =
            $"""
You are CarbonWise AI Sustainability Assistant.

Your purpose:

- Answer sustainability questions.
- Answer environmental questions.
- Help reduce carbon footprint.
- Explain renewable energy.
- Analyze user carbon scores.
- Suggest realistic improvements.

You may answer general questions as well.

User:
{user.Name}

User Sustainability Data:
{carbonContext}

Recent Conversation:
{historyText}

User Question:
{request.Message}
""";

        var apiKey =
            _configuration["Gemini:ApiKey"];

        var client =
            new Client(apiKey: apiKey);

        var geminiResponse =
            await client.Models.GenerateContentAsync(
                "gemini-2.5-flash",
                prompt);

        var assistantResponse =
            geminiResponse.Text ??
            "Sorry, I couldn't generate a response.";

        _dbContext.ChatMessages.Add(
            new ChatMessage
            {
                UserId = user.Id,
                Role = "user",
                Message = request.Message,
                CreatedAt = DateTime.UtcNow
            });

        _dbContext.ChatMessages.Add(
            new ChatMessage
            {
                UserId = user.Id,
                Role = "assistant",
                Message = assistantResponse,
                CreatedAt = DateTime.UtcNow
            });

        usage.MessageCount++;

        await _dbContext.SaveChangesAsync();

        await TrimHistoryAsync(
            user.Id);

        return new ChatResponse
        {
            Response = assistantResponse,
            RemainingMessages =
                DailyLimit -
                usage.MessageCount
        };
    }

    public async Task<List<ChatHistoryResponse>>
        GetHistoryAsync(
            string userKey)
    {
        var user =
            await _dbContext.Users
                .FirstOrDefaultAsync(x =>
                    x.UserKey == userKey);

        if (user == null)
        {
            return new();
        }

        return await _dbContext.ChatMessages
            .Where(x =>
                x.UserId == user.Id)
            .OrderBy(x =>
                x.CreatedAt)
            .Select(x =>
                new ChatHistoryResponse
                {
                    Role = x.Role,
                    Message = x.Message,
                    CreatedAt = x.CreatedAt
                })
            .ToListAsync();
    }

    public async Task ClearHistoryAsync(
        string userKey)
    {
        var user =
            await _dbContext.Users
                .FirstOrDefaultAsync(x =>
                    x.UserKey == userKey);

        if (user == null)
        {
            return;
        }

        var messages =
            await _dbContext.ChatMessages
                .Where(x =>
                    x.UserId == user.Id)
                .ToListAsync();

        _dbContext.ChatMessages.RemoveRange(
            messages);

        await _dbContext.SaveChangesAsync();
    }

    public async Task<ChatUsageResponse>
        GetUsageAsync(
            string userKey)
    {
        var user =
            await _dbContext.Users
                .FirstOrDefaultAsync(x =>
                    x.UserKey == userKey);

        if (user == null)
        {
            return new ChatUsageResponse
            {
                Used = 0,
                Limit = DailyLimit,
                Remaining = DailyLimit
            };
        }

        var today =
            DateTime.UtcNow.Date;

        var usage =
            await _dbContext.AiChatUsages
                .FirstOrDefaultAsync(x =>
                    x.UserId == user.Id &&
                    x.UsageDate == today);

        var used =
            usage?.MessageCount ?? 0;

        return new ChatUsageResponse
        {
            Used = used,
            Limit = DailyLimit,
            Remaining =
                Math.Max(
                    0,
                    DailyLimit - used)
        };
    }

    private async Task TrimHistoryAsync(
        int userId)
    {
        var messages =
            await _dbContext.ChatMessages
                .Where(x =>
                    x.UserId == userId)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .ToListAsync();

        if (messages.Count <= 100)
        {
            return;
        }

        var excess =
            messages
                .Skip(100)
                .ToList();

        _dbContext.ChatMessages
            .RemoveRange(excess);

        await _dbContext.SaveChangesAsync();
    }
}