import express from 'express';
import MatchController from '../controllers/matchController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// aplica os middlewares de autenticação a todas as rotas desse router
router.use(authenticateToken, requireAdmin);

router.get('/', MatchController.getMatches);
router.post('/', MatchController.createMatch);
router.get('/:id', MatchController.getMatchById);
router.put('/:id', MatchController.updateMatch);
router.patch('/:id', MatchController.updateMatch);
router.delete('/:id', MatchController.deleteMatch);
router.post('/:id/result', MatchController.registerResult);

export default router;

