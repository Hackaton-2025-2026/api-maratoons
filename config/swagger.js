const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Marathon Documentation',
      version: '1.0.0',
      description: 'API REST pour les paris sur les marathons',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local',
      },
      {
        url: 'https://api-maratoons.vercel.app',
        description: 'Serveur Vercel (production)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/users/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur',
            },
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mot de passe (hashé)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour',
            },
          },
        },
        Bet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique du pari',
            },
            runnerId: {
              type: 'string',
              description: 'ID du coureur',
            },
            raceId: {
              type: 'string',
              description: 'ID de la course',
            },
            amount: {
              type: 'number',
              description: 'Montant misé',
            },
            userId: {
              type: 'string',
              description: 'ID de l\'utilisateur',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour',
            },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique du groupe',
            },
            name: {
              type: 'string',
              description: 'Nom du groupe',
            },
            description: {
              type: 'string',
              description: 'Description du groupe',
            },
            code: {
              type: 'string',
              description: 'Code d\'invitation unique',
            },
            createdBy: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur',
            },
            members: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Liste des IDs des membres',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/**/*.js'], // Paths des fichiers contenant les annotations Swagger
};

const specs = swaggerJsdoc(options);
module.exports = specs;

