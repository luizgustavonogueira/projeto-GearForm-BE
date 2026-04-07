export interface IAula {
  id: number
  modulo_id: number
  titulo: string
  tipo?: string | null
  conteudo?: string | null
  url_video?: string | null
  ordem: number
  created_at: Date
  updated_at: Date
}

export interface IAulaCreate {
  modulo_id: number
  titulo: string
  tipo?: string
  conteudo?: string
  url_video?: string
  ordem?: number
}

export interface IAulaUpdate {
  titulo?: string
  tipo?: string
  conteudo?: string
  url_video?: string
  ordem?: number
}