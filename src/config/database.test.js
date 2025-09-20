import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:', {
  dialect: 'sqlite',
  logging: false,
  define: {
    timestamps: true
  }
});

export default sequelize;
