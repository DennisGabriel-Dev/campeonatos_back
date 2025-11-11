import express from 'express';
import PlayerController from '../controllers/playerController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// aplica os middlewares de autenticação a todas as rotas desse router
router.use(authenticateToken, requireAdmin);

// Rotas básicas do CRUD
router.get('/', PlayerController.getPlayers);
router.post('/', PlayerController.createPlayer);
router.get('/:id', PlayerController.getPlayerById);
router.put('/:id', PlayerController.updatePlayer);
router.patch('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

// Rotas adicionais
router.get('/team/:teamId', PlayerController.getPlayersByTeam);
router.get('/class/:classId', PlayerController.getPlayersByClass);

export default router;
