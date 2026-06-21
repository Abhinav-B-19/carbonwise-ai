using Google.GenAI;
using CarbonWise.Api.Services.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace CarbonWise.Api.Services.Implementations;

[ExcludeFromCodeCoverage]
public class GeminiService : IGeminiService
{
    private readonly IConfiguration _configuration;

    public GeminiService(
        IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string?> GenerateAsync(
        string prompt)
    {
        var apiKey =
            _configuration["Gemini:ApiKey"];

        var client =
            new Client(apiKey: apiKey);

        var response =
            await client.Models
                .GenerateContentAsync(
                    "gemini-2.5-flash",
                    prompt);

        return response.Text;
    }
}