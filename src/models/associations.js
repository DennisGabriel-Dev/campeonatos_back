import Team from './team.js';
import Player from './player.js';
import Class from './class.js';
import User from './user.js';
import Championship from './championship.js';
import Match from './match.js';
import MatchTeam from './match_team.js';
import ChampionshipTeam from './championship_team.js';

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

// Relacionamentos Championship <-> Match
Championship.hasMany(Match, {
  foreignKey: 'championshipId',
  as: 'matches'
});

Match.belongsTo(Championship, {
  foreignKey: 'championshipId',
  as: 'championship'
});

// Relacionamentos Match <-> MatchTeam
Match.hasMany(MatchTeam, {
  foreignKey: 'matchId',
  as: 'matchTeams'
});

MatchTeam.belongsTo(Match, {
  foreignKey: 'matchId',
  as: 'match'
});

// Relacionamento Team <-> MatchTeam
Team.hasMany(MatchTeam, {
  foreignKey: 'teamId',
  as: 'matchAppearances'
});

MatchTeam.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});

// Relacionamentos Championship <-> Team (many-to-many)
Championship.belongsToMany(Team, {
  through: ChampionshipTeam,
  foreignKey: 'championshipId',
  otherKey: 'teamId',
  as: 'teams'
});

Team.belongsToMany(Championship, {
  through: ChampionshipTeam,
  foreignKey: 'teamId',
  otherKey: 'championshipId',
  as: 'championships'
});

ChampionshipTeam.belongsTo(Championship, {
  foreignKey: 'championshipId',
  as: 'championship'
});

ChampionshipTeam.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
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

    await Championship.sync();
    await Match.sync();
    await MatchTeam.sync();
    await ChampionshipTeam.sync();
    
    console.log('Todas as tabelas foram sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  }
};

// Executar a sincronização
syncDatabase();

export { User, Team, Player, Class, Championship, Match, MatchTeam, ChampionshipTeam };
