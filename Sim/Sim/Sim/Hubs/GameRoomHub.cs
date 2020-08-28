using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Sim.Models;
using Sim.Models.Game;
using Sim.Models.Transport;
using Sim.Repositories;
using Sim.Services;
using System;
using System.Threading.Tasks;

namespace Sim.Hubs
{
    [Authorize]
    public class GameRoomHub : Hub<IGameRoomClient>
    {
        private readonly IGamesRepository _gamesRepository;
        private readonly IGameService _gameService;
        private readonly IRoomService _roomService;
        private readonly IRoomsRepository _roomsRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<GameRoomHub> _logger;

        public GameRoomHub(IGamesRepository gamesRepository, 
            IGameService gameService,
            IRoomService roomService,
            IRoomsRepository roomsRepository,
            UserManager<ApplicationUser> userManager,
            ILogger<GameRoomHub> logger)
        {
            _gamesRepository = gamesRepository;
            _gameService = gameService;
            _roomService = roomService;
            _roomsRepository = roomsRepository;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task StartGame(int roomId, string playerId)
        {
            _logger.LogInformation($"Try to start game in room {roomId}");
            try
            {
                Game game = await _roomService.StartGameAsync(roomId, playerId);
                _logger.LogInformation($"Start game in room {roomId}");
                await Clients.Group(roomId.ToString()).StartGame(game.CurrentPlayer);
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                await Clients.Caller.Error(ex.Message);
            }
        }

        public async Task ConnectToRoom(int roomId, string playerId)
        {
            _logger.LogInformation($"Player {playerId} is trying to connect to room {roomId}");

            try
            {
                await _roomService.ConnectPlayerToRoomAsync(roomId, playerId);
                var room = await _roomsRepository.GetRoomByIdAsync(roomId);
                var user = await _userManager.FindByIdAsync(playerId);
                UserTransport player = new UserTransport(user);
                _logger.LogInformation($"Player {playerId} connected to room {roomId}");

                await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());
                await Clients.Group(roomId.ToString()).PlayerConnect(room.LeaderId, player);
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                await Clients.Caller.Error(ex.Message);
            }
        }

        public async Task DisconnectFromRoom(int roomId, string playerId)
        {
            _logger.LogInformation($"Player {playerId} is trying to disconnect from room {roomId}");
            try
            {
                await _roomService.DisconnectPlayerFromRoomAsync(roomId, playerId);
                _logger.LogInformation($"Player {playerId} disconnected from room {roomId}");

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId.ToString());
                await Clients.OthersInGroup(roomId.ToString()).PlayerDisconnect(playerId);
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                await Clients.Caller.Error(ex.Message);
            }
        }

        public async Task LeaveGame(int roomId, int gameId, string playerId)
        {
            _logger.LogInformation($"Player {playerId} is trying to leave game {gameId}");

            try
            {
                await _gameService.PlayerLeaveGameAsync(gameId, playerId);

                _logger.LogInformation($"Player {playerId} leave game {gameId}");
                await Clients.OthersInGroup(roomId.ToString()).PlayerLeaveGame(playerId);
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                await Clients.Caller.Error(ex.Message);
            }
        }

        public async Task GameAction(int gameId, PlayerMove playerMove)
        {
            try
            {
                var res = await _gameService.GameActionAsync(gameId, playerMove);
                Game game = _gamesRepository.GetGameById(gameId);

                _logger.LogInformation($"Player {playerMove.PlayerId} in game " +
                    $"{gameId} connect ({playerMove.From}, {playerMove.To})");
                _logger.LogInformation($"Game {gameId}: next player {game.CurrentPlayer}");

                await Clients.OthersInGroup(gameId.ToString()).GameMove(playerMove, game.CurrentPlayer);

                if (res == GameActionResult.Lose)
                {
                    _logger.LogInformation($"Player {playerMove.PlayerId} lost the game {gameId}");
                    await Clients.Group(gameId.ToString()).LoseGame(playerMove.PlayerId);
                }
                else if (res == GameActionResult.LoseEnd)
                {
                    _logger.LogInformation($"Player {playerMove.PlayerId} lost  game {gameId}");
                    _logger.LogInformation($"Player {game.CurrentPlayer} win  game {gameId}");

                    await Clients.Group(gameId.ToString()).LoseGame(playerMove.PlayerId);
                    await Clients.Group(gameId.ToString()).EndGame(game.CurrentPlayer);
                }
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex.Message);
                await Clients.Caller.Error(ex.Message);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            var userName = httpContext.User.Identity.Name;

            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
            {
                if (user.RoomId.HasValue)
                {
                    await DisconnectFromRoom(user.RoomId.Value, user.Id);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
