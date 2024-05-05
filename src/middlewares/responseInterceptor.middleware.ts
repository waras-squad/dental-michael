import Elysia from 'elysia';

export const responseInterceptor = (app: Elysia) =>
  app.onAfterHandle(({ response, set }) => {
    console.log(response);
    if (typeof response === 'string') {
      set.status = 201;
      response = {
        status: 201,
        message: response,
      };
    } else {
      set.status = 200;
      response = {
        status: 200,
        data: response,
      };
    }
    return response;
  });
