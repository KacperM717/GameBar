import { Req, Res } from '../types';
import { NextFunction } from 'express';

const logger = {
  req: (req: Req, res: Res, next: NextFunction) => {
    console.time('Logging time: ');
    console.group('REQUEST');
    console.group('Metadata');
    console.table([
      { Time: new Date(), IP: req.ip, Res: req.originalUrl },
    ]);
    console.groupEnd();
    console.group('Headers');
    console.table(req.headers);
    console.groupEnd();
    console.groupEnd();
    console.timeEnd('Logging time: ');
    next();
  },
};

export default logger;
