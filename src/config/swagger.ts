import swaggerJsdoc from 'swagger-jsdoc';
import { resolve } from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanora Server API',
      version: '1.0.0',
      description: 'RESTful API for managing music collections',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'API Support',
        url: 'https://github.com/eightythreeapps/kanora-server',
      },
    },
    servers: [
      {
        url: process.env.API_PREFIX || '/api/v1',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    resolve(__dirname, '../routes/*.ts'),
    resolve(__dirname, '../controllers/*.ts')
  ],
};

export const swaggerSpec = swaggerJsdoc(options); 