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
    await User.sync({ alter: true });
    await Team.sync({ alter: true });
    await Class.sync({ alter: true });
    
    // Depois sincroniza a tabela que depende das outras
    await Player.sync({ alter: true });

    // Migração especial para adicionar coluna modality
    const sequelize = Championship.sequelize;
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'championships' AND column_name = 'modality';
    `);
    
    if (results.length === 0) {
      // Coluna não existe, vamos adicionar
      console.log('Adicionando coluna modality à tabela championships...');
      
      // Primeiro criar o tipo ENUM se não existir
      await sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "public"."enum_championships_modality" AS ENUM('Futebol', 'Vôlei');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);
      
      // Adicionar coluna como nullable primeiro
      await sequelize.query(`
        ALTER TABLE championships 
        ADD COLUMN modality "public"."enum_championships_modality";
      `);
      
      // Atualizar registros existentes
      await sequelize.query(`
        UPDATE championships 
        SET modality = 'Futebol' 
        WHERE modality IS NULL;
      `);
      
      // Agora tornar NOT NULL
      await sequelize.query(`
        ALTER TABLE championships 
        ALTER COLUMN modality SET NOT NULL,
        ALTER COLUMN modality SET DEFAULT 'Futebol';
      `);
      
      console.log('Coluna modality adicionada com sucesso!');
    } else {
      // Coluna já existe, apenas sincronizar
      await Championship.sync({ alter: true });
      
      // Garantir que registros NULL tenham valor padrão
      await sequelize.query(`
        UPDATE championships 
        SET modality = 'Futebol' 
        WHERE modality IS NULL;
      `);
    }

    await Match.sync({ alter: true });
    await MatchTeam.sync({ alter: true });
    await ChampionshipTeam.sync({ alter: true });
    
    console.log('Todas as tabelas foram sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  }
};

// Executar a sincronização
syncDatabase();

export { User, Team, Player, Class, Championship, Match, MatchTeam, ChampionshipTeam };
