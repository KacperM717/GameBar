import { Server } from 'socket.io';
import { games, GameSocket } from '../games';

let nextRoomId = 0;

export const attachGame = (socket: GameSocket, io: Server) => {
  socket.on('game:queue_join', (gameName: string) => {
    if (!socket.user) return;
    const game = games[gameName];
    socket.join(game.id);
    game.queue = [
      ...game.queue.filter((s: any) => s.socket !== socket),
      { socket: socket, state: 'looking' },
    ];
    io.to(game.id).emit(
      'game:queue_update',
      game.queue.map((q: any) => q.state),
    );
    const found = [];
    for (let i = 0; i < game.queue.length; i++) {
      if (game.queue[i].state === 'looking')
        found.push({ index: i, socket: game.queue[i].socket });
      if (found.length === game.rules.playersPerRoom) {
        const roomId = nextRoomId.toString();
        game.rooms[roomId] = new game.RoomMaker(
          roomId,
          found.map((f) => f.socket),
          io,
        );
        found.forEach(({ socket, index }) => {
          socket.join(roomId);
          socket.gameRoom = game.rooms[roomId];
          game.queue[index].state = 'playing';
        });
        io.to(nextRoomId.toString()).emit('game:room_join', roomId);
        nextRoomId++;
        break;
      }
    }
  });
  socket.on('game:ready', () => {
    socket.gameRoom?.playerReady(socket.user!._id);
  });
  socket.on('game:room_joined', () => {
    socket.emit('game:state_init', socket.gameRoom!.state);
  });
  socket.on('game:ended', (gameName: string) => {
    if (socket.gameRoom) socket.leave(socket.gameRoom.id);
    socket.gameRoom?.playerLeave(socket.user!._id);
    socket.gameRoom = undefined;
    games[gameName].queue = games[gameName].queue.filter(
      (queuer) => queuer.socket !== socket,
    );
    io.to(games[gameName].id).emit(
      'game:queue_update',
      games[gameName].queue.map((q) => q.state),
    );
  });
  socket.on('game:queue_leave', (gameName) => {
    games[gameName].queue = games[gameName].queue.filter(
      (queuer) => queuer.socket !== socket,
    );
    socket.leave(games[gameName].id);
    io.to(games[gameName].id).emit(
      'game:queue_update',
      games[gameName].queue.map((q) => q.state),
    );
  });
  socket.on('game:queue_check', (gameName, ack) => {
    const game = games[gameName];
    if (!game) return;
    ack(game.queue.map((q) => q.state));
  });
  return socket;
};
