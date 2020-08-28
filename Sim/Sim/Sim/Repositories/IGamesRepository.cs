using Sim.Models.Game;
using System.Collections.Generic;

namespace Sim.Repositories
{
    public interface IGamesRepository
    {
        Game AddGame(Game game);

        void DeleteGame(int id);

        Game UpdateGame(Game game);

        IEnumerable<Game> GetGames(int? limit = null);

        Game GetGameById(int id);
    }
}
