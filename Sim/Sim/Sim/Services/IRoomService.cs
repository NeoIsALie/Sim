using Sim.Models.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Services
{
    public interface IRoomService
    {
        Task<Game> StartGameAsync(int roomId, string playerId);

        Task ConnectPlayerToRoomAsync(int roomId, string playerId);

        Task DisconnectPlayerFromRoomAsync(int roomId, string playerId);
    }
}
