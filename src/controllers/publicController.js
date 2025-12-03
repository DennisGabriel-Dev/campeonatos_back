import Championship from "../models/championship.js";
import Match from "../models/match.js";
import MatchTeam from "../models/match_team.js";
import Team from "../models/team.js";

const PublicController = {
  /**
   * GET /public/championships
   * Lista todos os campeonatos (público, sem autenticação)
   */
  async getChampionships(req, res) {
    try {
      const championships = await Championship.findAll({
        include: [
          {
            model: Team,
            as: 'teams',
            attributes: ['id', 'name', 'modality'],
            through: { attributes: [] }
          }
        ],
        order: [['year', 'DESC'], ['name', 'ASC']]
      });
      
      // Remover dados sensíveis se houver
      const publicChampionships = championships.map(champ => ({
        id: champ.id,
        name: champ.name,
        year: champ.year,
        modality: champ.modality,
        createdAt: champ.createdAt,
        updatedAt: champ.updatedAt
      }));

      res.status(200).json(publicChampionships);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar campeonatos',
        details: error.message
      });
    }
  },

  /**
   * GET /public/matches
   * Lista todas as partidas (público, sem autenticação)
   * Query params: championshipId (opcional)
   */
  async getMatches(req, res) {
    try {
      const { championshipId } = req.query;

      const where = {};
      if (championshipId) {
        where.championshipId = championshipId;
      }

      const matches = await Match.findAll({
        where,
        include: [
          {
            model: Championship,
            as: 'championship',
            attributes: ['id', 'name', 'year', 'modality']
          },
          {
            model: MatchTeam,
            as: 'matchTeams',
            include: [
              {
                model: Team,
                as: 'team',
                attributes: ['id', 'name', 'modality']
              }
            ],
            order: [['id', 'ASC']]
          }
        ],
        order: [['playDay', 'DESC'], ['createdAt', 'DESC']]
      });

      // Formatar dados para o frontend
      const formattedMatches = matches.map(match => {
        const teams = match.matchTeams || [];
        const teamA = teams[0];
        const teamB = teams[1];

        // Formatar data como string ISO
        const dateValue = match.playDay || match.createdAt;
        const dateString = dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();

        return {
          id: match.id,
          championshipId: match.championshipId,
          championship: match.championship?.name || 'N/A',
          modality: match.championship?.modality || 'N/A',
          team1: teamA?.team?.name || 'N/A',
          team2: teamB?.team?.name || 'N/A',
          score1: teamA?.goalsTeam || 0,
          score2: teamB?.goalsTeam || 0,
          status: match.status || 0,
          date: dateString
        };
      });

      res.status(200).json(formattedMatches);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar partidas',
        details: error.message
      });
    }
  },

  /**
   * GET /public/championships/:id/ranking
   * Retorna ranking de um campeonato (público, sem autenticação)
   */
  async getRanking(req, res) {
    try {
      const { id } = req.params;
      const championship = await Championship.findByPk(id);
      
      if (!championship) {
        return res.status(404).json({ error: 'Campeonato não encontrado' });
      }

      // Buscar todas as partidas finalizadas do campeonato
      const matches = await Match.findAll({
        where: {
          championshipId: id,
          status: 2 // Finalizada
        },
        include: [
          {
            model: MatchTeam,
            as: 'matchTeams',
            include: [
              {
                model: Team,
                as: 'team',
                attributes: ['id', 'name', 'modality']
              }
            ]
          }
        ]
      });

      // Calcular estatísticas por time
      const teamStats = {};

      matches.forEach(match => {
        match.matchTeams.forEach(matchTeam => {
          const teamId = matchTeam.teamId;
          const team = matchTeam.team;
          
          if (!teamStats[teamId]) {
            teamStats[teamId] = {
              teamId: teamId,
              teamName: team.name,
              points: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              goalsFor: 0,
              goalsAgainst: 0
            };
          }

          const stats = teamStats[teamId];
          const goals = matchTeam.goalsTeam || 0;
          const points = matchTeam.pointsTeam || 0;

          stats.points += points;
          stats.goalsFor += goals;

          // Encontrar o time adversário
          const opponent = match.matchTeams.find(mt => mt.teamId !== teamId);
          if (opponent) {
            stats.goalsAgainst += opponent.goalsTeam || 0;
          }

          // Contar vitórias, empates e derrotas
          if (points === 3) {
            stats.wins += 1;
          } else if (points === 1) {
            stats.draws += 1;
          } else {
            stats.losses += 1;
          }
        });
      });

      // Converter para array e ordenar
      const ranking = Object.values(teamStats)
        .map(stats => ({
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst,
          matchesPlayed: stats.wins + stats.draws + stats.losses
        }))
        .sort((a, b) => {
          // Ordenar por pontos (descendente)
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          // Em caso de empate, ordenar por saldo de gols (descendente)
          if (b.goalDifference !== a.goalDifference) {
            return b.goalDifference - a.goalDifference;
          }
          // Em caso de empate, ordenar por gols marcados (descendente)
          return b.goalsFor - a.goalsFor;
        })
        .map((stats, index) => ({
          position: index + 1,
          ...stats
        }));

      res.status(200).json(ranking);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar ranking',
        details: error.message
      });
    }
  }
};

export default PublicController;

