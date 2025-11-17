import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MatchTeam = sequelize.define('MatchTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  goalsTeam: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pointsTeam: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'match_teams',
  timestamps: true
});

export default MatchTeam;
