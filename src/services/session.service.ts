// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "src/config";
// import { IUserSession } from '../types';

// class SessionService {
//   public sessionStore: { [key: string]: IUserSession } = {};
//   MAX_AGE: number;
//   constructor(options: any) {
//     this.MAX_AGE = options.maxAge;
//   }

//   private generateToken(session : IUserSession) {
//       jwt.sign(, JWT_SECRET);
//       jwt.
//   }

//   check(userSession: IUserSession): IUserSession {
//     if (!userSession) throw new Error('Session not found');
//     const session = this.sessionStore[userSession._id];
//     if (!session) throw new Error('Session not found');
//     if (session.token !== userSession.token)
//       throw new Error('Session token does not match');
//     if (session.exp < Date.now()) {
//       delete this.sessionStore[userSession._id];
//       throw new Error('Session token expired');
//     }
//     session.exp = Date.now() + this.MAX_AGE;
//     return session;
//   }

//   // Establishes new session
//   createOrUpdate(id: string): IUserSession {
//     this.sessionStore[id] = {
//       _id: id,
//         token:
//       exp: Date.now() + this.MAX_AGE,
//     };
//     return this.sessionStore[id];
//   }

//   // Deletes session
//   delete(userSession: IUserSession): void {
//     // const session = sessionStore[userSession._id];
//     // if(!session || session.token !== userSession.token) return;
//     delete this.sessionStore[userSession._id];
//   }
// }

// export const sessionService = new SessionService({
//   maxAge: 1000 * 60 * 60,
// });
