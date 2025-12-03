import Match from "../models/match.js";
import MatchTeam from "../models/match_team.js";
import Championship from "../models/championship.js";
import Team from "../models/team.js";
import Player from "../models/player.js";

const ReportsService = {
  /**
   * Obtém resultados das partidas de um campeonato (Time A x Time B)
   * @param {number} championshipId - ID do campeonato
   * @returns {Promise<Array>} Array com resultados das partidas
   */
  async getMatchResults(championshipId) {
    try {
      const championship = await Championship.findByPk(championshipId);
      if (!championship) {
        return { success: false, message: 'Campeonato não encontrado' };
      }

      const matches = await Match.findAll({
        where: { championshipId },
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
            ],
            order: [['id', 'ASC']]
          }
        ],
        order: [['playDay', 'DESC'], ['createdAt', 'DESC']]
      });

      const results = matches.map(match => {
        const teams = match.matchTeams || [];
        const teamA = teams[0];
        const teamB = teams[1];

        return {
          matchId: match.id,
          date: match.playDay ? new Date(match.playDay).toLocaleDateString('pt-BR') : 'Não agendada',
          status: this.getStatusLabel(match.status),
          teamA: {
            name: teamA?.team?.name || 'N/A',
            goals: teamA?.goalsTeam || 0,
            points: teamA?.pointsTeam || 0
          },
          teamB: {
            name: teamB?.team?.name || 'N/A',
            goals: teamB?.goalsTeam || 0,
            points: teamB?.pointsTeam || 0
          },
          result: this.formatResult(teamA, teamB)
        };
      });

      return { success: true, data: results };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar resultados', error: error.message };
    }
  },

  /**
   * Obtém os campeões de um campeonato (1º, 2º e 3º lugares)
   * @param {number} championshipId - ID do campeonato
   * @returns {Promise<Object>} Objeto com campeões e estatísticas
   */
  async getChampions(championshipId) {
    try {
      const championship = await Championship.findByPk(championshipId);
      if (!championship) {
        return { success: false, message: 'Campeonato não encontrado' };
      }

      // Buscar todas as partidas finalizadas
      const matches = await Match.findAll({
        where: {
          championshipId,
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

      const isFinished = matches.length > 0 && ranking.length >= 3;

      return {
        success: true,
        data: {
          championship: {
            id: championship.id,
            name: championship.name,
            year: championship.year,
            modality: championship.modality,
            isFinished
          },
          champion: ranking[0] || null,
          runnerUp: ranking[1] || null,
          thirdPlace: ranking[2] || null,
          totalTeams: ranking.length,
          totalMatches: matches.length
        }
      };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar campeões', error: error.message };
    }
  },

  /**
   * Conta jogadores por modalidade
   * @returns {Promise<Object>} Objeto com quantidade de jogadores por modalidade
   */
  async getPlayersByModality() {
    try {
      const players = await Player.findAll({
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          }
        ]
      });

      const modalityStats = {};
      const playersByTeam = {};

      players.forEach(player => {
        const team = player.team;
        if (!team || !team.modality) return;

        const modality = team.modality;

        // Contar por modalidade
        if (!modalityStats[modality]) {
          modalityStats[modality] = {
            modality,
            totalPlayers: 0,
            teams: new Set()
          };
        }

        modalityStats[modality].totalPlayers += 1;
        if (team.id) {
          modalityStats[modality].teams.add(team.id);
        }

        // Contar por time
        const teamKey = `${team.id}-${team.name}`;
        if (!playersByTeam[teamKey]) {
          playersByTeam[teamKey] = {
            teamId: team.id,
            teamName: team.name,
            modality: team.modality,
            playerCount: 0
          };
        }
        playersByTeam[teamKey].playerCount += 1;
      });

      const result = Object.values(modalityStats).map(stat => ({
        modality: stat.modality,
        totalPlayers: stat.totalPlayers,
        totalTeams: stat.teams.size
      }));

      const teamDetails = Object.values(playersByTeam).sort((a, b) => {
        if (a.modality !== b.modality) {
          return a.modality.localeCompare(b.modality);
        }
        return b.playerCount - a.playerCount;
      });

      return {
        success: true,
        data: {
          byModality: result,
          byTeam: teamDetails
        }
      };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar jogadores por modalidade', error: error.message };
    }
  },

  /**
   * Obtém os melhores times de uma competição com critérios de desempate
   * @param {number} championshipId - ID do campeonato
   * @param {number} limit - Número de times a retornar (padrão: 5)
   * @returns {Promise<Object>} Ranking completo com critérios de desempate
   */
  async getTopTeams(championshipId, limit = 5) {
    try {
      const championship = await Championship.findByPk(championshipId);
      if (!championship) {
        return { success: false, message: 'Campeonato não encontrado' };
      }

      // Buscar todas as partidas finalizadas
      const matches = await Match.findAll({
        where: {
          championshipId,
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

      // Converter para array e ordenar com critérios de desempate
      const ranking = Object.values(teamStats)
        .map(stats => ({
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst,
          matchesPlayed: stats.wins + stats.draws + stats.losses,
          winRate: stats.matchesPlayed > 0 
            ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(2) 
            : '0.00'
        }))
        .sort((a, b) => {
          // 1. Por pontos (descendente)
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          // 2. Por saldo de gols (descendente)
          if (b.goalDifference !== a.goalDifference) {
            return b.goalDifference - a.goalDifference;
          }
          // 3. Por gols marcados (descendente)
          if (b.goalsFor !== a.goalsFor) {
            return b.goalsFor - a.goalsFor;
          }
          // 4. Por número de vitórias (descendente)
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          }
          // 5. Por menor número de derrotas (ascendente)
          return a.losses - b.losses;
        })
        .map((stats, index) => ({
          position: index + 1,
          ...stats
        }));

      const topTeams = ranking.slice(0, limit);

      return {
        success: true,
        data: {
          championship: {
            id: championship.id,
            name: championship.name,
            year: championship.year,
            modality: championship.modality
          },
          ranking: topTeams,
          totalTeams: ranking.length,
          totalMatches: matches.length
        }
      };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar melhores times', error: error.message };
    }
  },

  /**
   * Funções auxiliares
   */
  getStatusLabel(status) {
    const statusMap = {
      0: 'Agendada',
      1: 'Em andamento',
      2: 'Finalizada'
    };
    return statusMap[status] || 'Desconhecido';
  },

  formatResult(teamA, teamB) {
    if (!teamA || !teamB) return 'Não disponível';
    
    const goalsA = teamA.goalsTeam || 0;
    const goalsB = teamB.goalsTeam || 0;

    if (goalsA > goalsB) {
      return `${teamA.team?.name || 'Time A'} venceu`;
    } else if (goalsB > goalsA) {
      return `${teamB.team?.name || 'Time B'} venceu`;
    } else {
      return 'Empate';
    }
  }
};

export default ReportsService;

