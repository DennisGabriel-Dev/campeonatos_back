import express from 'express';
import ChampionshipController from '../controllers/championshipController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /championships:
 *   get:
 *     summary: Listar todos os campeonatos
 *     tags:
 *       - Campeonatos
 *     description: Retorna lista de todos os campeonatos criados (Futebol ou Vôlei)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de campeonatos com seus times associados
 *       '401':
 *         description: Autenticação necessária
 */
router.get('/', ChampionshipController.getChampionships);

/**
 * @swagger
 * /championships:
 *   post:
 *     summary: Criar novo campeonato
 *     tags:
 *       - Campeonatos
 *     description: Cria um novo campeonato de Futebol ou Vôlei. Pode ser em formato Round Robin (todos jogam com todos) ou Knockout (eliminatória)
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
 *               - modality
 *             properties:
 *               name:
 *                 type: string
 *                 example: IFMA Campeonato 2026
 *               year:
 *                 type: integer
 *                 example: 2026
 *               modality:
 *                 type: string
 *                 enum: [Futebol, Vôlei]
 *                 example: Futebol
 *               format:
 *                 type: string
 *                 enum: [round-robin, knockout]
 *                 example: round-robin
 *     responses:
 *       '201':
 *         description: Campeonato criado com sucesso
 *       '400':
 *         description: Modalidade inválida ou campos obrigatórios faltando
 */
router.post('/', ChampionshipController.createChampionShip);

/**
 * @swagger
 * /championships/{id}:
 *   get:
 *     summary: Obter detalhes do campeonato
 *     tags:
 *       - Campeonatos
 *     description: Retorna informações completas do campeonato incluindo times participantes
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
 *         description: Dados do campeonato
 *       '404':
 *         description: Campeonato não encontrado
 */
router.get('/:id', ChampionshipController.getChampionshipById);

/**
 * @swagger
 * /championships/{id}:
 *   put:
 *     summary: Atualizar informações do campeonato
 *     tags:
 *       - Campeonatos
 *     description: Permite editar nome, ano ou outras informações do campeonato
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
 *     responses:
 *       '200':
 *         description: Campeonato atualizado
 *       '404':
 *         description: Campeonato não encontrado
 */
router.put('/:id', ChampionshipController.updateChampionship);
router.patch('/:id', ChampionshipController.updateChampionship);

/**
 * @swagger
 * /championships/{id}:
 *   delete:
 *     summary: Excluir campeonato
 *     tags:
 *       - Campeonatos
 *     description: Remove o campeonato e todas as partidas associadas
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
 *         description: Campeonato deletado com sucesso
 *       '404':
 *         description: Campeonato não encontrado
 */
router.delete('/:id', ChampionshipController.deleteChampionship);

/**
 * @swagger
 * /championships/{id}/ranking:
 *   get:
 *     summary: Obter ranking do campeonato
 *     tags:
 *       - Campeonatos
 *     description: Retorna classificação dos times com pontos, vitórias, derrotas e saldo de gols
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
 *         description: Ranking ordenado por pontos
 */
router.get('/:id/ranking', ChampionshipController.getRanking);

/**
 * @swagger
 * /championships/{id}/teams:
 *   get:
 *     summary: Listar times participantes
 *     tags:
 *       - Campeonatos
 *     description: Retorna todos os times inscritos neste campeonato
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
 *         description: Lista de times do campeonato
 */
router.get('/:id/teams', ChampionshipController.getChampionshipTeams);

/**
 * @swagger
 * /championships/{id}/teams:
 *   post:
 *     summary: Adicionar time ao campeonato
 *     tags:
 *       - Campeonatos
 *     description: Inscreve um time já cadastrado no sistema para participar do campeonato
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
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       '201':
 *         description: Time adicionado com sucesso
 *       '404':
 *         description: Time ou campeonato não encontrado
 */
router.post('/:id/teams', ChampionshipController.addTeamToChampionship);

/**
 * @swagger
 * /championships/{id}/teams/{teamId}:
 *   delete:
 *     summary: Remover time do campeonato
 *     tags:
 *       - Campeonatos
 *     description: Remove um time da participação no campeonato (não deleta o time, apenas a inscrição)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Time removido com sucesso
 */
router.delete('/:id/teams/:teamId', ChampionshipController.removeTeamFromChampionship);

/**
 * @swagger
 * /championships/{id}/generate-matches:
 *   post:
 *     summary: Gerar partidas (Sistema de Pontos Corridos)
 *     tags:
 *       - Campeonatos
 *     description: Gera todas as combinações de partidas entre os times (cada time joga com todos os outros uma vez)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Partidas geradas - Futebol usa sistema 3-1-0, Vôlei usa 3-0
 */
router.post('/:id/generate-matches', ChampionshipController.generateMatches);

/**
 * @swagger
 * /championships/{id}/knockout-matches:
 *   post:
 *     summary: Gerar partidas (Sistema de Eliminatória)
 *     tags:
 *       - Campeonatos
 *     description: Inicia competição em formato knockout com chaveamento automático dos times
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Chaveamento criado e primeira rodada gerada
 */
router.post('/:id/knockout-matches', ChampionshipController.generateKnockoutMatches);

/**
 * @swagger
 * /championships/{id}/knockout-advance:
 *   post:
 *     summary: Avançar para próxima rodada do knockout
 *     tags:
 *       - Campeonatos
 *     description: Após definir os vencedores da rodada, avança os times para a próxima fase
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
 *         description: Rodada avançada - próximas partidas geradas
 */
router.post('/:id/knockout-advance', ChampionshipController.advanceKnockoutRound);

export default router;
