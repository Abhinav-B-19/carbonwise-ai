namespace CarbonWise.Api.Services.Interfaces;

public interface IGeminiService
{
    Task<string?> GenerateAsync(string prompt);
}