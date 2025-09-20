import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
const env = process.env

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USER, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  dialect: env.DATABASE_DIALECT
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((err) => {
  console.error('Unable to connect to the database: '+ err);
})

export default sequelize;