using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarbonWise.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCompletedAtToDailyChallengeAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "DailyChallengeAssignments",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "DailyChallengeAssignments");
        }
    }
}
