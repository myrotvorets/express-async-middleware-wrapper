/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

type RequestHandlerParams<R, Res, Req, Query, Locals extends Record<string, any>> = Parameters<
    RequestHandler<R, Res, Req, Query, Locals>
>;

export type AsyncRequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = Record<string, any>,
> = (...args: RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals>) => Promise<void>;

export function asyncWrapperMiddleware<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = Record<string, any>,
>(
    fn:
        | RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
        | AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
    const name = `async wrapper for ${fn.name}`;
    const r = {
        [name]: function (
            req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
            res: Response<ResBody, Locals>,
            next: NextFunction,
        ): void {
            Promise.resolve(fn(req, res, next)).catch((e: unknown) => setImmediate<unknown[]>(next, e));
        },
    };

    return r[name]!;
}

export default asyncWrapperMiddleware;
