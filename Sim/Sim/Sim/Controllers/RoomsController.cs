using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sim.Models;
using Sim.Models.Transport;
using Sim.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Controllers
{
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRoomsRepository _roomsRepository;
        private readonly IGameConfigurationsRepository _gameConfigurationsRepository;
        private readonly ILogger<RoomsController> _logger;

        public RoomsController(UserManager<ApplicationUser> userManager,
                               IRoomsRepository roomsRepository,
                               IGameConfigurationsRepository gameConfigurationsRepository,
                               ILogger<RoomsController> logger)
        {
            _userManager = userManager;
            _roomsRepository = roomsRepository;
            _gameConfigurationsRepository = gameConfigurationsRepository;
            _logger = logger;
        }

        [HttpGet("/rooms")]
        public async Task<IActionResult> Rooms(int? limit = null)
        {
            IEnumerable<Room> rooms = null;
            if (limit.HasValue)
                rooms = await _roomsRepository.GetRoomsAsync(limit.Value);
            else
                rooms = await _roomsRepository.GetRoomsAsync();

            var res = rooms.Select(s => new RoomTransport(s));

            _logger.LogInformation("Get room list");

            return Ok(JsonConvert.SerializeObject(res,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }

        [HttpPost("/rooms")]
        public async Task<IActionResult> Rooms([FromBody] RoomTransport roomTransport)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userManager.FindByIdAsync(roomTransport.LeaderId);
            if (user == null)
                return NotFound();

            var checkRoom = await _roomsRepository.GetRoomByNameAsync(roomTransport.Name);
            if (checkRoom != null)
                return Conflict();

            Room room = new Room()
            {
                Name = roomTransport.Name,
                MaxPlayers = roomTransport.MaxPlayers,
                LeaderId = roomTransport.LeaderId,
                CurrentPlayersCount = 0,
                Status = false,
                GameConfigurationId = roomTransport.GameConfigurationId
            };

            var res = await _roomsRepository.AddRoomAsync(room);

            if (res == null)
            {
                _logger.LogWarning($"User #{user.Id} failed to create room");
                return StatusCode(500);
            }

            var newRoom = new RoomTransport(res);

            _logger.LogInformation($"User #{user.Id} create room #{room.Id}");

            return Created(string.Empty, JsonConvert.SerializeObject(newRoom,
                new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }

        [HttpGet("/rooms/{id}")]
        public async Task<IActionResult> Rooms(int id)
        {
            var room = await _roomsRepository.GetRoomByIdAsync(id);
            if (room == null)
                return NotFound();

            _logger.LogInformation($"Get users in room #{room.Id}");

            IEnumerable<UserTransport> res = null;
            if (room.CurrentPlayersCount > 0)
                res = room.Users.Select(s => new UserTransport(s));

            return Ok(JsonConvert.SerializeObject(res,
                new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }
    }
}
