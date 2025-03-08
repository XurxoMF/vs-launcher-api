import { Context } from "hono"
import { ADS } from "@db"
import { Versions } from "@repos"

export const getVersions = async (c: Context) => {
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersions = await gameVersionsRepo.find({ order: { id: "DESC" } })

    if (!gameVersions) {
      return c.json({ message: "No versions found" }, 404)
    } else {
      return c.json(
        gameVersions.map((version) => {
          return {
            version: version?.version,
            type: version?.type,
            releaseDate: version?.releaseDate,
            importedDate: version?.importedDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}${process.env.DOMAIN === "localhost" && "3000"}/versions/files/windows/${version?.version}.zip`,
            windowsSha: version?.winSha,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}${process.env.DOMAIN === "localhost" && "3000"}/versions/files/linux/${version?.version}.zip`,
            linuxSha: version?.linuxSha
          }
        }, 200)
      )
    }
  } catch (error) {
    console.log("🔴 Error al buscar versions:", error)
    return c.json({ message: "Error fetching versions" }, 500)
  }
}

export const getVersionByVersion = async (c: Context) => {
  const version = c.req.param("version")
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (!gameVersion) {
      return c.json({ message: "Version not found" }, 404)
    } else {
      return c.json(
        {
          version: gameVersion?.version,
          type: gameVersion?.type,
          releaseDate: gameVersion?.releaseDate,
          importedDate: gameVersion?.importedDate,
          windows: `${process.env.PROTOCOL}${process.env.DOMAIN}${process.env.DOMAIN === "localhost" && "3000"}/versions/windows/${gameVersion?.version}.zip`,
          windowsSha: gameVersion?.winSha,
          linux: `${process.env.PROTOCOL}${process.env.DOMAIN}${process.env.DOMAIN === "localhost" && "3000"}/versions/linux/${gameVersion?.version}.zip`,
          linuxSha: gameVersion?.linuxSha
        },
        200
      )
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error)
    return c.json({ message: "Error fetching version" }, 500)
  }
}
