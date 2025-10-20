import express from 'express';
import ClassController from '../controllers/classController.js';

const router = express.Router();

// Rotas básicas do CRUD
router.get('/', ClassController.getClasses);
router.post('/', ClassController.createClass);
router.get('/:id', ClassController.getClassById);
router.put('/:id', ClassController.updateClass);
router.patch('/:id', ClassController.updateClass);
router.delete('/:id', ClassController.deleteClass);

// Rotas adicionais
router.get('/year/:year', ClassController.getClassesByYear);
router.get('/course/:course', ClassController.getClassesByCourse);

export default router;
