using Microsoft.AspNetCore.Identity;
using Sim.Models;
using Sim.Models.Game;
using Sim.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Services.Implementation
{
    public class GameService : IGameService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IGamesRepository _gamesRepository;

        public GameService(UserManager<ApplicationUser> userManager, IGamesRepository gamesRepository)
        {
            _userManager = userManager;
            _gamesRepository = gamesRepository;
        }

        public bool CheckLoser(Game game, PlayerMove playerMove)
        {
            bool res = false;

            if (!game.Players.Contains(playerMove.PlayerId))
                return res;

            var edges = game.GameProgress.Where(g => g.PlayerId == playerMove.PlayerId);
            var poitns = edges.Where(e => e.From == playerMove.From || e.To == playerMove.From)
                .Select(s => s.From == playerMove.From ? s.To : s.From);

            var edge = edges.FirstOrDefault(e => (poitns.Contains(e.From) && e.To == playerMove.To) ||
                (poitns.Contains(e.To) && e.From == playerMove.To));

            if (edge != null)
                res = true;

            return res;
        }

        public async Task PlayerLeaveGameAsync(int gameId, string playerId)
        {
            var game = _gamesRepository.GetGameById(gameId);
            if (game == null)
            {
                throw new Exception($"Game {gameId} does not exist");
            }

            var user = await _userManager.FindByIdAsync(playerId);
            if (user == null)
            {
                throw new Exception($"User {playerId} does not exist");
            }

            game.Players.ToList().Remove(playerId);
            _gamesRepository.UpdateGame(game);
        }

        public async Task<GameActionResult> GameActionAsync(int gameId, PlayerMove playerMove)
        {
            var game = _gamesRepository.GetGameById(gameId);
            if (game == null)
            {
                throw new Exception($"Game {gameId} is not exist");
            }

            if (!game.Players.Contains(playerMove.PlayerId))
            {
                throw new Exception($"Player {playerMove.PlayerId} is not in the game {gameId}");
            }

            var res = GameActionResult.Lose;

            if (CheckLoser(game, playerMove))
            {
                game.GameProgress.Append(playerMove);

                var defeatedUser = _userManager.Users.FirstOrDefault(x => x.Id == playerMove.PlayerId);
                defeatedUser.Defeats++;
                await _userManager.UpdateAsync(defeatedUser);

                game.Players.ToList().Remove(playerMove.PlayerId);

                if (game.Players.Count() == 1)
                {
                    var winner = _userManager.Users.FirstOrDefault(x => x.Id == game.Players.FirstOrDefault());
                    winner.Wins++;
                    await _userManager.UpdateAsync(winner);

                    _gamesRepository.DeleteGame(gameId);
                    res = GameActionResult.LoseEnd;
                }
            }
            else
            {
                game.GameProgress.Append(playerMove);

                var playersList = game.Players.ToList();
                int nextPlayerIndex = (playersList.IndexOf(playerMove.PlayerId) + 1) % playersList.Count;
                game.CurrentPlayer = playersList[nextPlayerIndex];

                _gamesRepository.UpdateGame(game);
                res = GameActionResult.Action;
            }

            return res;
        }
    }
}
