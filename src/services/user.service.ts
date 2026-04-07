import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'
import { authConfig } from '../config/auth'
import { IUserCreate, IUserUpdate } from '../types/user.types'

export class UserService {

  //Cria novo usuário

  async createUser(data: IUserCreate) {
    const hashedPassword = await bcrypt.hash(data.senha, 10)
    
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        cpf: data.cpf,
        status: data.status || 'ativo'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        status: true,
        created_at: true
      }
    })
  }
  
//Busca usuário por email

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email }
    })
  }
  
  //Busca por ID

  async findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        status: true,
        ultimo_acesso: true,
        created_at: true,
        updated_at: true
      }
    })
  }
  
 //Busca por CPF

  async findByCpf(cpf: string) {
    return prisma.usuario.findUnique({
      where: { cpf },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true
      }
    })
  }
  
  //Atualiza usuário

  async updateUser(id: number, data: IUserUpdate) {
    const updateData: any = { ...data }
    
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10)
    }
    
    return prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        status: true,
        updated_at: true
      }
    })
  }
  
  //Verifica se email já existe

  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true }
    })
    return !!user
  }
  
 //Verifica se CPF já existe

  async cpfExists(cpf: string): Promise<boolean> {
    const user = await prisma.usuario.findUnique({
      where: { cpf },
      select: { id: true }
    })
    return !!user
  }

 //Autenticação e retorna token

  async login(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const isValidPassword = await bcrypt.compare(senha, user.senha)

    if (!isValidPassword) {
      throw new Error('Senha incorreta')
    }

    // Atualiza último acesso
    await this.updateUltimoAcesso(user.id)

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      authConfig.secret,
      { expiresIn: '7d' }
    )

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf
      },
      token
    }
  }

 //Atualiza ultimo acesso do usuário
 
  async updateUltimoAcesso(id: number) {
    return prisma.usuario.update({
      where: { id },
      data: { ultimo_acesso: new Date() }
    })
  }
}