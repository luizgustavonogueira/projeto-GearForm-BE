import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { validateEmail, validateStrongPassword, validateCPF } from '../utils/validators'

const userService = new UserService()

export class UserController {
  
  //Cadastro de usuário
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha, cpf, status } = req.body
      
      // Validações
      if (!nome || !email || !senha || !cpf) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        })
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: 'Email inválido' 
        })
      }
      
      if (!validateStrongPassword(senha)) {
        return res.status(400).json({ 
          error: 'Senha fraca. Use pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial' 
        })
      }
      
      if (!validateCPF(cpf)) {
        return res.status(400).json({ 
          error: 'CPF inválido' 
        })
      }
      
      // Verifica se email já existe
      const emailExists = await userService.emailExists(email)
      if (emailExists) {
        return res.status(400).json({ 
          error: 'Email já cadastrado' 
        })
      }
      
      // Verifica se CPF já existe
      const cpfExists = await userService.cpfExists(cpf)
      if (cpfExists) {
        return res.status(400).json({ 
          error: 'CPF já cadastrado' 
        })
      }
      
      // Cria usuário
      const user = await userService.createUser({ 
        nome, 
        email, 
        senha, 
        cpf,
        status: status || 'ativo'
      })
      
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      })
      
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      })
    }
  }

  //Login do usuário
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body

      if (!email || !senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        })
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: 'Email inválido' 
        })
      }

      const result = await userService.login(email, senha)

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        ...result
      })

    } catch (error: any) {
      console.error('Erro no login:', error)
      
      if (error.message === 'Usuário não encontrado' || 
          error.message === 'Senha incorreta') {
        return res.status(401).json({ 
          error: error.message 
        })
      }
      
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      })
    }
  }

  //Buscar perfil do usuário autenticado
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' })
      }

      const user = await userService.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      return res.status(200).json(user)

    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      })
    }
  }

  //Atualizar usuário
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.userId
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' })
      }

      const { nome, senha, cpf, status } = req.body

      // nome é obrigatório na edição
      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome é obrigatório' })
      }

      const updateData: any = {}
      updateData.nome = nome.trim()
      
      if (senha) {
        if (!validateStrongPassword(senha)) {
          return res.status(400).json({ 
            error: 'Senha fraca. Use pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial' 
          })
        }
        updateData.senha = senha
      }
      
      if (cpf) {
        if (!validateCPF(cpf)) {
          return res.status(400).json({ error: 'CPF inválido' })
        }
        
        const existingUser = await userService.findByCpf(cpf)
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: 'CPF já cadastrado' })
        }
        updateData.cpf = cpf
      }
      
      if (status) updateData.status = status

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' })
      }

      const updatedUser = await userService.updateUser(userId, updateData)

      return res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser
      })

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      })
    }
  }
}