using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sim.Models.Transport.GameConfigurationTransport;
using Sim.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Controllers
{
    public class GameConfigurationsController : ControllerBase
    {
        private readonly IGameConfigurationsRepository _gameConfigurationsRepository;
        private readonly ILogger<RoomsController> _logger;

        public GameConfigurationsController(IGameConfigurationsRepository gameConfigurationsRepository,
                                            ILogger<RoomsController> logger)
        {
            _gameConfigurationsRepository = gameConfigurationsRepository;
            _logger = logger;
        }

        [HttpGet("/configurations")]
        public async Task<IActionResult> GetConfigurations()
        {
            _logger.LogInformation($"Get configurations in room");

            var configurations = await _gameConfigurationsRepository.GetGameConfigurationsAsync();
            var res = configurations.Select(s => new GameConfigurationTransport(s));

            return Ok(JsonConvert.SerializeObject(res,
                new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }));
        }
    }
}
