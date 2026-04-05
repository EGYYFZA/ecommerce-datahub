import express from 'express'
import cors from 'cors'
import jsonServer from 'json-server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const router = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

app.use(cors())
app.use(express.json())
app.use(middlewares)
app.use(router)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
