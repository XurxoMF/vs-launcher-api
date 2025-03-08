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
import { initializeDatabase, ADS } from "@db"
import { Versions } from "@repos"

import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers"
import { extractLinuxFile, extractMacFile, extractWindowsFile } from "@/utils/extractManagers"

// Route imports
import versionsRouter from "@/routes/versions"

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

app.get("/test", async (c) => {
  test()
  return c.json({ status: 200, message: "Recived" }, 200)
})

async function test() {
  const gameVersionsRepo = ADS.getRepository(Versions)

  const data = await fetch("https://api.vintagestory.at/stable-unstable.json")
  const json: DVersionsType = await data.json()

  const versions = Object.keys(json)

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

  const version = "1.20.5-rc.3"
  const versionData = json[version]

  const winFile = await downloadWindowsFile(version, versionData["windows"])
  const linuxFile = await downloadLinuxFile(version, versionData["linux"])
  const macFile = await downloadMacFile(version, versionData["mac"])

  if (!winFile || !linuxFile || !macFile) return console.log("🔴 Some of the OS versions couldn't be downloaded!")

  const winOut = await extractWindowsFile(version, winFile)
  const linuxOut = await extractLinuxFile(version, linuxFile)
  const macOut = await extractMacFile(version, macFile)

  if (!winOut || !linuxOut || !macOut) return console.log("🔴 Some of the OS versions couldn't be extracted!")

  console.log(`🟢 All OS versions downloaded and extracted!:\n${winOut}\n${linuxOut}\n${macOut}`)
}

// Initialize server
;(async () => {
  try {
    await initializeDatabase()

    serve({ fetch: app.fetch, port: 3000 })

    console.log(`🟢 Server running on ${process.env.PROTOCOL}${process.env.DOMAIN}:${3000}`)
  } catch (err) {
    console.error("🔴 Error starting API:", err)
  }
})()
