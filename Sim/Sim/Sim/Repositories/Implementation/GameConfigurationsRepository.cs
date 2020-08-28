using Microsoft.EntityFrameworkCore;
using Sim.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Repositories.Implementation
{
    public class GameConfigurationsRepository : IGameConfigurationsRepository
    {
        public readonly ApplicationDbContext _dbContext;

        public GameConfigurationsRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GameConfiguration> AddGameConfigurationAsync(GameConfiguration gameConfiguration)
        {
            var res = _dbContext.GameConfigurations.Add(gameConfiguration);
            await _dbContext.SaveChangesAsync();

            return res.Entity;
        }

        public async Task DeleteGameConfigurationAsync(int id)
        {
            var gameConfiguration = await _dbContext.GameConfigurations.FirstOrDefaultAsync(g => g.Id == id);
            if (gameConfiguration != null)
            {
                _dbContext.GameConfigurations.Remove(gameConfiguration);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task UpdateGameConfigurationAsync(GameConfiguration gameConfiguration)
        {
            _dbContext.GameConfigurations.Update(gameConfiguration);
            await _dbContext.SaveChangesAsync();
        }

        public Task<GameConfiguration> GetGameConfigurationByIdAsync(int id)
        {
            return _dbContext.GameConfigurations.FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<IEnumerable<GameConfiguration>> GetGameConfigurationsAsync(int? limit = null)
        {
            if (limit.HasValue)
                return await _dbContext.GameConfigurations.Take(limit.Value).ToListAsync();
            else
                return await _dbContext.GameConfigurations.ToListAsync();
        }
    }
}
