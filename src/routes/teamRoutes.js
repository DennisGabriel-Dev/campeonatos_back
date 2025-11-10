import express from 'express';
const router = express.Router();
import TeamController from '../controllers/teamController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

// aplica os middlewares de autenticação a todas as rotas desse router
router.use(authenticateToken, requireAdmin);

router.get('/', TeamController.getTeams);
router.post('/', TeamController.createTeam);
router.get('/:id', TeamController.getTeamById);
router.put('/:id', TeamController.updateTeam);
router.patch('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);

export default router;