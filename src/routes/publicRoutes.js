import express from 'express';
import PublicController from '../controllers/publicController.js';

const router = express.Router();

/**
 * @swagger
 * /public/championships:
 *   get:
 *     summary: Ver campeonatos (Público)
 *     tags:
 *       - Público
 *     description: Endpoint público - qualquer pessoa pode ver os campeonatos ativos sem autenticação
 *     responses:
 *       '200':
 *         description: Lista de campeonatos disponíveis
 */
router.get('/championships', PublicController.getChampionships);

/**
 * @swagger
 * /public/matches:
 *   get:
 *     summary: Ver calendário de partidas (Público)
 *     tags:
 *       - Público
 *     description: Endpoint público - visualize as próximas partidas e resultados sem login
 *     responses:
 *       '200':
 *         description: Lista de partidas agendadas e realizadas
 */
router.get('/matches', PublicController.getMatches);

/**
 * @swagger
 * /public/championships/{id}/ranking:
 *   get:
 *     summary: Ver ranking do campeonato (Público)
 *     tags:
 *       - Público
 *     description: Endpoint público - acompanhe a classificação do campeonato em tempo real
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do campeonato
 *     responses:
 *       '200':
 *         description: Ranking com times, pontos, vitórias e derrotas
 */
router.get('/championships/:id/ranking', PublicController.getRanking);

export default router;

