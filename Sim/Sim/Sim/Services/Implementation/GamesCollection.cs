using Sim.Models.Game;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Sim.Services.Implementation
{
    public class GamesCollection : IGamesCollection
    {
        private ConcurrentDictionary<int, Game> gamesColletion;

        public GamesCollection()
        {
            gamesColletion = new ConcurrentDictionary<int, Game>();
        }
        
        public bool Add(Game game)
        {
            return gamesColletion.TryAdd(game.Id, game);
        }

        public bool Remove(int id)
        {
            return gamesColletion.TryRemove(id, out Game game);
        }

        public bool Update(Game game)
        {
            bool res = gamesColletion.TryGetValue(game.Id, out Game oldGame);
            if (res)
            {
                res = gamesColletion.TryUpdate(game.Id, game, oldGame);
            }

            return res;
        }

        public Game Get(int id)
        {
            return gamesColletion.GetValueOrDefault(id);
        }

        public IEnumerable<Game> GetAll()
        {
            return gamesColletion.Values;
        }
    }
}
