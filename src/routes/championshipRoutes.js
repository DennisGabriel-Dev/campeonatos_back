import express from 'express';
import ChampionshipController from '../controllers/championshipController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
// aplica os middlewares de autenticação a todas as rotas desse router
router.use(authenticateToken, requireAdmin);

// Rotas básicas do CRUD
router.get('/', ChampionshipController.getChampionships);
router.post('/', ChampionshipController.createChampionShip);
router.get('/:id', ChampionshipController.getChampionshipById);
router.put('/:id', ChampionshipController.updateChampionship);
router.patch('/:id', ChampionshipController.updateChampionship);
router.delete('/:id', ChampionshipController.deleteChampionship);
router.post('/:id', ChampionshipController.generateMatches);

export default router;
