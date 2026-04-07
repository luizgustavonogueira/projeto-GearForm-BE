import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth'

interface TokenPayload {
  id: number
  email: string
  nome: string
  iat: number
  exp: number
}

declare global {
  namespace Express {
    interface Request {
      userId?: number
      userEmail?: string
      userNome?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    res.status(401).json({ error: 'Token mal formatado' })
    return
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: 'Token mal formatado' })
    return
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Token inválido ou expirado' })
      return
    }

    const payload = decoded as TokenPayload
    req.userId = payload.id
    req.userEmail = payload.email
    req.userNome = payload.nome

    next()
  })
}