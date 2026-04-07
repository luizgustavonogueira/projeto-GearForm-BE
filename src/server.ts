import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

// Importar rotas
import userRoutes from './routes/userRoutes'
import cursoRoutes from './routes/cursoRoutes'
import moduloRoutes from './routes/moduloRoutes'
import aulaRoutes from './routes/aulaRoutes'
const app = express()

app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/users', userRoutes)
app.use('/api/cursos', cursoRoutes)
app.use('/api/modulos', moduloRoutes)
app.use('/api/aulas', aulaRoutes)

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app