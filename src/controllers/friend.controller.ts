import { NextFunction } from 'express';
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

      await this.friendService.SendRequest(userId, targetId);
      res.json({ message: 'Friend request sent!' });
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

      await this.friendService.AcceptRequest(userId, targetId);
      res.json({ message: 'User added to your friendlist' });
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

      await this.friendService.Block(userId, targetId);
      res.json({ message: 'User blocked' });
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
      res.json({ message: 'User removed from your friendlist' });
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
        message: 'Here is your friend list',
        body: {
          friends,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
