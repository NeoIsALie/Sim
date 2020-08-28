using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sim.Models
{
    [JsonObject("AuthOptions")]
    public class AuthOptions
    {
        [JsonProperty("secret")]
        public string Secret { get; set; }

        [JsonProperty("accessExpiration")]
        public int AccessExpiration { get; set; }
    }
}
