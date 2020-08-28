using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sim.Models;
using Sim.Services;
using Sim.Models.Transport;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Sim.Controllers
{
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ITokenAuthenticationService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ITokenAuthenticationService authService,
                               UserManager<ApplicationUser> userManager,
                               ILogger<UsersController> logger)
        {
            _authService = authService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("/users")]
        public async Task<IActionResult> GetTopPlayers(int? limit = null)
        {
            IQueryable<ApplicationUser> users = null;

            if (limit.HasValue)
               users = _userManager.Users.Take(limit.Value);
            else
               users = _userManager.Users;

            var res = users.Select(s => new UserTransport(s));

            _logger.LogInformation("Get top players list");
        
            return Ok(JsonConvert.SerializeObject(res,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/users")]
        [Produces("application/json")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"Registering new user {request.Username}");

                bool check = await _authService.CheckUserAsync(request);

                if(!check)
                {
                    _logger.LogWarning($"Email or username are already in use");
                    return Conflict();
                }

                var newUser = new ApplicationUser()
                {
                    Email = request.Email,
                    UserName = request.Username
                };

                var res = await _userManager.CreateAsync(newUser, request.Password);
                var ress = await _userManager.FindByNameAsync(newUser.UserName);
                if (!res.Succeeded)
                {
                    _logger.LogWarning($"Failed to create user.");
                    return StatusCode(500);
                }

                var token = await _authService.GetToken(ress);

                _logger.LogInformation($"User {newUser.UserName} registered.");

                return Ok(token);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
            
        }

        [HttpGet("/users/{id}")]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if(user == null)
            {
                _logger.LogWarning("User does not exist");
                return NotFound();
            }

            _logger.LogInformation($"Get information for user with id #{user.Id}");

            var res = new UserTransport(user);

            return Ok(JsonConvert.SerializeObject(res,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }
    }
}