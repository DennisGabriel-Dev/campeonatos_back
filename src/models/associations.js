import Team from './team.js';
import Player from './player.js';
import Class from './class.js';
import User from './user.js';
import sequelize from '../config/database.js';

// Relacionamentos Team <-> Player
Team.hasMany(Player, {
  foreignKey: 'teamId',
  as: 'players'
});

Player.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});

// Relacionamentos Class <-> Player
Class.hasMany(Player, {
  foreignKey: 'classId',
  as: 'players'
});

Player.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});

// Sincronizar as tabelas na ordem correta
const syncDatabase = async () => {
  try {
    // Primeiro sincroniza as tabelas independentes
    await User.sync();
    await Team.sync();
    await Class.sync();
    
    // Depois sincroniza a tabela que depende das outras
    await Player.sync();
    
    console.log('Todas as tabelas foram sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  }
};

// Executar a sincronização
syncDatabase();

export { User, Team, Player, Class };
