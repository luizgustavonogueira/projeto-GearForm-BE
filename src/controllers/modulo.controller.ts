import { Request, Response } from 'express'
import { ModuloService } from '../services/modulo.service'

const moduloService = new ModuloService()

export class ModuloController {
  
  //Cria um módulo
  async create(req: Request, res: Response) {
    try {
      const { curso_id, titulo, ordem } = req.body

      if (!curso_id || !titulo) {
        return res.status(400).json({ 
          error: 'curso_id e titulo são obrigatórios' 
        })
      }

      // Verifica se o curso existe
      const cursoExists = await moduloService.cursoExists(curso_id)
      if (!cursoExists) {
        return res.status(404).json({ error: 'Curso não encontrado' })
      }

      const modulo = await moduloService.createModulo({
        curso_id,
        titulo,
        ordem
      })

      return res.status(201).json({
        message: 'Módulo criado com sucesso',
        modulo
      })

    } catch (error) {
      console.error('Erro ao criar módulo:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Lista módulos de um curso
  async listByCurso(req: Request, res: Response) {
    try {
      const cursoId = parseInt(req.params.cursoId)
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      if (isNaN(cursoId)) {
        return res.status(400).json({ error: 'ID do curso inválido' })
      }

      const result = await moduloService.listModulosByCurso(cursoId, page, limit)

      return res.status(200).json(result)

    } catch (error) {
      console.error('Erro ao listar módulos:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Busca módulos por ID
  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const modulo = await moduloService.findById(id)

      if (!modulo) {
        return res.status(404).json({ error: 'Módulo não encontrado' })
      }

      return res.status(200).json(modulo)

    } catch (error) {
      console.error('Erro ao buscar módulo:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Atualiza módulos
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { titulo, ordem } = req.body

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await moduloService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Módulo não encontrado' })
      }

      const modulo = await moduloService.updateModulo(id, {
        titulo,
        ordem
      })

      return res.status(200).json({
        message: 'Módulo atualizado com sucesso',
        modulo
      })

    } catch (error) {
      console.error('Erro ao atualizar módulo:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

 //Deleta modulos
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await moduloService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Módulo não encontrado' })
      }

      await moduloService.deleteModulo(id)

      return res.status(200).json({
        message: 'Módulo deletado com sucesso'
      })

    } catch (error) {
      console.error('Erro ao deletar módulo:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}