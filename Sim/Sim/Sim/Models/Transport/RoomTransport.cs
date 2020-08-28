using System.ComponentModel.DataAnnotations;

namespace Sim.Models.Transport
{
    public class RoomTransport
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int MaxPlayers { get; set; }

        [Required]
        public string LeaderId { get; set; }

        [Required]
        public int GameConfigurationId { get; set; }

        public bool Status { get; set; }

        public int CurrentPlayersCount { get; set; }

        public RoomTransport()
        {
        }

        public RoomTransport(Room room)
        {
            Id = room.Id;
            Name = room.Name;
            MaxPlayers = room.MaxPlayers;
            CurrentPlayersCount = room.CurrentPlayersCount;
            LeaderId = room.LeaderId;
            Status = room.Status;
            GameConfigurationId = room.GameConfigurationId;
        }
    }
}
