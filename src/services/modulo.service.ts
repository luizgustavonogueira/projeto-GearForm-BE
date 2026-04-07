import prisma from '../config/prisma'
import { IModuloCreate, IModuloUpdate } from '../types/modulo.types'

export class ModuloService {
 
  //Cria novo módulo

  async createModulo(data: IModuloCreate) {
    // Busca a maior ordem existente para o curso
    const lastModulo = await prisma.modulo.findFirst({
      where: { curso_id: data.curso_id },
      orderBy: { ordem: 'desc' }
    })
    
    const ordem = data.ordem ?? (lastModulo ? lastModulo.ordem + 1 : 1)
    
    return prisma.modulo.create({
      data: {
        curso_id: data.curso_id,
        titulo: data.titulo,
        ordem
      }
    })
  }

 //Lista módulo de um curso

  async listModulosByCurso(cursoId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    const [modulos, total] = await Promise.all([
      prisma.modulo.findMany({
        where: { curso_id: cursoId },
        skip,
        take: limit,
        orderBy: { ordem: 'asc' },
        include: {
          _count: {
            select: { aulas: true }
          }
        }
      }),
      prisma.modulo.count({ where: { curso_id: cursoId } })
    ])

    return {
      data: modulos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  //Busca módulo por ID

  async findById(id: number) {
    return prisma.modulo.findUnique({
      where: { id },
      include: {
        curso: {
          select: { id: true, nome_curso: true }
        },
        aulas: {
          orderBy: { ordem: 'asc' }
        }
      }
    })
  }

 //Atualiza o módulo

  async updateModulo(id: number, data: IModuloUpdate) {
    return prisma.modulo.update({
      where: { id },
      data
    })
  }

  //Deleta o módulo
  
  async deleteModulo(id: number) {
    return prisma.modulo.delete({
      where: { id }
    })
  }

  //Verifica se o módulo existe

  async exists(id: number): Promise<boolean> {
    const modulo = await prisma.modulo.findUnique({
      where: { id },
      select: { id: true }
    })
    return !!modulo
  }

//Verifica se o curso existe

  async cursoExists(cursoId: number): Promise<boolean> {
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { id: true }
    })
    return !!curso
  }
}