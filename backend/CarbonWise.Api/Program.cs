using System.Diagnostics.CodeAnalysis;
using CarbonWise.Api.Data;
using CarbonWise.Api.Services.Implementations;
using CarbonWise.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// HttpClient
builder.Services.AddHttpClient();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin.Contains(".vercel.app") ||
                origin == "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Database
builder.Services.AddDbContext<CarbonWiseDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICarbonCalculationService, CarbonCalculationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IChallengeService, ChallengeService>();
builder.Services.AddScoped<IAiCoachService, AiCoachService>();
builder.Services.AddScoped<IAiAssistantService, AiAssistantService>();
builder.Services.AddScoped<IScenarioService, ScenarioService>();
builder.Services.AddScoped<IGamificationService, GamificationService>();
builder.Services.AddScoped<IGeminiService, GeminiService>();

var app = builder.Build();

//
// Global Exception Handling
//
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode =
            StatusCodes.Status500InternalServerError;

        context.Response.ContentType =
            "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            message = "An unexpected error occurred."
        });
    });
});

//
// Security Headers
//
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] =
        "nosniff";

    context.Response.Headers["X-Frame-Options"] =
        "DENY";

    context.Response.Headers["Referrer-Policy"] =
        "strict-origin-when-cross-origin";

    context.Response.Headers["X-Permitted-Cross-Domain-Policies"] =
        "none";

    context.Response.Headers["Permissions-Policy"] =
        "camera=(), microphone=(), geolocation=()";

    await next();
});

//
// HSTS
//
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

//
// HTTPS
//
app.UseHttpsRedirection();

//
// Swagger
//
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "CarbonWise API v1");

    options.RoutePrefix = "swagger";
});

//
// CORS
//
app.UseCors("FrontendPolicy");

//
// Controllers
//
app.MapControllers();

//
// Database Migration & Seed
//
using (var scope = app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<CarbonWiseDbContext>();

    dbContext.Database.Migrate();

    if (!dbContext.Challenges.Any())
    {
        dbContext.Challenges.AddRange(
            ChallengeSeeder.GetSeedData());

        dbContext.SaveChanges();
    }
}

app.Run();

[ExcludeFromCodeCoverage]
public partial class Program;