import { Request, Response } from "express"
import { ADS } from "@db"
import { Versions } from "@repos"

export const getVersions = async (req: Request, res: Response) => {
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersions = await gameVersionsRepo.find({ order: { id: "DESC" } })

    if (!gameVersions) {
      res.status(404).json({ message: "No versions found" })
    } else {
      res.json(
        gameVersions.map((version) => {
          return {
            version: version?.version,
            type: version?.type,
            releaseDate: version?.releaseDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/versions/files/windows/${version?.version}.zip`,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/versions/files/linux/${version?.version}.zip`
          }
        })
      )
    }
  } catch (error) {
    console.log("🔴 Error al buscar versions:", error)
    res.status(500).json({ message: "Error fetching versions" })
  }
}

export const getVersionByVersion = async (req: Request, res: Response) => {
  const version = req.params.version
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (!gameVersion) {
      res.status(404).json({ message: "Version not found" })
    } else {
      res.json({
        version: gameVersion?.version,
        type: gameVersion?.type,
        releaseDate: gameVersion?.releaseDate,
        windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/versions/files/windows/${gameVersion?.version}.zip`,
        linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/versions/files/linux/${gameVersion?.version}.zip`
      })
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error)
    res.status(500).json({ message: "Error fetching version" })
  }
}
