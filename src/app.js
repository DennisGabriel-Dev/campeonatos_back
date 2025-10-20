import express from 'express'
import teamRoutes from './routes/teamRoutes.js'
import playerRoutes from './routes/playerRoutes.js'
import classRoutes from './routes/classRoutes.js'
import './models/associations.js'

const app = express()
const port = 3000

app.use(express.json())

app.use('/teams', teamRoutes)
app.use('/players', playerRoutes)
app.use('/classes', classRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
