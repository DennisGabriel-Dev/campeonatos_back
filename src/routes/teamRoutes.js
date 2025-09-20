import express from 'express';
const router = express.Router();
import PlayerController from '../controllers/teamController.js';

router.get('/', PlayerController.getTeams);
router.post('/', PlayerController.createTeam);
router.get('/:id', PlayerController.getTeamById);
router.put('/:id', PlayerController.updateTeam);
router.patch('/:id', PlayerController.updateTeam);
router.delete('/:id', PlayerController.deleteTeam);

export default router;