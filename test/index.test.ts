import { describe, it } from 'node:test';
import request from 'supertest';
import express, { Application, NextFunction, Request, RequestHandler, Response } from 'express';
import wrapper, { AsyncRequestHandler } from '../lib';

function buildServer(fn: RequestHandler | AsyncRequestHandler): Application {
    const server = express();
    server.use(wrapper(fn));
    server.use((req: Request, res: Response): unknown => res.json({ status: 200 }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server.use((err: Error | null, _req: Request, res: Response, next: NextFunction): unknown =>
        res.status(500).json({ name: err?.name, message: err?.message }),
    );
    return server;
}

function syncHandler(_req: Request, res: Response): void {
    res.status(204).send();
}

function normalHandler(_req: Request, res: Response): Promise<void> {
    return new Promise<void>((resolve): void => {
        res.status(200).json({});
        resolve();
    });
}

function rejectingHandler(): Promise<void> {
    return Promise.reject(new Error('Rejecting promise'));
}

function throwingHandler(): Promise<void> {
    return new Promise<void>((): void => {
        throw new Error('All fired up');
    });
}

void describe('Middleware', async () => {
    await it('should be able to handle syncHandler()', async () => {
        const server = buildServer(syncHandler);
        await request(server).get('/').expect(204);
    });

    await it('should be able to handle normalHandler()', async () => {
        const server = buildServer(normalHandler);
        await request(server).get('/').expect(200);
    });

    await it('should be able to handle rejectingHandler()', async () => {
        const server = buildServer(rejectingHandler);
        await request(server)
            .get('/')
            .expect(500)
            .expect(/Rejecting promise/u);
    });

    await it('should be able to handle throwingHandler()', async () => {
        const server = buildServer(throwingHandler);
        await request(server)
            .get('/')
            .expect(500)
            .expect(/All fired up/u);
    });
});
