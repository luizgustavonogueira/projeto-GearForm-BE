import { Router } from 'express'
import { CursoController } from '../controllers/curso.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
const cursoController = new CursoController()

// Rotas PROTEGIDAS (todas autenticadas conforme rubrica)
router.get('/', authMiddleware, cursoController.list)
router.get('/:id', authMiddleware, cursoController.findById)
router.post('/', authMiddleware, cursoController.create)
router.put('/:id', authMiddleware, cursoController.update)
router.delete('/:id', authMiddleware, cursoController.delete)

export default router