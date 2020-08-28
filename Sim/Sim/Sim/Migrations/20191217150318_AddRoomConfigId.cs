using Microsoft.EntityFrameworkCore.Migrations;

namespace Sim.Migrations
{
    public partial class AddRoomConfigId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GameConfigurationId",
                table: "Rooms",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_GameConfigurationId",
                table: "Rooms",
                column: "GameConfigurationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_GameConfigurations_GameConfigurationId",
                table: "Rooms",
                column: "GameConfigurationId",
                principalTable: "GameConfigurations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_GameConfigurations_GameConfigurationId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_GameConfigurationId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "GameConfigurationId",
                table: "Rooms");
        }
    }
}
