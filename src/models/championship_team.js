import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChampionshipTeam = sequelize.define('ChampionshipTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  championshipId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'championship_teams',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['championshipId', 'teamId']
    }
  ]
});

export default ChampionshipTeam;

