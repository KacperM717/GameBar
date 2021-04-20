import Friends from '../db/models/friends.model';
import { IFriendService, UserDoc, FriendsDoc } from '../types';

const throwSameUser = (userId: string, targetId: string) => {
  if (userId === targetId)
    throw new Error('You are already your best friend');
};

export const FriendService: IFriendService = {
  SendRequest: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    const targetFriendList = await Friends.findOne({
      userId: targetId,
    });
    if (!targetFriendList) throw new Error('User not found');
    const userBlockedByTarget = targetFriendList.blocked.some(
      (id) => id === userId,
    );
    if (userBlockedByTarget)
      throw new Error('You are blocked by this user');

    await targetFriendList.updateOne({
      $addToSet: { pending: userId },
    });
  },
  AcceptRequest: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);

    await Friends.updateOne(
      { userId },
      {
        $addToSet: { friends: targetId },
        $pull: { pending: targetId },
      },
    );
    await Friends.updateOne(
      { targetId },
      {
        $addToSet: { friends: userId },
        $pull: { pending: userId },
      },
    );
  },
  Block: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    await Friends.updateOne(
      { userId },
      {
        $pull: { pending: targetId, friends: targetId },
        $addToSet: { blocked: targetId },
      },
    );
    await Friends.updateOne(
      { userId: targetId },
      { $pull: { pending: userId, friends: userId } },
    );
  },
  RemoveFriend: async (userId: string, targetId: string) => {
    throwSameUser(userId, targetId);
    await Friends.updateOne(
      { userId },
      {
        $pull: {
          pending: targetId,
          friends: targetId,
          blocked: targetId,
        },
      },
    );
    await Friends.updateOne(
      { userId: targetId },
      {
        $pull: {
          pending: userId,
          friends: userId,
        },
      },
    );
  },
  createFriendList: async (user: UserDoc) => {
    return await Friends.create({
      userId: user._id,
    });
  },
  getFriendList: async (userId: string) => {
    return (await Friends.findOne({ userId })) as FriendsDoc;
  },
};
