import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Championship = sequelize.define('Championship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2030
    }
  },
  modality: {
    type: DataTypes.ENUM('Futebol', 'Vôlei'),
    allowNull: false,
    defaultValue: 'Futebol',
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'championships',
  timestamps: true
});

export default Championship;
