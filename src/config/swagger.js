import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campeonatos API',
      version: '1.0.0',
      description: 'API para gerenciar campeonatos desportivos (Futebol e Vôlei)',
      contact: {
        name: 'Campeonatos Team',
        email: 'contato@campeonatos.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://www.preifma.site',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com'
            },
            password: {
              type: 'string',
              format: 'password'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'admin'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Championship: {
          type: 'object',
          required: ['name', 'year', 'modality'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Campeonato 2026'
            },
            year: {
              type: 'integer',
              example: 2026
            },
            modality: {
              type: 'string',
              enum: ['Futebol', 'Vôlei'],
              example: 'Futebol'
            },
            format: {
              type: 'string',
              enum: ['round-robin', 'knockout'],
              example: 'round-robin'
            },
            teams: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Team'
              }
            }
          }
        },
        Team: {
          type: 'object',
          required: ['name', 'modality'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Flamengo'
            },
            modality: {
              type: 'string',
              example: 'Futebol'
            }
          }
        },
        Player: {
          type: 'object',
          required: ['name', 'age', 'classId'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Neymar'
            },
            age: {
              type: 'integer',
              example: 32
            },
            classId: {
              type: 'integer',
              example: 1
            },
            teamId: {
              type: 'integer',
              example: 1
            }
          }
        },
        Match: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            championshipId: {
              type: 'integer',
              example: 1
            },
            playDay: {
              type: 'string',
              format: 'date-time'
            },
            status: {
              type: 'integer',
              enum: [0, 1, 2],
              description: '0: Não iniciada, 1: Em andamento, 2: Finalizada'
            },
            matchTeams: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  teamId: {
                    type: 'integer'
                  },
                  goalsTeam: {
                    type: 'integer'
                  },
                  pointsTeam: {
                    type: 'integer'
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            details: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
