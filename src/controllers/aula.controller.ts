import { Request, Response } from 'express'
import { AulaService } from '../services/aula.service'

const aulaService = new AulaService()

export class AulaController {
  
  //Cria aula
  async create(req: Request, res: Response) {
    try {
      const { modulo_id, titulo, tipo, conteudo, url_video, ordem } = req.body

      if (!modulo_id || !titulo) {
        return res.status(400).json({ 
          error: 'modulo_id e titulo são obrigatórios' 
        })
      }

      // Verifica se o módulo existe
      const moduloExists = await aulaService.moduloExists(modulo_id)
      if (!moduloExists) {
        return res.status(404).json({ error: 'Módulo não encontrado' })
      }

      const aula = await aulaService.createAula({
        modulo_id,
        titulo,
        tipo,
        conteudo,
        url_video,
        ordem
      })

      return res.status(201).json({
        message: 'Aula criada com sucesso',
        aula
      })

    } catch (error) {
      console.error('Erro ao criar aula:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Lista aula de um módulo
  async listByModulo(req: Request, res: Response) {
    try {
      const moduloId = parseInt(req.params.moduloId)
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      if (isNaN(moduloId)) {
        return res.status(400).json({ error: 'ID do módulo inválido' })
      }

      const result = await aulaService.listAulasByModulo(moduloId, page, limit)

      return res.status(200).json(result)

    } catch (error) {
      console.error('Erro ao listar aulas:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Busca aula por ID
  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const aula = await aulaService.findById(id)

      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' })
      }

      return res.status(200).json(aula)

    } catch (error) {
      console.error('Erro ao buscar aula:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Atualiza aula
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { titulo, tipo, conteudo, url_video, ordem } = req.body

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await aulaService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Aula não encontrada' })
      }

      const aula = await aulaService.updateAula(id, {
        titulo,
        tipo,
        conteudo,
        url_video,
        ordem
      })

      return res.status(200).json({
        message: 'Aula atualizada com sucesso',
        aula
      })

    } catch (error) {
      console.error('Erro ao atualizar aula:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  //Deleta aula
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' })
      }

      const exists = await aulaService.exists(id)
      if (!exists) {
        return res.status(404).json({ error: 'Aula não encontrada' })
      }

      await aulaService.deleteAula(id)

      return res.status(200).json({
        message: 'Aula deletada com sucesso'
      })

    } catch (error) {
      console.error('Erro ao deletar aula:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}