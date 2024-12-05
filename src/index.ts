import "reflect-metadata"
import express from "express"
import https from "https"
import cors from "cors"
import fs from "fs"
import path from "path"

// Importar las variables de entorno
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

// Imports de funciones personalizadas
import { initializeDatabase } from "@db"
import versionsRouter from "@/routes/versions"
import changelogsRouter from "@/routes/changelogs"
import newsRouter from "@/routes/news"
import settingsRouter from "@/routes/settings"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Health check
app.get("/", (req, res) => {
  res.send("Vintage Story Launcher API OK")
})

// Static files routes
app.use("/backgrounds", express.static(path.join(__dirname, `../public/backgrounds`)))

// API endpoints
app.use("/versions", versionsRouter)
app.use("/changelogs", changelogsRouter)
app.use("/news", newsRouter)
app.use("/settings", settingsRouter)

initializeDatabase()
  .then(() => {
    if (process.env.PROTOCOL === "https://") {
      if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
        throw new Error("Las variables de entorno SSL_KEY_PATH o SSL_CERT_PATH no están definidas")
      }
      const key = fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_PATH))
      const cert = fs.readFileSync(path.resolve(__dirname, process.env.SSL_CERT_PATH))
      const credentials = { key, cert }
      https.createServer(credentials, app).listen(port, () => {
        console.log(`🟢 Servidor ejecutándose en ${process.env.PROTOCOL}${process.env.DOMAIN}:${port}`)
      })
    } else {
      app.listen(port, () => {
        console.log(`🟢 Servidor ejecutándose en ${process.env.PROTOCOL}${process.env.DOMAIN}:${port}`)
      })
    }
  })
  .catch((error) => {
    console.error("🔴 Error al conectarse a la DB:", error)
  })
