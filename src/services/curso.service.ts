import prisma from '../config/prisma'
import { ICursoCreate, ICursoUpdate } from '../types/curso.types'

export class CursoService {
 
  //Cria um novo curso
  async createCurso(data: ICursoCreate) {
    return prisma.curso.create({
      data: {
        nome_curso: data.titulo,     
        descricao: data.descricao,
        duracao_total: data.cargaHoraria
      }
    })
  }

//Lista todos os cursos
  async listCursos(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    const [cursos, total] = await Promise.all([
      prisma.curso.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }, 
        include: {
          _count: {
            select: { modulos: true, matriculas: true }
          }
        }
      }),
      prisma.curso.count()
    ])

    return {
      data: cursos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  //Busca curso por ID
  async findById(id: number) {
    return prisma.curso.findUnique({
      where: { id },
      include: {
        modulos: {
          orderBy: { ordem: 'asc' },
          include: {
            aulas: {
              orderBy: { ordem: 'asc' }
            }
          }
        },
        _count: {
          select: { matriculas: true }
        }
      }
    })
  }

 //Atualiza um curso
  async updateCurso(id: number, data: ICursoUpdate) {
    return prisma.curso.update({
      where: { id },
      data: {
        nome_curso: data.titulo,
        descricao: data.descricao,
        duracao_total: data.cargaHoraria
      }
    })
  }

  //Deleta um curso
  async deleteCurso(id: number) {
    return prisma.curso.delete({
      where: { id }
    })
  }

  //Verifica se o curso existe
  async exists(id: number): Promise<boolean> {
    const curso = await prisma.curso.findUnique({
      where: { id },
      select: { id: true }
    })
    return !!curso
  }
}