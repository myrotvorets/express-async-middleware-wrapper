import type { NextFunction, Request, RequestHandler, Response } from 'express';

export default function asyncWrapperMiddleware(fn: RequestHandler): RequestHandler {
    const name = `async wrapper for ${fn.name}`;
    const r = {
        [name]: function (req: Request, res: Response, next: NextFunction): void {
            Promise.resolve(fn(req, res, next)).catch(next);
        },
    };

    return r[name];
}
