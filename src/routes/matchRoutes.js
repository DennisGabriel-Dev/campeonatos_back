import express from 'express';
import MatchController from '../controllers/matchController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Listar todas as partidas
 *     tags:
 *       - Partidas
 *     description: Retorna lista de todas as partidas criadas. Pode filtrar por campeonato
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: championshipId
 *         schema:
 *           type: integer
 *         description: ID do campeonato para filtrar (opcional)
 *     responses:
 *       '200':
 *         description: Lista de partidas com times e placar
 */
router.get('/', MatchController.getMatches);

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Criar partida manualmente
 *     tags:
 *       - Partidas
 *     description: Cria uma partida isolada (normalmente usado internamente, partidas são geradas automaticamente)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playDay:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: '0: Não iniciada, 1: Em andamento, 2: Finalizada'
 *     responses:
 *       '201':
 *         description: Partida criada
 */
router.post('/', MatchController.createMatch);

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Obter detalhes da partida
 *     tags:
 *       - Partidas
 *     description: Retorna informações completas da partida incluindo times e placar
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
 *         description: Dados da partida
 *       '404':
 *         description: Partida não encontrada
 */
router.get('/:id', MatchController.getMatchById);

/**
 * @swagger
 * /matches/{id}:
 *   put:
 *     summary: Atualizar status da partida
 *     tags:
 *       - Partidas
 *     description: Permite alterar data ou status (não iniciada, em andamento, finalizada)
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
 *               playDay:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Partida atualizada
 */
router.put('/:id', MatchController.updateMatch);
router.patch('/:id', MatchController.updateMatch);

/**
 * @swagger
 * /matches/{id}:
 *   delete:
 *     summary: Excluir partida
 *     tags:
 *       - Partidas
 *     description: Remove a partida do sistema (usar com cuidado)
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
 *         description: Partida deletada
 */
router.delete('/:id', MatchController.deleteMatch);

/**
 * @swagger
 * /matches/{id}/result:
 *   post:
 *     summary: Registrar resultado da partida
 *     tags:
 *       - Partidas
 *     description: Define o placar final e calcula automaticamente os pontos (3-1-0 para Futebol, 3-0 para Vôlei)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goalsTeam1
 *               - goalsTeam2
 *             properties:
 *               goalsTeam1:
 *                 type: integer
 *                 example: 2
 *                 description: Gols/Pontos do primeiro time
 *               goalsTeam2:
 *                 type: integer
 *                 example: 1
 *                 description: Gols/Pontos do segundo time
 *     responses:
 *       '200':
 *         description: Resultado registrado e pontuação atualizada no ranking
 *       '400':
 *         description: Dados inválidos
 */
router.post('/:id/result', MatchController.registerResult);

export default router;

