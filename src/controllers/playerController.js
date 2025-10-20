import Player from "../models/player.js";
import Team from "../models/team.js";
import Class from "../models/class.js";

const PlayerController = {
  async getPlayers(req, res) {
    try {
      const players = await Player.findAll({
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          },
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'course', 'year', 'semester']
          }
        ]
      });
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async createPlayer(req, res) {
    try {
      const { name, age, classId, teamId } = req.body;
      
      // Validação básica
      if (!name || !age || !classId) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: name, age, classId' 
        });
      }

      // Verifica se a turma existe
      const classExists = await Class.findByPk(classId);
      if (!classExists) {
        return res.status(404).json({ 
          error: 'Turma não encontrada' 
        });
      }

      // Verifica se o team existe (se fornecido)
      if (teamId) {
        const team = await Team.findByPk(teamId);
        if (!team) {
          return res.status(404).json({ 
            error: 'Time não encontrado' 
          });
        }
      }

      const newPlayer = await Player.create({ 
        name, 
        age, 
        classId,
        teamId 
      });
      
      res.status(201).json(newPlayer);
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

  async getPlayerById(req, res) {
    try {
      const { id } = req.params;
      const player = await Player.findByPk(id, {
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          },
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'course', 'year', 'semester']
          }
        ]
      });
      
      if (player) {
        res.status(200).json(player);
      } else {
        res.status(404).json({ error: 'Jogador não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async updatePlayer(req, res) {
    try {
      const { id } = req.params;
      const { name, age, classId, teamId } = req.body;
      
      const player = await Player.findByPk(id);
      if (!player) {
        return res.status(404).json({ error: 'Jogador não encontrado' });
      }

      // Verifica se a turma existe (se fornecida)
      if (classId) {
        const classExists = await Class.findByPk(classId);
        if (!classExists) {
          return res.status(404).json({ 
            error: 'Turma não encontrada' 
          });
        }
      }

      // Verifica se o team existe (se fornecido)
      if (teamId) {
        const team = await Team.findByPk(teamId);
        if (!team) {
          return res.status(404).json({ 
            error: 'Time não encontrado' 
          });
        }
      }

      // Atualiza apenas os campos fornecidos
      const updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (age !== undefined) updatedData.age = age;
      if (classId !== undefined) updatedData.classId = classId;
      if (teamId !== undefined) updatedData.teamId = teamId;

      await player.update(updatedData);
      
      const updatedPlayer = await Player.findByPk(id, {
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          },
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'course', 'year', 'semester']
          }
        ]
      });
      
      res.status(200).json(updatedPlayer);
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

  async deletePlayer(req, res) {
    try {
      const { id } = req.params;
      const player = await Player.findByPk(id);
      
      if (player) {
        await player.destroy();
        res.status(200).json({ 
          message: 'Jogador deletado com sucesso' 
        });
      } else {
        res.status(404).json({ error: 'Jogador não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async getPlayersByTeam(req, res) {
    try {
      const { teamId } = req.params;
      
      // Verifica se o team existe
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ 
          error: 'Time não encontrado' 
        });
      }

      const players = await Player.findAll({
        where: { teamId },
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          },
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'course', 'year', 'semester']
          }
        ]
      });
      
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async getPlayersByClass(req, res) {
    try {
      const { classId } = req.params;
      
      // Verifica se a turma existe
      const classExists = await Class.findByPk(classId);
      if (!classExists) {
        return res.status(404).json({ 
          error: 'Turma não encontrada' 
        });
      }

      const players = await Player.findAll({
        where: { classId },
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name', 'modality']
          },
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'course', 'year', 'semester']
          }
        ]
      });
      
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  }
};

export default PlayerController;
