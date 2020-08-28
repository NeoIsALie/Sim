using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sim.Models
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int MaxPlayers { get; set; }

        [Required]
        public int CurrentPlayersCount{ get; set; }

        [Required]
        public string LeaderId { get; set; }

        [Required]
        public bool Status { get; set; }

        public virtual IEnumerable<ApplicationUser> Users { get; set; }

        public int GameConfigurationId { get; set; }

        [ForeignKey("GameConfigurationId")]
        public virtual GameConfiguration GameConfiguration { get; set; }
    }
}