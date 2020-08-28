using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sim.Models
{
    public class ApplicationUser : IdentityUser
    {
        public long Wins { get; set; }

        public long Defeats { get; set; }

        public int? RoomId { get; set; }

        [ForeignKey("RoomId")]
        public virtual Room Room { get; set; }
    }
}