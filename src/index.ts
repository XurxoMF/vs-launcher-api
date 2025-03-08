import "reflect-metadata"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { serveStatic } from "hono/bun"
import { serve } from "bun"
import * as dotenv from "dotenv"
import { resolve } from "path"

// ENV imports
dotenv.config({ path: resolve(__dirname, "../.env") })

// Database imports
import { initializeDatabase, ADS } from "@db"
import { Versions } from "@repos"

// Route imports
import versionsRouter from "@/routes/versions"
import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers"

const app = new Hono()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())

// Serve public files
app.use(
  "/files/*",
  serveStatic({
    root: resolve(__dirname, `../public`),
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

app.get("/test", async (c) => {
  test()
  return c.json({ status: 200, message: "Recived" }, 200)
})

async function test() {
  const gameVersionsRepo = ADS.getRepository(Versions)

  const data = await fetch("https://api.vintagestory.at/stable-unstable.json")
  const json: DVersionsType = await data.json()

  // const versions = Object.keys(json)

  // for (const version of versions) {
  //   const gameVersion = await gameVersionsRepo.findOneBy({ version })

  //   if (gameVersion) {
  //     console.log(`Versión ${version} ${gameVersion.id} encontrada`)
  //     continue
  //   }

  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 2000)
  //   })

  //   console.log(`No existe la versión ${version}`)
  // }

  const version = json["1.20.5-rc.3"]

  const winRes = await downloadWindowsFile("1.20.5-rc.3", version["windows"])
  const linuxRes = await downloadLinuxFile("1.20.5-rc.3", version["linux"])
  const macRes = await downloadMacFile("1.20.5-rc.3", version["mac"])

  console.log(winRes, linuxRes, macRes)
}

// Initialize server
initializeDatabase()
  .then(() => {
    serve({ fetch: app.fetch, port })
    console.log(`🟢 Server running on ${process.env.PROTOCOL}${process.env.DOMAIN}:${port}`)
  })
  .catch((error) => {
    console.error("🔴 Error connecting DB:", error)
  })
