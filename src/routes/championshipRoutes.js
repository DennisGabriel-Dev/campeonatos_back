import express from 'express';
import ChampionshipController from '../controllers/championshipController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
// aplica os middlewares de autenticação a todas as rotas desse router
router.use(authenticateToken, requireAdmin);

// Rotas básicas do CRUD
router.get('/', ChampionshipController.getChampionships);
router.post('/', ChampionshipController.createChampionShip);
router.get('/:id/ranking', ChampionshipController.getRanking);
router.get('/:id/teams', ChampionshipController.getChampionshipTeams);
router.post('/:id/teams', ChampionshipController.addTeamToChampionship);
router.delete('/:id/teams/:teamId', ChampionshipController.removeTeamFromChampionship);
router.post('/:id/generate-matches', ChampionshipController.generateMatches);
router.get('/:id', ChampionshipController.getChampionshipById);
router.put('/:id', ChampionshipController.updateChampionship);
router.patch('/:id', ChampionshipController.updateChampionship);
router.delete('/:id', ChampionshipController.deleteChampionship);

export default router;
