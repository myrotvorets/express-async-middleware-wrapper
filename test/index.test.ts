import request from 'supertest';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import wrapper, { AsyncRequestHandler } from '../lib';

function buildServer(fn: RequestHandler | AsyncRequestHandler): express.Application {
    const server = express();
    server.use(wrapper(fn));
    server.use((req: Request, res: Response): unknown => res.json({ status: 200 }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server.use((err: Error | null, req: Request, res: Response, next: NextFunction): unknown =>
        res.status(500).json({ name: err?.name, message: err?.message }),
    );
    return server;
}

function syncHandler(req: Request, res: Response): void {
    res.status(204).send();
}

function normalHandler(req: Request, res: Response): Promise<void> {
    return new Promise<void>((resolve): void => {
        res.status(200).json({});
        resolve();
    });
}

function rejectingHandler(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
        reject(new Error('Rejecting promise'));
    });
}

function throwingHandler(): Promise<void> {
    return new Promise<void>((): void => {
        throw new Error('All fired up');
    });
}

describe('Middleware', (): void => {
    it('should be able to handle syncHandler()', (): Promise<unknown> => {
        const server = buildServer(syncHandler);
        return request(server).get('/').expect(204);
    });

    it('should be able to handle normalHandler()', (): Promise<unknown> => {
        const server = buildServer(normalHandler);
        return request(server).get('/').expect(200);
    });

    it('should be able to handle rejectingHandler()', (): Promise<unknown> => {
        const server = buildServer(rejectingHandler);
        return request(server)
            .get('/')
            .expect(500)
            .expect(/Rejecting promise/u);
    });

    it('should be able to handle throwingHandler()', (): Promise<unknown> => {
        const server = buildServer(throwingHandler);
        return request(server)
            .get('/')
            .expect(500)
            .expect(/All fired up/u);
    });
});
