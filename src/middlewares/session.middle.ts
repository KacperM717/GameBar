// import { NextFunction, Request, Response } from 'express';
// import SessionService from '../services/session.service';

// interface ISessionMiddleware {
//   secret: string;
//   maxAge: number;
// }

// const session = (options: ISessionMiddleware) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const authCookie = req.cookies.auth;
//     if (SessionService.check(authCookie))
//       throw new Error('User session invalid');
//     next();
//   };
// };

// export default session;
