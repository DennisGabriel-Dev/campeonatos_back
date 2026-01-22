import express from 'express'
import { register, login, getProfile, updateProfile, googleLogin } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags:
 *       - Autenticação
 *     description: Cria uma conta de administrador com email e senha para gerenciar campeonatos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@ifma.edu.br
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: SenhaForte@123
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso, retorna token JWT
 *       '400':
 *         description: Campos obrigatórios faltando ou inválidos
 *       '409':
 *         description: Email já cadastrado no sistema
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags:
 *       - Autenticação
 *     description: Faz login com email e senha, retorna JWT válido por 24 horas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@ifma.edu.br
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SenhaForte@123
 *     responses:
 *       '200':
 *         description: Login bem-sucedido, retorna token e dados do usuário
 *       '400':
 *         description: Email ou senha inválidos
 *       '404':
 *         description: Usuário não encontrado
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Login com Google
 *     tags:
 *       - Autenticação
 *     description: Autentica usando credenciais do Google OAuth2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT do Google
 *     responses:
 *       '200':
 *         description: Autenticado com sucesso
 *       '400':
 *         description: Token inválido ou expirado
 */
router.post('/google-login', googleLogin)

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obter dados do usuário logado
 *     tags:
 *       - Autenticação
 *     description: Retorna informações do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dados do usuário
 *       '401':
 *         description: Token ausente ou inválido
 */
router.get('/profile', authenticateToken, getProfile)

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags:
 *       - Autenticação
 *     description: Permite que o usuário atualize seu nome e email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria da Silva
 *               email:
 *                 type: string
 *                 example: maria.silva@ifma.edu.br
 *     responses:
 *       '200':
 *         description: Perfil atualizado com sucesso
 *       '401':
 *         description: Não autenticado
 */
router.put('/profile', authenticateToken, updateProfile)

export default router
