import { JWT_SECRET } from '../config';
import { TokenDTO, UserSocket, WSRes } from '../types';
import jwt from 'jsonwebtoken';

export const attachAuth = (
  socket: UserSocket,
  connected: string[],
) => {
  socket.user = {
    name: '',
    avatar: '',
    _id: '',
    token: '',
    friends: [],
    chats: [],
  };
  // Auth Events
  socket.on(
    'login',
    (
      {
        _id,
        token,
        name,
        avatar,
      }: TokenDTO & { name: string; avatar: string },
      res: (a: WSRes<void>) => void,
    ) => {
      if (!_id || !token)
        return res({ ok: false, msg: 'Credentials not provided' });
      const { _id: id } = jwt.verify(token, JWT_SECRET) as {
        email: string;
        _id: string;
      };
      if (_id !== id)
        return res({ ok: false, msg: 'Credentials do not match' });
      // Pass to user object
      socket.user!.name = name;
      socket.user!.avatar = avatar;
      socket.user!._id = _id;
      socket.user!.token = token;
      socket.join(socket.user!._id);
      connected.push(_id);
      res({ ok: true, msg: 'WS auth established' });
    },
  );
  socket.on('logout', () => {
    if (!socket.user) return;
    for (const { _id } of socket.user.chats) {
      socket.to(_id).emit('chat:user_offline', socket.user!._id);
    }
    const verifiedFriends = socket.user.friends
      .filter((friend) => friend.role === 'friend')
      .map((friend) => friend._id);
    if (verifiedFriends.length > 0)
      socket
        .to(verifiedFriends)
        .emit('friend:offline', socket.user._id);
    socket.leave(socket.user._id);
    connected = connected.filter((id) => id !== socket.user!._id);
    socket.user._id = '';
  });
  socket.on('disconnect', () => {
    if (!socket.user?._id) return;
    for (const { _id } of socket.user.chats) {
      socket.to(_id).emit('chat:user_offline', socket.user!._id);
    }
    const verifiedFriends = socket.user.friends
      .filter((friend) => friend.role === 'friend')
      .map((friend) => friend._id);
    if (verifiedFriends.length > 0)
      socket
        .to(verifiedFriends)
        .emit('friend:offline', socket.user._id);
    socket.leave(socket.user._id);
    connected = connected.filter((id) => id !== socket.user!._id);
    socket.user = undefined;
  });

  return socket;
};
