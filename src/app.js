import express from 'express'
import cors from 'cors'
import teamRoutes from './routes/teamRoutes.js'
import playerRoutes from './routes/playerRoutes.js'
import classRoutes from './routes/classRoutes.js'
import championshipRoutes from './routes/championshipRoutes.js'
import './models/associations.js'

const app = express()
const port = process.env.PORT 

app.use(express.json())

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // permite o frontend acessar o back
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // métodos liberados
  credentials: true // se quiser enviar cookies/autenticação
}));

app.use('/teams', teamRoutes)
app.use('/players', playerRoutes)
app.use('/classes', classRoutes)
app.use('/championships', championshipRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
