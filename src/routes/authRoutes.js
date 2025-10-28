import express from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rotas públicas
router.post('/register', register)
router.post('/login', login)

// Rotas protegidas (requerem autenticação)
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)

export default router
