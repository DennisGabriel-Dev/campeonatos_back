import express from 'express'
import { register, login, getProfile, updateProfile, googleLogin } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rotas públicas
router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)

// Rotas protegidas (requerem autenticação)
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)

export default router
