using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sim.Models;
using Sim.Services;
using System;
using System.Threading.Tasks;

namespace Sim.Controllers
{
    [Authorize]
    [Produces("application/json")]
    public class AccountController : ControllerBase
    {        
        private readonly ITokenAuthenticationService _authService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ITokenAuthenticationService authService,
                                 ILogger<AccountController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/session")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"Authorizing user {request.Username}");

                var user = await _authService.CheckCredentialsAsync(request);
                if (user == null)
                {
                    _logger.LogWarning($"User {request.Username} failed to log in.");
                    return NotFound();
                }

                var token = await _authService.GetToken(user);

                _logger.LogInformation($"User {request.Username} logged in.");

                return Ok(token);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }       
    }
}