import express from 'express';
import PublicController from '../controllers/publicController.js';

const router = express.Router();

// Rotas públicas - SEM autenticação
router.get('/championships', PublicController.getChampionships);
router.get('/matches', PublicController.getMatches);
router.get('/championships/:id/ranking', PublicController.getRanking);

export default router;

