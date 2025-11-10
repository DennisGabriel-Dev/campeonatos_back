import Match from "../models/match.js";

const MatchController = {
  async getMatches(req, res) {
    const matches = await Match.findAll();
    res.send(JSON.stringify(matches));
  },

  async createMatch(req, res) {
    const { playDay, status } = req.body;
    const newMatch = await Match.create({ playDay, status });
    res.send(JSON.stringify(newMatch));
  },

  async getMatchById(req, res) {
    const { id } = req.params;
    const match = await Match.findByPk(id);
    if (match) {
      res.send(JSON.stringify(match));
    } else {
      res.status(404).send({ error: 'Team not found' });
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
    const { id } = req.params;
    const match = await Match.findByPk(id);
    if (match) {
      await match.destroy();
      res.send({ message: 'Partida deletada com sucesso' });
    } else {
      res.status(404).send({ error: 'Partida não encontrada' });
    }
  }
};

export default MatchController;