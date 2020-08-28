using Sim.Models.Game;
using System.Threading.Tasks;

namespace Sim.Services
{
    public interface IGameService
    {
        bool CheckLoser(Game game, PlayerMove playerMove);

        Task PlayerLeaveGameAsync(int gameId, string playerId);

        Task<GameActionResult> GameActionAsync(int gameId, PlayerMove playerMove);
    }
}
