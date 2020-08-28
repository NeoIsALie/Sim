using Sim.Models.Game;
using Sim.Models.Transport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Hubs
{
    public interface IGameRoomClient
    {
        Task StartGame(string currentPlayer);

        Task LoseGame(string playerId);

        Task EndGame(string player);

        Task GameMove(PlayerMove playerMove, string nextPlayer);

        Task PlayerConnect(string LeaderId, UserTransport player);

        Task PlayerDisconnect(string player);

        Task PlayerLeaveGame(string player);

        Task Error(string message);
    }
}
