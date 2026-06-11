using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarbonWise.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddChallengeCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChallengeType",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "ChallengeType",
                table: "Challenges");
        }
    }
}
