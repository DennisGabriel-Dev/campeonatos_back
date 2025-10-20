import express from 'express';
const router = express.Router();
import TeamController from '../controllers/teamController.js';

router.get('/', TeamController.getTeams);
router.post('/', TeamController.createTeam);
router.get('/:id', TeamController.getTeamById);
router.put('/:id', TeamController.updateTeam);
router.patch('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);

export default router;