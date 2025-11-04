import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playDay: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'matches',
  timestamps: true
});

export default Match;
