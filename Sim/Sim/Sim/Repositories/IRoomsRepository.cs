using System.Collections.Generic;
using System.Threading.Tasks;
using Sim.Models;

namespace Sim.Repositories
{
    public interface IRoomsRepository
    {
        Task<Room> AddRoomAsync(Room room);

        Task UpdateRoomAsync(Room room);

        Task DeleteRoomAsync(int id);

        Task<IEnumerable<Room>> GetRoomsAsync(int? limit = null);

        Task<Room> GetRoomByIdAsync(int id);

        Task<Room> GetRoomByNameAsync(string name);
    }
}