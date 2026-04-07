export interface IModulo {
  id: number
  curso_id: number
  titulo: string
  ordem: number
  created_at: Date
  updated_at: Date
}

export interface IModuloCreate {
  curso_id: number
  titulo: string
  ordem?: number
}

export interface IModuloUpdate {
  titulo?: string
  ordem?: number
}