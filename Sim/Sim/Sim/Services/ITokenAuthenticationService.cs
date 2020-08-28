using Sim.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Services
{
    public interface ITokenAuthenticationService
    {
        Task<string> GetToken(ApplicationUser user);

        Task<ApplicationUser> CheckCredentialsAsync(LoginRequest request);

        Task<bool> CheckUserAsync(RegistrationRequest request);
    }
}
