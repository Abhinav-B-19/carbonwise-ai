using CarbonWise.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CarbonWise.Api.Tests.Helpers;

public static class DbContextFactory
{
    public static CarbonWiseDbContext Create()
    {
        var options =
            new DbContextOptionsBuilder<CarbonWiseDbContext>()
                .UseInMemoryDatabase(
                    Guid.NewGuid().ToString())
                .Options;

        return new CarbonWiseDbContext(options);
    }
}