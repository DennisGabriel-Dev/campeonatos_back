import express from 'express';
import ReportsController from '../controllers/reportsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /reports/matches/{championshipId}:
 *   get:
 *     summary: Relatório de resultados das partidas
 *     tags:
 *       - Relatórios
 *     description: Exporta um relatório completo de todas as partidas do campeonato com placares e datas. Disponível em JSON, CSV ou XLSX
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, xlsx]
 *         description: Formato de exportação (padrão json)
 *     responses:
 *       '200':
 *         description: Relatório de partidas
 */
router.get('/matches/:championshipId', ReportsController.getMatchResults);

/**
 * @swagger
 * /reports/champions/{championshipId}:
 *   get:
 *     summary: Relatório de campeões
 *     tags:
 *       - Relatórios
 *     description: Gera relatório com informações do time campeão, estatísticas e histórico. Pode exportar em CSV ou XLSX para arquivar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, xlsx]
 *     responses:
 *       '200':
 *         description: Dados do campeão e estatísticas
 */
router.get('/champions/:championshipId', ReportsController.getChampions);

/**
 * @swagger
 * /reports/players-by-modality:
 *   get:
 *     summary: Relatório de jogadores por modalidade
 *     tags:
 *       - Relatórios
 *     description: Lista todos os jogadores cadastrados agrupados por Futebol e Vôlei. Útil para análise de participação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, xlsx]
 *     responses:
 *       '200':
 *         description: Jogadores agrupados por modalidade
 */
router.get('/players-by-modality', ReportsController.getPlayersByModality);

/**
 * @swagger
 * /reports/top-teams/{championshipId}:
 *   get:
 *     summary: Ranking de melhores times
 *     tags:
 *       - Relatórios
 *     description: Gera relatório dos times com melhor desempenho no campeonato, ordenado por pontos, vitórias e saldo de gols
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantos times mostrar (padrão 10)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, xlsx]
 *     responses:
 *       '200':
 *         description: Top times ordenados por desempenho
 */
router.get('/top-teams/:championshipId', ReportsController.getTopTeams);

export default router;

