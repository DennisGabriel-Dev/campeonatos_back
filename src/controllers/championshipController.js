import Championship from "../models/championship.js";
import GenerateMatches from "../services/GenerateMatchesService.js";

const ChampionshipController = {
  async getChampionships(req, res) {
    try {
      const championships = await Championship.findAll();
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
      const { name, year } = req.body;

      if (!name || !year) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: name, year' 
        });
      }

      const newChamp = await Championship.create({ 
        name,
        year
      });

      res.status(201).json(newChamp);
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

  async getChampionshipById(req, res) {
    try {
      const { id } = req.params;
      const champItem = await Championship.findByPk(id);

      if (champItem) {
        res.status(200).json(champItem);
      } else {
        res.status(404).json({ error: 'Turma não encontrada' });
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
      const { name, year } = req.body;
      
      const champItem = await Championship.findByPk(id);
      if (!champItem) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      // Atualiza apenas os campos fornecidos
      const updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (year !== undefined) updatedData.year = year;

      await champItem.update(updatedData);
      
      const updatedChamp = await Championship.findByPk(id);
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

      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  }
};

export default ChampionshipController;
