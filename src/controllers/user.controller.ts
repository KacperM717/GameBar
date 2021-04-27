import { NextFunction } from 'express';
import { IUserController, IUserService, Req, Res } from '../types';

export class UserController implements IUserController {
  userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  getAllByName = async (req: Req, res: Res, next: NextFunction) => {
    const name = req.query.name;

    try {
      if (!name) throw new Error('Name is empty');

      const users = await this.userService.findAllByName(
        name as string,
      );

      res.json({
        msg: `Found ${users.length} users.`,
        body: users,
      });
    } catch (error) {
      next(error);
    }
  };

  postAllWithIds = async (req: Req, res: Res, next: NextFunction) => {
    const ids = req.body.ids;

    try {
      if (!ids || ids.length === 0)
        throw new Error('Ids not provided');

      const users = await this.userService.findAllWithIds(ids);

      res.json({
        msg: `Returning ${users.length} users`,
        body: users,
      });
    } catch (error) {
      next(error);
    }
  };
}
