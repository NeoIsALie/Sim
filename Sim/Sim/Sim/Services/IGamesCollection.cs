using Sim.Models.Game;
using System.Collections.Generic;

namespace Sim.Services
{
    public interface IGamesCollection
    {
        bool Add(Game game);

        bool Remove(int id);

        bool Update(Game game);

        Game Get(int id);

        IEnumerable<Game> GetAll();
    }
}
