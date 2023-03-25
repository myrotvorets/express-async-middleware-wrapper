/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, RequestHandler, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import type core from 'express-serve-static-core';

type RequestHandlerParams<R, Res, Req, Query> = Parameters<RequestHandler<R, Res, Req, Query>>;

export type AsyncRequestHandler<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query> = (
    ...args: RequestHandlerParams<P, ResBody, ReqBody, ReqQuery>
) => Promise<void>;

export function asyncWrapperMiddleware<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query>(
    fn: RequestHandler<P, ResBody, ReqBody, ReqQuery> | AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
    const name = `async wrapper for ${fn.name}`;
    const r = {
        [name]: function (
            req: Request<P, ResBody, ReqBody, ReqQuery>,
            res: Response<ResBody>,
            next: NextFunction,
        ): void {
            Promise.resolve(fn(req, res, next)).catch((e: unknown) => setImmediate<unknown[]>(next, e));
        },
    };

    return r[name];
}

export default asyncWrapperMiddleware;
