import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { adminRoutes } from '@/routes/admin.route';

const app = new Elysia();

app
  .use(cors())
  .use(
    swagger({
      provider: 'swagger-ui',
    })
  )
  .onAfterHandle(({ response, set }) => {
    if (typeof response === 'string') {
      set.status = 201;
      response = {
        status: 200,
        message: response,
      };
    } else {
      response = {
        status: 200,
        data: response,
      };
    }
    return response;
  })
  .group('/api', (app) => app.use(adminRoutes))
  // .get(
  //   '/',
  //   () => {
  //     console.log('def');

  //     return [{ id: 1, name: 'dental-michael' }];
  //   },
  //   {
  //     detail: {
  //       summary: 'Hello Elysia',
  //     },
  //   }
  // )
  // .get(
  //   '/:id',
  //   ({ params }) => {
  //     const id = +params.id;
  //     return `data number ${id}`;
  //   },
  //   {
  //     detail: {
  //       parameters: [
  //         {
  //           in: 'path',
  //           name: 'id',
  //           schema: {
  //             type: 'integer',
  //           },
  //           example: 1,
  //         },
  //       ],
  //       summary: 'Get Data by Id',
  //     },
  //   }
  // )
  // .post('/', () => 'Hello Elysia Post')
  // .put('/', ({}) => {
  //   return customError(400, 'bad request error');
  // })
  .listen(Bun.env.port || 1000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
