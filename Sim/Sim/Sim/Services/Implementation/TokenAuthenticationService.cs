using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sim.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Sim.Services.Implementation
{
    public class TokenAuthenticationService : ITokenAuthenticationService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AuthOptions _authOptions;

        public TokenAuthenticationService(SignInManager<ApplicationUser> signInManager,
                                          UserManager<ApplicationUser> userManager,
                                          IOptions<AuthOptions> authOptions)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _authOptions = authOptions.Value;
        }

        public async Task<string> GetToken(ApplicationUser user)
        {
            string token = string.Empty;

            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            var identity = (ClaimsIdentity)principal.Identity;
            if (identity == null)
            {
                return null;
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authOptions.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = identity.Claims;

            var jwtToken = new JwtSecurityToken(
                notBefore: DateTime.UtcNow,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_authOptions.AccessExpiration),
                signingCredentials: credentials
            );

            token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            return token;
        }

        public async Task<ApplicationUser> CheckCredentialsAsync(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
                return user;
            var passValided = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passValided)
                return null;
            return user;
        }

        public async Task<bool> CheckUserAsync(RegistrationRequest request)
        {
            var email = await _userManager.FindByEmailAsync(request.Email);
            if (email != null)
                return false;

            var user = await _userManager.FindByNameAsync(request.Username);
            if (user != null)
                return false;
            return true;
        }
    }
}
