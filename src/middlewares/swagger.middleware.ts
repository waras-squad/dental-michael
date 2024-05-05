import { swagger } from '@elysiajs/swagger';

export const swaggerConfig = swagger({
  provider: 'swagger-ui',
  documentation: {
    tags: [
      { name: 'Admin', description: 'Endpoints for admins' },
      { name: 'Auth', description: 'Authentication endpoints' },
    ],
    info: {
      title: 'Dental-michael Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        AdminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT for admin',
        },
      },
    },
  },
  swaggerOptions: {
    persistAuthorization: true,
  },
});
