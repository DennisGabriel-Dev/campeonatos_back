import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modality: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Team;