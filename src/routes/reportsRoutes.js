import express from 'express';
import ReportsController from '../controllers/reportsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middlewares de autenticação a todas as rotas
router.use(authenticateToken, requireAdmin);

// Rotas de relatórios
router.get('/matches/:championshipId', ReportsController.getMatchResults);
router.get('/champions/:championshipId', ReportsController.getChampions);
router.get('/players-by-modality', ReportsController.getPlayersByModality);
router.get('/top-teams/:championshipId', ReportsController.getTopTeams);

export default router;

