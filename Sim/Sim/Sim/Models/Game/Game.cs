using System.Collections.Generic;

namespace Sim.Models.Game
{
    public class Game
    {
        public int Id { get; set; }

        public string CurrentPlayer { get; set; }

        public IEnumerable<string> Players { get; set; }

        public IEnumerable<PlayerMove> GameProgress { get; set; }

        public Game() { }

        public Game(int id, string currentPlayer, IEnumerable<string> players)
        {
            Id = id;
            CurrentPlayer = currentPlayer;
            Players = players;
            GameProgress = new List<PlayerMove>();
        }
    }
}