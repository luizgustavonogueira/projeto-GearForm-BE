import { Router } from 'express'
import { ModuloController } from '../controllers/modulo.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
const moduloController = new ModuloController()

// Rotas PROTEGIDAS (todas autenticadas conforme rubrica)
router.get('/curso/:cursoId', authMiddleware, moduloController.listByCurso)
router.get('/:id', authMiddleware, moduloController.findById)
router.post('/', authMiddleware, moduloController.create)
router.put('/:id', authMiddleware, moduloController.update)
router.delete('/:id', authMiddleware, moduloController.delete)

export default router