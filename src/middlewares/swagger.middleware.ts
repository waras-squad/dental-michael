import { swagger } from '@elysiajs/swagger';

export const swaggerConfig = swagger({
  provider: 'swagger-ui',
  documentation: {
    tags: [
      {
        name: 'Admin - Patient',
        description: 'Endpoints for admins to interact with patients data',
      },
      {
        name: 'Admin - Doctor',
        description: 'Endpoints for admins to interact with doctors data',
      },
      { name: 'Auth', description: 'Authentication endpoints' },
      {
        name: 'Doctor Profile',
        description: 'Endpoints for Doctors to interact with their own profile',
      },
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
        DoctorAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT for doctor',
        },
      },
    },
  },
  swaggerOptions: {
    persistAuthorization: true,
    operationsSorter: 'method',
  },
});
