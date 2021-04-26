import { NextFunction } from 'express';
import { globalEmitter } from '../events';
import {
  IFriendController,
  IFriendService,
  Req,
  Res,
} from '../types';

export class FriendController implements IFriendController {
  friendService: IFriendService;
  constructor(friendService: IFriendService) {
    this.friendService = friendService;
  }

  postAdd = async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?._id;
    const targetId = req.body.targetId;

    try {
      if (!userId) throw new Error('User id not provided');
      if (!targetId) throw new Error('Target id not provided');

      const user = await this.friendService.SendRequest(
        userId,
        targetId,
      );
      globalEmitter.emit('FRIEND_REQUEST', { user, targetId });
      res.json({
        msg: 'Friend request sent!',
        body: { id: targetId },
      });
    } catch (error) {
      next(error);
    }
  };

  postAccept = async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?._id;
    const targetId = req.body.targetId;

    try {
      if (!userId) throw new Error('User id not provided');
      if (!targetId) throw new Error('Target id not provided');

      const [user, target] = await this.friendService.AcceptRequest(
        userId,
        targetId,
      );
      globalEmitter.emit('FRIEND_ACCEPTED', { user, target });
      res.json({
        msg: 'User added to your friendlist',
        body: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  postBlock = async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?._id;
    const targetId = req.body.targetId;

    try {
      if (!userId) throw new Error('User id not provided');
      if (!targetId) throw new Error('Target id not provided');

      const target = await this.friendService.Block(userId, targetId);
      globalEmitter.emit('FRIEND_BLOCKED', { userId, target });
      res.json({ msg: 'User blocked', body: { user: target } });
    } catch (error) {
      next(error);
    }
  };

  postRemove = async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?._id;
    const targetId = req.body.targetId;

    try {
      if (!userId) throw new Error('User id not provided');
      if (!targetId) throw new Error('Target id not provided');
      await this.friendService.RemoveFriend(userId, targetId);
      globalEmitter.emit('FRIEND_REMOVED', { userId, targetId });
      res.json({
        msg: 'User removed from your friendlist',
        body: { id: targetId },
      });
    } catch (error) {
      next(error);
    }
  };

  getFriendList = async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?._id;

    try {
      if (!userId) throw new Error('User id not provided');
      const friends = await this.friendService.getFriendList(userId);
      res.json({
        msg: 'Here is your friend list',
        body: {
          friends,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
