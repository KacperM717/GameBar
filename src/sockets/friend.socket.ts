import { FriendDTO, UserSocket } from '../types';

export const attachFriend = (
  socket: UserSocket,
  connected: string[],
) => {
  socket.on('friend:init', (friends: FriendDTO[]) => {
    socket.user!.friends = friends;
    const verifiedFriends = socket
      .user!.friends.filter((friend) => friend.role === 'friend')
      .map((friend) => friend._id);
    if (verifiedFriends.length > 0)
      socket
        .to(verifiedFriends)
        .emit('friend:online', [socket.user!._id]);
    const onlineFriends = connected.filter((id) =>
      verifiedFriends.includes(id),
    );
    socket.emit('friend:online', onlineFriends);
  });

  return socket;
};
