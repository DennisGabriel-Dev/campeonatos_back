import express from 'express';
import ClassController from '../controllers/classController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Listar todas as turmas
 *     tags:
 *       - Turmas
 *     description: Retorna lista de turmas/classes cadastradas na escola
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de turmas
 */
router.get('/', ClassController.getClasses);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Criar nova turma
 *     tags:
 *       - Turmas
 *     description: Cadastra uma nova turma na escola
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - year
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 example: 1º Ano A
 *               year:
 *                 type: integer
 *                 example: 2026
 *               course:
 *                 type: string
 *                 example: Ensino Médio
 *     responses:
 *       '201':
 *         description: Turma criada com sucesso
 */
router.post('/', ClassController.createClass);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Obter detalhes da turma
 *     tags:
 *       - Turmas
 *     description: Retorna informações da turma e lista de alunos/jogadores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Dados da turma
 */
router.get('/:id', ClassController.getClassById);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Atualizar turma
 *     tags:
 *       - Turmas
 *     description: Permite editar informações da turma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               year:
 *                 type: integer
 *               course:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Turma atualizada
 */
router.put('/:id', ClassController.updateClass);
router.patch('/:id', ClassController.updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Excluir turma
 *     tags:
 *       - Turmas
 *     description: Remove a turma do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Turma deletada
 */
router.delete('/:id', ClassController.deleteClass);

/**
 * @swagger
 * /classes/year/{year}:
 *   get:
 *     summary: Listar turmas por ano
 *     tags:
 *       - Turmas
 *     description: Retorna todas as turmas de um determinado ano letivo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       '200':
 *         description: Turmas do ano
 */
router.get('/year/:year', ClassController.getClassesByYear);

/**
 * @swagger
 * /classes/course/{course}:
 *   get:
 *     summary: Listar turmas por curso
 *     tags:
 *       - Turmas
 *     description: Retorna todas as turmas de um curso específico (Ensino Médio, Técnico, etc)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *           example: Ensino Médio
 *     responses:
 *       '200':
 *         description: Turmas do curso
 */
router.get('/course/:course', ClassController.getClassesByCourse);

export default router;
