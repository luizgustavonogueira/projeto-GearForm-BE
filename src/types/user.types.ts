export interface IUser {
  id: number
  nome: string
  email: string
  cpf: string
  status?: string | null
  ultimo_acesso?: Date | null
  created_at: Date
  updated_at: Date
}

export interface IUserCreate {
  nome: string
  email: string
  senha: string
  cpf: string
  status?: string
}

export interface IUserLogin {
  email: string
  senha: string
}

export interface IUserUpdate {
  nome?: string
  senha?: string
  cpf?: string
  status?: string
}