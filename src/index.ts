import "reflect-metadata"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { serveStatic } from "hono/bun"
import { serve } from "bun"
import * as dotenv from "dotenv"
import { resolve } from "path"

// ENV imports
dotenv.config({ path: "/app/.env" })

// Database imports
import { initializeDatabase } from "@db"

// Function imports
import { checkVersionsTopRocess, IMPORTING } from "@/utils/checkVersionsToProcess"

// Route imports
import versionsRouter from "@/routes/versions"
import { startDClient } from "./discord"

const app = new Hono()

// Middleware
app.use(cors())

// Serve public files
app.use(
  "/files/*",
  serveStatic({
    root: resolve(__dirname, `/app/public`),
    rewriteRequestPath: (path) => {
      return path.replace(/^\/files/, "")
    }
  })
)

// Health check
app.get("/", (c) => {
  return c.json({ status: 200, message: "Vintage Story Launcher API OK" }, 200)
})

// Ruotes
app.route("/versions", versionsRouter)

// Check for new versions and import them if they are not added yet.
setInterval(checkVersionsTopRocess, 5000)

// Initialize server
;(async () => {
  try {
    await initializeDatabase()

    await startDClient()

    serve({ fetch: app.fetch, port: 3000 })
    console.log(`🟢 Server running on ${process.env.PROTOCOL}${process.env.DOMAIN}!`)
  } catch (err) {
    console.error("🔴 Error starting API:", err)
  }
})()
