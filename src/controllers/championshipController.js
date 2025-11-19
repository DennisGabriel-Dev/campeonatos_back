import Championship from "../models/championship.js";
import Team from "../models/team.js";
import ChampionshipTeam from "../models/championship_team.js";
import Match from "../models/match.js";
import MatchTeam from "../models/match_team.js";
import GenerateMatches from "../services/GenerateMatchesService.js";

const ChampionshipController = {
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
        ]
      });
      res.status(200).json(championships);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async createChampionShip(req, res) {
    try {
      const { name, year, modality } = req.body;

      if (!name || !year || !modality) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: name, year, modality' 
        });
      }

      if (!['Futebol', 'Vôlei'].includes(modality)) {
        return res.status(400).json({ 
          error: 'Modalidade deve ser "Futebol" ou "Vôlei"' 
        });
      }

      const newChamp = await Championship.create({ 
        name,
        year,
        modality
      });

      res.status(201).json(newChamp);
    } catch (error) {
      console.error('Erro ao criar campeonato:', error);
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(err => err.message) 
        });
      } else if (error.name === 'SequelizeDatabaseError') {
        res.status(500).json({ 
          error: 'Erro no banco de dados', 
          details: error.message,
          hint: 'Verifique se a estrutura da tabela está atualizada. Execute a sincronização do banco.'
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor', 
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  },

  async getChampionshipById(req, res) {
    try {
      const { id } = req.params;
      const champItem = await Championship.findByPk(id, {
        include: [
          {
            model: Team,
            as: 'teams',
            attributes: ['id', 'name', 'modality'],
            through: { attributes: [] }
          }
        ]
      });

      if (champItem) {
        res.status(200).json(champItem);
      } else {
        res.status(404).json({ error: 'Campeonato não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async updateChampionship(req, res) {
    try {
      const { id } = req.params;
      const { name, year, modality } = req.body;
      
      const champItem = await Championship.findByPk(id);
      if (!champItem) {
        return res.status(404).json({ error: 'Campeonato não encontrado' });
      }

      // Validar modalidade se fornecida
      if (modality !== undefined && !['Futebol', 'Vôlei'].includes(modality)) {
        return res.status(400).json({ 
          error: 'Modalidade deve ser "Futebol" ou "Vôlei"' 
        });
      }

      // Atualiza apenas os campos fornecidos
      const updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (year !== undefined) updatedData.year = year;
      if (modality !== undefined) updatedData.modality = modality;

      await champItem.update(updatedData);
      
      const updatedChamp = await Championship.findByPk(id, {
        include: [
          {
            model: Team,
            as: 'teams',
            attributes: ['id', 'name', 'modality'],
            through: { attributes: [] }
          }
        ]
      });
      res.status(200).json(updatedChamp);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(err => err.message) 
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor', 
          details: error.message 
        });
      }
    }
  },

  async deleteChampionship(req, res) {
    try {
      const { id } = req.params;
      const champItem = await Championship.findByPk(id);
      
      if (champItem) {
        await champItem.destroy();
        res.status(200).json({ 
          message: 'Campeonato deletado com sucesso!'
        });
      } else {
        res.status(404).json({ error: 'Campeonato não encontrado!' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async generateMatches(req, res) {
    try {
      const { id } = req.params;
      const champItem = await Championship.findByPk(id);
      const { teamIds } = req.body ?? {};

      if (champItem == null) {
        return res.status(404).json({ error: 'Campeonato não encontrado!' });
      }

      const response = await GenerateMatches({
        championship: champItem,
        teamIds
      });

      if (!response) {
        return res.status(500).json({
          error: 'Erro ao processar geração de partidas'
        });
      }

      // Salvar relacionamento times-campeonato
      if (teamIds && Array.isArray(teamIds) && teamIds.length > 0) {
        const normalizedTeamIds = [...new Set(teamIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0))];
        for (const teamId of normalizedTeamIds) {
          await ChampionshipTeam.findOrCreate({
            where: {
              championshipId: champItem.id,
              teamId: teamId
            }
          });
        }
      }

      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async getChampionshipTeams(req, res) {
    try {
      const { id } = req.params;
      const championship = await Championship.findByPk(id);
      
      if (!championship) {
        return res.status(404).json({ error: 'Campeonato não encontrado' });
      }

      const teams = await championship.getTeams({
        attributes: ['id', 'name', 'modality']
      });

      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async addTeamToChampionship(req, res) {
    try {
      const { id } = req.params;
      const { teamId } = req.body;

      if (!teamId) {
        return res.status(400).json({ error: 'teamId é obrigatório' });
      }

      const championship = await Championship.findByPk(id);
      if (!championship) {
        return res.status(404).json({ error: 'Campeonato não encontrado' });
      }

      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Time não encontrado' });
      }

      const [championshipTeam, created] = await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: id,
          teamId: teamId
        }
      });

      if (!created) {
        return res.status(409).json({ error: 'Time já está associado a este campeonato' });
      }

      res.status(201).json({
        message: 'Time adicionado ao campeonato com sucesso',
        championshipTeam
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async removeTeamFromChampionship(req, res) {
    try {
      const { id, teamId } = req.params;

      const championshipTeam = await ChampionshipTeam.findOne({
        where: {
          championshipId: id,
          teamId: teamId
        }
      });

      if (!championshipTeam) {
        return res.status(404).json({ error: 'Time não encontrado neste campeonato' });
      }

      await championshipTeam.destroy();

      res.status(200).json({ message: 'Time removido do campeonato com sucesso' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

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
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  }
};

export default ChampionshipController;
