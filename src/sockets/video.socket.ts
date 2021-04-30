import { UserSocket } from '../types';

export const attachVideo = (socket: UserSocket) => {
  socket.on('video:reject', (friendId) => {
    socket.to(friendId).emit('video:rejected', socket.user?._id);
  });
  socket.on('video:accept', (friendId, peerId) => {
    socket.to(friendId).emit('video:accepted', peerId);
  });
  return socket;
};