import Sequelize from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const env = process.env

if (!env.DATABASE_NAME || !env.DATABASE_USER || !env.DATABASE_PASSWORD || !env.DATABASE_HOST) {
  throw new Error('Missing required env var(s): DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST')
}

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USER, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  dialect: "postgres"
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((err) => {
  console.error('Unable to connect to the database: '+ err);
})

export default sequelize;