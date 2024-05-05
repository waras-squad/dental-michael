import { Elysia, error } from 'elysia';
import { cors } from '@elysiajs/cors';

import { adminRoutes, authRoutes } from './routes';
import { swaggerConfig, responseInterceptor } from './middlewares';

const app = new Elysia();

app
  .use(cors())
  .use(swaggerConfig)
  .use(responseInterceptor)
  .onError(({ code, error: errorObject }) => {
    if (code === 'VALIDATION') {
      console.error(errorObject.message);
      return error(errorObject.status, {
        status: errorObject.status,
        message: errorObject.message,
      });
    }
  })
  .group('/api', (app) => {
    return app.use(adminRoutes).use(authRoutes);
  })
  .listen(Bun.env.port || 1000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
