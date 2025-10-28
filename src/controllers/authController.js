import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import User from '../models/user.js'

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      })
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        error: 'Email já cadastrado'
      })
    }

    // Hash da senha
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    // Retornar dados do usuário (sem senha) e token
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
}

// Login do usuário
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      })
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      })
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    // Retornar dados do usuário (sem senha) e token
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
}

// Obter perfil do usuário logado
export const getProfile = async (req, res) => {
  try {
    const user = req.user

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
}

// Login com Google
export const googleLogin = async (req, res) => {
  try {
    const { email, name, picture } = req.body

    // Verificar se usuário já existe
    let user = await User.findOne({ where: { email } })
    
    if (!user) {
      // Criar novo usuário
      user = await User.create({
        name,
        email,
        password: '', // Sem senha para OAuth
        role: 'user'
      })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login com Google realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('Erro no login do Google:', error)
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
}

// Atualizar perfil do usuário
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const user = req.user

    // Verificar se email já existe em outro usuário
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: user.id }
        }
      })
      if (existingUser) {
        return res.status(409).json({
          error: 'Email já cadastrado'
        })
      }
    }

    // Atualizar dados
    await user.update({
      name: name || user.name,
      email: email || user.email
    })

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
}
