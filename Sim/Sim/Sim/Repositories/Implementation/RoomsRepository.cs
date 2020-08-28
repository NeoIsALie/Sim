using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sim.Models;

namespace Sim.Repositories.Implementation
{
    public class RoomsRepository : IRoomsRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public RoomsRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Room> AddRoomAsync(Room room)
        {
            var res = _dbContext.Rooms.Add(room);
            await _dbContext.SaveChangesAsync();

            return res.Entity;
        }

        public async Task UpdateRoomAsync(Room room)
        {
            _dbContext.Rooms.Update(room);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(int id)
        {
            Room room = await _dbContext.Rooms.FirstOrDefaultAsync(f => f.Id == id);
            if (room != null)
            {
                _dbContext.Rooms.Remove(room);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Room>> GetRoomsAsync(int? limit)
        {
            IEnumerable<Room> result = null;

            if (limit.HasValue)
                result = await _dbContext.Rooms.Take(limit.Value).ToListAsync();
            else
                result = await _dbContext.Rooms.ToListAsync();

            return result;
        }

        public Task<Room> GetRoomByIdAsync(int id)
        {
            return _dbContext.Rooms.FirstOrDefaultAsync(f => f.Id == id);
        }

        public Task<Room> GetRoomByNameAsync(string name)
        {
            return _dbContext.Rooms.FirstOrDefaultAsync(f => f.Name == name);
        }
    }
}