import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MatchTeam = sequelize.define('MatchTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teamId: {
    type: DataTypes.INTEGER
  },
  goalsTeam: {
    type: DataTypes.INTEGER
  },
  pointsTeam: {}
}, {
  tableName: 'match_teams',
  timestamps: true
});

export default MatchTeam;
