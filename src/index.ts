import "reflect-metadata"
import express from "express"
import https from "https"
import cors from "cors"
import fs from "fs"
import path from "path"
const WebSocket = require("ws")

// Importar las variables de entorno
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

// Imports de funciones personalizadas
import { initializeDatabase, ADS } from "@db"
// import { GameVersions } from "@repos"
import versionsRouter from "@/routes/versions"
// import ImportGameVersions from "./gameVersionsImporter.json"
import newsRouter from "@/routes/news"
import settingsRouter from "@/routes/settings"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Health check
app.get("/", async (req, res) => {
  // const gameVersionsRepo = ADS.getRepository(GameVersions)

  // for (let i = ImportGameVersions.length - 1; i >= 0; i--) {
  //   const newVersion = ImportGameVersions[i]
  //   gameVersionsRepo.create(newVersion)
  //   await gameVersionsRepo.save(newVersion)
  // }

  res.send("Vintage Story Launcher API OK")
})

// API endpoints
app.use("/versions", versionsRouter)
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

      const server = https.createServer(credentials, app)

      const wss = new WebSocket.Server({ server })

      wss.on("connection", (ws: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void }) => {
        ws.on("message", (message) => {
          console.log("received: %s", message)
        })
        ws.send("something")
      })

      server.listen(port, () => {
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
