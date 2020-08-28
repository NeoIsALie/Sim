using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Sim.Models
{
    public class RegistrationRequest
    {
        [Required]
        [JsonProperty("email")]
        public string Email { get; set; }

        [Required]
        [JsonProperty("username")]
        public string Username { get; set; }

        [Required]
        [JsonProperty("password")]
        public string Password { get; set; }
    }
}