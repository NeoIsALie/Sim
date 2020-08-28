using System.ComponentModel.DataAnnotations;

namespace Sim.Models.Transport
{
    public class UserTransport
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public long Wins { get; set; }

        [Required]
        public long Defeats { get; set; }

        public UserTransport()
        {
        }

        public UserTransport(ApplicationUser user)
        {
            Id = user.Id;
            Name = user.UserName;
            Wins = user.Wins;
            Defeats = user.Defeats;
        }
    }
}
