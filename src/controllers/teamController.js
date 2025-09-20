import Team from "../models/team.js";

const TeamController = {
  async getTeams(req, res) {
    const teams = await Team.findAll();
    res.send(JSON.stringify(teams));
  },

  async createTeam(req, res) {
    const { name, modality } = req.body;
    const newTeam = await Team.create({ name, modality });
    res.send(JSON.stringify(newTeam));
  },

  async getTeamById(req, res) {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (team) {
      res.send(JSON.stringify(team));
    } else {
      res.status(404).send({ error: 'Team not found' });
    }
  },

  async updateTeam(req, res) {
    const { id } = req.params;
    const { name, modality } = req.body;
    const team = await Team.findByPk(id);
    if (team) {
      team.name = name || team.name;
      team.modality = modality || team.modality;
      await team.save();
      res.send(JSON.stringify(team));
    } else {
      res.status(404).send({ error: 'Team not found' });
    }
  },

  async deleteTeam(req, res) {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (team) {
      await team.destroy();
      res.send({ message: 'Team deleted successfully' });
    } else {
      res.status(404).send({ error: 'Team not found' });
    }
  }
};

export default TeamController;