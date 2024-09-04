# express-async-middleware-wrapper

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myrotvorets_express-async-middleware-wrapper&metric=alert_status)](https://sonarcloud.io/dashboard?id=myrotvorets_express-async-middleware-wrapper)
[![Build and Test](https://github.com/myrotvorets/express-async-middleware-wrapper/actions/workflows/build.yml/badge.svg)](https://github.com/myrotvorets/express-async-middleware-wrapper/actions/workflows/build.yml)

Wrapper for Express.js async middleware to handle rejected promises and synchronous exceptions.

This library is similar to [express-async-handler](https://www.npmjs.com/package/express-async-handler) but is written in TypeScript, and its typings handle more cases than those of `express-async-handler` (for example, it can deal with the changes introduced in [DefinitelyTyped/DefinitelyTyped#49677](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49677))

# Usage

```typescript
import { Request, Response, Router } from 'express';
import wrapper from '@myrotvorets/express-async-middleware-wrapper';

async function handler(req: Request, res: Response): Promise<void> {
    const someAsyncResult = await someAsyncAction();
    res.json(someAsyncResult);
}

const router = Router();
router.get('/some-path', wrapper(handler));
```

# What it Does

It provides error handling for asynchronous middleware by catching rejected promises and synchronous exceptions from handler's code.

This wrapper simplfies development by eliminating the need to write boilerplate code for asynchronous handlers.
