import http from 'http';
import { Server } from 'socket.io';
import { SocketData, UserSocket, WSRes } from '../types';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { globalEmitter } from '../events';

export const initSocketIO = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    serveClient: false,
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      allowedHeaders: '*',
      credentials: true,
    },
  });

  globalEmitter.on('FRIEND_REQUEST', ({ user, targetId }) => {
    io.to(targetId).emit('friend:request', user);
  });
  globalEmitter.on('FRIEND_ACCEPTED', ({ user, target }) => {
    io.to(target._id).emit('friend:accepted', user);
    io.to(user._id).emit('friend:accepted', target);
  });
  globalEmitter.on('FRIEND_BLOCKED', ({ userId, target }) => {
    io.to(userId).emit('friend:blocked', target);
    io.to(target._id).emit('friend:blocking', userId);
  });
  globalEmitter.on('FRIEND_REMOVED', ({ userId, targetId }) => {
    io.to(userId).emit('friend:removed', targetId);
    io.to(targetId).emit('friend:removing', userId);
  });

  io.on('connection', (socket: UserSocket) => {
    // Auth Events
    socket.on(
      'login',
      (user: SocketData, res: (a: WSRes<void>) => void) => {
        const { token, _id: id } = user;
        if (!id || !token)
          return res({ ok: false, msg: 'Credentials not provided' });
        const { _id } = jwt.verify(token, JWT_SECRET) as {
          email: string;
          _id: string;
        };
        if (_id !== id)
          return res({ ok: false, msg: 'Credentials do not match' });
        socket.user = user;
        socket.join(socket.user._id);
        socket
          .to(socket.user.friends)
          .emit('friend:online', socket.user._id);
        socket.join(socket.user.chats);
        res({ ok: true, msg: 'WS auth established' });
      },
    );
    socket.on('logout', () => {
      if (!socket.user) return;
      // for (const chat of socket.user.chats) {
      //   console.log('Socket LEAVING chat:', chat);
      // }
      socket
        .to(socket.user.friends)
        .emit('friend:offline', socket.user._id);
      socket.leave(socket.user._id);
    });

    // Friends Events

    // Chats Events
    socket.on('chat:added', (chatId) => {
      if (!socket.user) return;
      socket.user.chats.push(chatId);
      socket.join(chatId);
      socket.to(chatId).emit('chat:joined', socket.user._id);
    });
  });
  return io;
};
