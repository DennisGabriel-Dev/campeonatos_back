import express from 'express';
import ChampionshipController from '../controllers/championshipController.js';

const router = express.Router();

// Rotas básicas do CRUD
router.get('/', ChampionshipController.getChampionships);
router.post('/', ChampionshipController.createChampionShip);
router.get('/:id', ChampionshipController.getChampionshipById);
router.put('/:id', ChampionshipController.updateChampionship);
router.patch('/:id', ChampionshipController.updateChampionship);
router.delete('/:id', ChampionshipController.deleteChampionship);

export default router;
