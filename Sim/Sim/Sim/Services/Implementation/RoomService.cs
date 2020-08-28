using Microsoft.AspNetCore.Identity;
using Sim.Models;
using Sim.Models.Game;
using Sim.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sim.Services.Implementation
{
    public class RoomService : IRoomService
    {
        private readonly IGamesRepository _gamesRepository;
        private readonly IGameConfigurationsRepository _gameConfigurationRepository;
        private readonly IRoomsRepository _roomsRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IGameService _gameService;

        public RoomService(IGamesRepository gamesRepository,
            IGameConfigurationsRepository gameConfigurationsRepository,
            IRoomsRepository roomsRepository,
            UserManager<ApplicationUser> userManager,
            IGameService gameService)
        {
            _gamesRepository = gamesRepository;
            _gameConfigurationRepository = gameConfigurationsRepository;
            _roomsRepository = roomsRepository;
            _userManager = userManager;
            _gameService = gameService;
        }

        public async Task<Game> StartGameAsync(int roomId, string playerId)
        {
            var room = await _roomsRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new Exception($"Room {roomId} does not exist");
            }

            if (room.LeaderId != playerId)
            {
                throw new Exception($"Player {playerId} is not a room leader");
            }

            if (room.CurrentPlayersCount < 2)
            {
                throw new Exception($"Not enough players in room {roomId}");
            }

            room.Status = true;
            await _roomsRepository.UpdateRoomAsync(room);

            var players = _userManager.Users
                .Where(u => u.RoomId == roomId)
                .Select(u => u.Id).ToArray();
            string currentPlayer = players.FirstOrDefault();

            Game game = new Game(roomId, currentPlayer, players);

            _gamesRepository.AddGame(game);

            return game;
        }

        public async Task ConnectPlayerToRoomAsync(int roomId, string playerId)
        {
            var room = await _roomsRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new Exception($"Room {roomId} does not exist");
            }

            var user = await _userManager.FindByIdAsync(playerId);
            if (user == null)
            {
                throw new Exception($"User {user.Id} does not exist");
            }

            if (room.CurrentPlayersCount >= room.MaxPlayers)
            {
                throw new Exception($"Room {roomId} is full");
            }

            user.RoomId = roomId;
            if (string.IsNullOrEmpty(room.LeaderId))
                room.LeaderId = user.Id;

            room.CurrentPlayersCount++;

            await _roomsRepository.UpdateRoomAsync(room);
            await _userManager.UpdateAsync(user);
        }

        public async Task DisconnectPlayerFromRoomAsync(int roomId, string playerId)
        {
            var room = await _roomsRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new Exception($"Room {roomId} does not exist");
            }

            var user = await _userManager.FindByIdAsync(playerId);
            if (user == null)
            {
                throw new Exception($"User {playerId} does not exist");
            }

            user.RoomId = null;
            room.CurrentPlayersCount--;

            if (room.Status)
            {
                Game game = _gamesRepository.GetGameById(roomId);
                if (game.Players.Contains(playerId))
                {
                    game.Players.ToList().Remove(user.Id);
                    _gamesRepository.UpdateGame(game);
                }
            }

            if (room.CurrentPlayersCount == 0)
                await _roomsRepository.DeleteRoomAsync(room.Id);
            else
                await _roomsRepository.UpdateRoomAsync(room);

            await _userManager.UpdateAsync(user);
        }
    }
}
