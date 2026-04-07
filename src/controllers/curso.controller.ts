import { Request, Response } from 'express'
import { CursoService } from '../services/curso.service'

const cursoService = new CursoService()

export class CursoController {
  
  //Criar curso
  async create(req: Request, res: Response) {
    try {
      const { titulo, descricao, cargaHoraria } = req.body

      if (!titulo) {
        return res.status(400).json({ error: 'Título é obrigatório' })
      }

      const curso = await cursoService.createCurso({
        titulo,
        descricao,
        cargaHoraria
      })

      return res.status(201).json({
        message: 'Curso criado com sucesso',
        curso
      })

    } catch (error) {
      console.error('Erro ao criar curso:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Listar cursos
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const result = await cursoService.listCursos(page, limit)

      return res.status(200).json(result)

    } catch (error) {
      console.error('Erro ao listar cursos:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Busca curso por ID
  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const curso = await cursoService.findById(id)

      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' })
      }

      return res.status(200).json(curso)

    } catch (error) {
      console.error('Erro ao buscar curso:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Atualiza curso
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { titulo, descricao, cargaHoraria } = req.body

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await cursoService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Curso não encontrado' })
      }

      const curso = await cursoService.updateCurso(id, {
        titulo,
        descricao,
        cargaHoraria
      })

      return res.status(200).json({
        message: 'Curso atualizado com sucesso',
        curso
      })

    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Deleta curso
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await cursoService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Curso não encontrado' })
      }

      await cursoService.deleteCurso(id)

      return res.status(200).json({
        message: 'Curso deletado com sucesso'
      })

    } catch (error) {
      console.error('Erro ao deletar curso:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}