import express from 'express';
import PlayerController from '../controllers/playerController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Listar todos os jogadores
 *     tags:
 *       - Jogadores
 *     description: Retorna lista completa de jogadores cadastrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de jogadores com suas turmas e times
 */
router.get('/', PlayerController.getPlayers);

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Criar novo jogador
 *     tags:
 *       - Jogadores
 *     description: Cadastra um novo aluno como jogador no sistema
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
 *               - age
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos Eduardo
 *               age:
 *                 type: integer
 *                 example: 17
 *               classId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *                 description: Time do jogador (opcional)
 *     responses:
 *       '201':
 *         description: Jogador criado e pode ser adicionado a times
 */
router.post('/', PlayerController.createPlayer);

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Obter detalhes do jogador
 *     tags:
 *       - Jogadores
 *     description: Retorna informações do jogador incluindo time e turma
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
 *         description: Dados do jogador
 */
router.get('/:id', PlayerController.getPlayerById);

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Atualizar jogador
 *     tags:
 *       - Jogadores
 *     description: Permite editar dados do jogador como nome, idade ou time
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
 *               age:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Jogador atualizado
 */
router.put('/:id', PlayerController.updatePlayer);
router.patch('/:id', PlayerController.updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Remover jogador
 *     tags:
 *       - Jogadores
 *     description: Remove o jogador do sistema
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
 *         description: Jogador deletado
 */
router.delete('/:id', PlayerController.deletePlayer);

/**
 * @swagger
 * /players/team/{teamId}:
 *   get:
 *     summary: Listar jogadores de um time
 *     tags:
 *       - Jogadores
 *     description: Retorna todos os jogadores inscritos em um time específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Elenco do time
 */
router.get('/team/:teamId', PlayerController.getPlayersByTeam);

/**
 * @swagger
 * /players/class/{classId}:
 *   get:
 *     summary: Listar jogadores de uma turma
 *     tags:
 *       - Jogadores
 *     description: Retorna todos os alunos de uma turma que estão cadastrados como jogadores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Jogadores da turma
 */
router.get('/class/:classId', PlayerController.getPlayersByClass);

export default router;
