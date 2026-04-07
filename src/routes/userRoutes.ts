import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
const userController = new UserController()

// Rotas públicas
router.post('/register', userController.register)
router.post('/login', userController.login)

// Rotas protegidas
router.get('/profile', authMiddleware, userController.getProfile)
router.put('/profile', authMiddleware, userController.updateProfile)

export default router