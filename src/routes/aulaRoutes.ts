import { Router } from 'express'
import { AulaController } from '../controllers/aula.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
const aulaController = new AulaController()

// Rotas PROTEGIDAS (todas autenticadas conforme rubrica)
router.get('/modulo/:moduloId', authMiddleware, aulaController.listByModulo)
router.get('/:id', authMiddleware, aulaController.findById)
router.post('/', authMiddleware, aulaController.create)
router.put('/:id', authMiddleware, aulaController.update)
router.delete('/:id', authMiddleware, aulaController.delete)

export default router