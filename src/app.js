import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import teamRoutes from './routes/teamRoutes.js'
import playerRoutes from './routes/playerRoutes.js'
import classRoutes from './routes/classRoutes.js'
import championshipRoutes from './routes/championshipRoutes.js'
import matchRoutes from './routes/matchRoutes.js'
import authRoutes from './routes/authRoutes.js'
import reportsRoutes from './routes/reportsRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import './models/associations.js'

// Carrega as variáveis de ambiente
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

// Configuração de CORS - permite múltiplas origens
const allowedOrigins = [
  'http://localhost:3000',
  'https://ifma-campeonatos.vercel.app',
  'https://www.preifma.site'
];

// Adiciona FRONTEND_URL se estiver definida e não vazia
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim() !== '') {
  if (!allowedOrigins.includes(process.env.FRONTEND_URL)) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Em desenvolvimento, aceita localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Em produção, verifica se a origin está na lista
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Campeonatos API Docs'
}));

// Log para debug
console.log('CORS configurado para origens:', allowedOrigins);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'não definida');
console.log('Swagger disponível em: http://localhost:4000/api-docs');

// Rotas públicas (SEM autenticação)
app.use('/public', publicRoutes)

// Rotas de autenticação
app.use('/auth', authRoutes)

// Rotas de recursos
app.use('/teams', teamRoutes)
app.use('/players', playerRoutes)
app.use('/classes', classRoutes)
app.use('/championships', championshipRoutes)
app.use('/matches', matchRoutes)
app.use('/reports', reportsRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
