import type { NextFunction, Request, RequestHandler, Response } from 'express';

export default function asyncWrapperMiddleware(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
