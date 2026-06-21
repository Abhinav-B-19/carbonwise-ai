using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarbonWise.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGreenPointsToUsers : Migration
    {
        [ExcludeFromCodeCoverage]
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GreenPoints",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GreenPoints",
                table: "Users");
        }
    }
}
