import prisma from '../config/prisma'
import { IAulaCreate, IAulaUpdate } from '../types/aula.types'

export class AulaService {
 
  //Cria uma nova aula
  async createAula(data: IAulaCreate) {
    const lastAula = await prisma.aula.findFirst({
      where: { modulo_id: data.modulo_id },
      orderBy: { ordem: 'desc' }
    })
    
    const ordem = data.ordem ?? (lastAula ? lastAula.ordem + 1 : 1)
    
    return prisma.aula.create({
      data: {
        modulo_id: data.modulo_id,
        titulo: data.titulo,
        tipo: data.tipo || 'video',
        conteudo: data.conteudo,
        url_video: data.url_video,
        ordem
      }
    })
  }

  //Lista de aulas em um módulo
  async listAulasByModulo(moduloId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    const [aulas, total] = await Promise.all([
      prisma.aula.findMany({
        where: { modulo_id: moduloId },
        skip,
        take: limit,
        orderBy: { ordem: 'asc' },
        include: {
          _count: {
            select: { questoes: true, progresso: true }
          }
        }
      }),
      prisma.aula.count({ where: { modulo_id: moduloId } })
    ])

    return {
      data: aulas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

//Busca aula por ID
  async findById(id: number) {
    return prisma.aula.findUnique({
      where: { id },
      include: {
        modulo: {
          include: {
            curso: {
              select: { id: true, nome_curso: true }
            }
          }
        },
        questoes: {
          orderBy: { created_at: 'asc' }
        }
      }
    })
  }

  //Atualiza uma aula
  async updateAula(id: number, data: IAulaUpdate) {
    return prisma.aula.update({
      where: { id },
      data
    })
  }

  //Deleta uma aula
  async deleteAula(id: number) {
    return prisma.aula.delete({
      where: { id }
    })
  }

  //Verifica se aula existe
  async exists(id: number): Promise<boolean> {
    const aula = await prisma.aula.findUnique({
      where: { id },
      select: { id: true }
    })
    return !!aula
  }

  //Verifica se o módulo existe
  async moduloExists(moduloId: number): Promise<boolean> {
    const modulo = await prisma.modulo.findUnique({
      where: { id: moduloId },
      select: { id: true }
    })
    return !!modulo
  }
}