export interface ICurso {
  id: number
  nome_curso: string       
  descricao?: string | null
  duracao_total?: number | null
  created_at: Date
  updated_at: Date
}

export interface ICursoCreate {
  titulo: string            
  descricao?: string
  cargaHoraria?: number    
}

export interface ICursoUpdate {
  titulo?: string
  descricao?: string
  cargaHoraria?: number
}