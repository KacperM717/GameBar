import User from '../db/models/user.model';
import Friends from '../db/models/friends.model';
import { Friend, IFriendService, UserDoc, UserDTO } from '../types';

export const FriendService: IFriendService = {
  SendRequest: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    const targetFriendList = await Friends.findOne({
      userId: targetId,
    });
    if (!targetFriendList) throw new Error('User not found');
    const friendDoc = targetFriendList.friends.filter(
      ({ id }) => id.toString() === userId,
    )[0];
    if (friendDoc) {
      const { role } = friendDoc;
      if (role === 'blocked')
        throw new Error(`You are blocked by this user`);
      if (role === 'friend')
        throw new Error(`You are already friends with user`);
    }
    await updateFriend(targetId, userId, 'pending');
    const { _id, name, avatar } = (await User.findById(userId).select(
      {
        _id: true,
        name: true,
        avatar: true,
      },
    )) as UserDTO;
    return { _id, name, avatar, role: 'pending' };
  },
  AcceptRequest: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);

    await updateFriend(userId, targetId, 'friend');
    await updateFriend(targetId, userId, 'friend');

    const users = await User.find({
      _id: { $in: [userId, targetId] },
    }).select({ _id: true, name: true });
    return users.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar,
      role: 'friend',
    }));
  },
  Block: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    await updateFriend(userId, targetId, 'blocked');
    await deleteNonBlockedFriend(targetId, userId);
    const { _id, name, avatar } = (await User.findById(
      targetId,
    ).select({
      _id: true,
      name: true,
      avatar: true,
    })) as UserDTO;
    return { _id, name, avatar, role: 'blocked' };
  },
  RemoveFriend: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    await Friends.updateOne(
      { userId },
      { $pull: { friends: { id: targetId } } },
    );
    await deleteNonBlockedFriend(targetId, userId);
  },
  createFriendList: async (user: UserDoc) => {
    return await Friends.create({
      userId: user._id,
    });
  },
  getFriendList: async (userId: string) => {
    const friendsDoc = await Friends.findOne({ userId }).populate(
      'friends.id',
      '_id name avatar',
    );
    if (!friendsDoc) throw new Error('Friend list not found');
    const friends = friendsDoc.friends.map((friend) => ({
      role: friend.role,
      _id: friend.id._id,
      name: friend.id.name,
      avatar: friend.id.avatar,
    }));
    return friends;
  },
};

function throwSameUser(userId: string, targetId: string) {
  if (userId === targetId)
    throw new Error('You are already your best friend');
}

async function updateFriend(
  userId: string,
  targetId: string,
  role: string,
) {
  const friendlist = await Friends.findOne({ userId });
  if (!friendlist) throw new Error('User friendlist does not exist');
  const newFriends = [
    ...friendlist.friends.filter((f) => f.id.toString() !== targetId),
    { id: targetId, role } as Friend,
  ];
  await friendlist.updateOne(
    {
      friends: newFriends,
    },
    { upsert: true },
  );
}

async function deleteNonBlockedFriend(
  userId: string,
  targetId: string,
) {
  return await Friends.updateOne(
    {
      userId,
      friends: {
        $elemMatch: { id: targetId, role: { $ne: 'blocked' } },
      },
    },
    { $pull: { friends: { id: targetId } } },
  );
}

// async function friendsWithName(
//   friends: Friend[],
// ): Promise<FriendDTO[]> {
//   const ids = friends.map(({ id }) => id);
//   const foundUsers = await User.find({
//     _id: { $in: ids },
//   }).select({ name: true, _id: true });

//   return friends.map(({ id, role }) => ({
//     _id: id,
//     role,
//     name: foundUsers.find((u) => u._id.equals(id))!.name,
//   }));
// }
