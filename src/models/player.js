import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 16,
      max: 50
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'players',
  timestamps: true
});

export default Player;
