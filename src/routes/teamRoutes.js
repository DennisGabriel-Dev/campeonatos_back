import express from 'express';
const router = express.Router();
import TeamController from '../controllers/teamController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Listar todos os times
 *     tags:
 *       - Times
 *     description: Retorna lista completa de times cadastrados no sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de todos os times
 */
router.get('/', TeamController.getTeams);

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Criar novo time
 *     tags:
 *       - Times
 *     description: Cadastra um novo time no sistema que pode depois ser adicionado a campeonatos
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
 *               - modality
 *             properties:
 *               name:
 *                 type: string
 *                 example: Flamengo
 *               modality:
 *                 type: string
 *                 example: Futebol
 *     responses:
 *       '201':
 *         description: Time criado com sucesso
 */
router.post('/', TeamController.createTeam);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Obter detalhes do time
 *     tags:
 *       - Times
 *     description: Retorna informações do time e seus jogadores
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
 *         description: Dados do time
 *       '404':
 *         description: Time não encontrado
 */
router.get('/:id', TeamController.getTeamById);

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Atualizar time
 *     tags:
 *       - Times
 *     description: Permite editar nome ou modalidade do time
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
 *               modality:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Time atualizado
 */
router.put('/:id', TeamController.updateTeam);
router.patch('/:id', TeamController.updateTeam);

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Excluir time
 *     tags:
 *       - Times
 *     description: Remove o time do sistema (não será possível se tiver partidas em andamento)
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
 *         description: Time deletado
 */
router.delete('/:id', TeamController.deleteTeam);

export default router;