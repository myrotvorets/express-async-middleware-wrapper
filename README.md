# express-async-middleware-wrapper

Express.js wrapper for async middleware to handle errors

# Usage

```typescript
import { Request, Response, Router } from 'express';
import wrapper from '@myrotvorets/express-async-wrapper-middleware';

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
