import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso necessário' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    
    // Buscar o usuário no banco
    const user = await User.findByPk(decoded.userId)
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Token inválido' 
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expirado' 
      })
    }
    
    console.error('Erro na autenticação:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas administradores.' 
    })
  }
  next()
}
