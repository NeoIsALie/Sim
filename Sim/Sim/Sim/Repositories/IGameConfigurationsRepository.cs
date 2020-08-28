using Sim.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sim.Repositories
{
    public interface IGameConfigurationsRepository
    {
        Task<GameConfiguration> AddGameConfigurationAsync(GameConfiguration gameConfiguration);

        Task DeleteGameConfigurationAsync(int id);

        Task UpdateGameConfigurationAsync(GameConfiguration gameConfiguration);

        Task<GameConfiguration> GetGameConfigurationByIdAsync(int id);

        Task<IEnumerable<GameConfiguration>> GetGameConfigurationsAsync(int? limit = null);
    }
}
