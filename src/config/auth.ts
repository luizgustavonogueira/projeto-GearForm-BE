import dotenv from 'dotenv'

dotenv.config()

export const authConfig = {
  secret: process.env.JWT_SECRET || 'default_secret_change_this',
  expiresIn: '7d' // Token expira em 7 dias
}