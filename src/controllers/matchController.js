import Match from "../models/match.js";
import Championship from "../models/championship.js";
import MatchTeam from "../models/match_team.js";
import Team from "../models/team.js";

const MatchController = {
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
            attributes: ['id', 'name', 'year']
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
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async createMatch(req, res) {
    const { playDay, status } = req.body;
    const newMatch = await Match.create({ playDay, status });
    res.send(JSON.stringify(newMatch));
  },

  async getMatchById(req, res) {
    try {
      const { id } = req.params;
      const match = await Match.findByPk(id, {
        include: [
          {
            model: Championship,
            as: 'championship',
            attributes: ['id', 'name', 'year']
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
            ]
          }
        ]
      });

      if (match) {
        res.status(200).json(match);
      } else {
        res.status(404).json({ error: 'Partida não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async updateMatch(req, res) {
    const { id } = req.params;
    const { playDay, status }= req.body;
    const match = await Match.findByPk(id);
    if (match) {
      match.name = playDay || match.name;
      match.status = status || match.status;
      await match.save();
      res.send(JSON.stringify(match));
    } else {
      res.status(404).send({ error: 'Team not found' });
    }
  },

  async deleteMatch(req, res) {
    try {
      const { id } = req.params;
      const match = await Match.findByPk(id);
      if (match) {
        await match.destroy();
        res.status(200).json({ message: 'Partida deletada com sucesso' });
      } else {
        res.status(404).json({ error: 'Partida não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async registerResult(req, res) {
    try {
      const { id } = req.params;
      const { results, playDay } = req.body;

      // Validar entrada
      if (!Array.isArray(results) || results.length !== 2) {
        return res.status(400).json({
          error: 'É necessário informar os resultados de exatamente 2 times',
          details: 'Envie um array com 2 objetos: [{ teamId: 1, goals: 2 }, { teamId: 2, goals: 1 }]'
        });
      }

      // Buscar a partida com os times
      const match = await Match.findByPk(id, {
        include: [
          {
            model: MatchTeam,
            as: 'matchTeams',
            include: [
              {
                model: Team,
                as: 'team',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' });
      }

      if (match.matchTeams.length !== 2) {
        return res.status(400).json({
          error: 'A partida deve ter exatamente 2 times'
        });
      }

      // Validar que os teamIds informados correspondem aos times da partida
      const matchTeamIds = match.matchTeams.map(mt => mt.teamId);
      const resultTeamIds = results.map(r => r.teamId);

      const allTeamsMatch = resultTeamIds.every(teamId => matchTeamIds.includes(teamId));
      if (!allTeamsMatch || resultTeamIds.length !== new Set(resultTeamIds).size) {
        return res.status(400).json({
          error: 'Os teamIds informados não correspondem aos times desta partida',
          details: `Times da partida: ${matchTeamIds.join(', ')}`
        });
      }

      // Validar que os gols são números não negativos
      for (const result of results) {
        if (typeof result.goals !== 'number' || result.goals < 0 || !Number.isInteger(result.goals)) {
          return res.status(400).json({
            error: 'Os gols devem ser números inteiros não negativos'
          });
        }
      }

      // Atualizar os resultados
      for (const result of results) {
        const matchTeam = match.matchTeams.find(mt => mt.teamId === result.teamId);
        if (matchTeam) {
          matchTeam.goalsTeam = result.goals;
          await matchTeam.save();
        }
      }

      // Atualizar status da partida (1 = finalizada)
      match.status = 1;
      if (playDay) {
        match.playDay = new Date(playDay);
      } else if (!match.playDay) {
        match.playDay = new Date();
      }
      await match.save();

      // Buscar a partida atualizada para retornar
      const updatedMatch = await Match.findByPk(id, {
        include: [
          {
            model: Championship,
            as: 'championship',
            attributes: ['id', 'name', 'year']
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
            ]
          }
        ]
      });

      res.status(200).json({
        message: 'Resultado registrado com sucesso',
        match: updatedMatch
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  }
};

export default MatchController;