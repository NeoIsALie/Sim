using Sim.Models.Game;
using Sim.Services;
using System.Collections.Generic;
using System.Linq;

namespace Sim.Repositories.Implementation
{
    public class GamesRepository : IGamesRepository
    {
        private readonly IGamesCollection _gamesCollection;

        public GamesRepository(IGamesCollection gamesCollection)
        {
            _gamesCollection = gamesCollection;
        }

        public Game AddGame(Game game)
        {
            Game res = null;
            if (_gamesCollection.Add(game))
                res = game;

            return res;
        }

        public void DeleteGame(int id)
        {
            _gamesCollection.Remove(id);
        }

        public Game UpdateGame(Game game)
        {
            Game res = null;
            if (_gamesCollection.Update(game))
                res = game;

            return res;
        }

        public Game GetGameById(int id)
        {
            return _gamesCollection.Get(id);
        }

        public IEnumerable<Game> GetGames(int? limit = null)
        {
            if (limit.HasValue)
                return _gamesCollection.GetAll().Take(limit.Value);

            return _gamesCollection.GetAll();
        }
    }
}
