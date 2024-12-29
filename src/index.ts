import "reflect-metadata"
import express from "express"
import cors from "cors"
import path from "path"

// Importar las variables de entorno
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

// Imports de funciones personalizadas
import { initializeDatabase, ADS } from "@db"
import versionsRouter from "@/routes/versions"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Health check
app.get("/", async (req, res) => {
  res.send("Vintage Story Launcher API OK")
})

// API endpoints
app.use("/versions", versionsRouter)

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🟢 Servidor ejecutándose en ${process.env.PROTOCOL}${process.env.DOMAIN}:${port}`)
    })
  })
  .catch((error) => {
    console.error("🔴 Error al conectarse a la DB:", error)
  })
