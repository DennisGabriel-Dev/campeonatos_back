import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  championshipId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  playDay: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.INTEGER
  },
  round: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bracketOrder: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isKnockout: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'matches',
  timestamps: true
});

export default Match;
