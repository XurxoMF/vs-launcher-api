import { Request, Response } from "express"
import { ADS } from "@db"
import { GameVersions } from "@repos"

export const getVersions = async (req: Request, res: Response) => {
  const gameVersionsRepo = ADS.getRepository(GameVersions)

  try {
    const gameVersions = await gameVersionsRepo.find({ order: { id: "DESC" } })

    if (!gameVersions) {
      res.status(404).json({ message: "No versions found" })
    } else {
      res.json(
        gameVersions.map((version) => {
          return <GameVersions>{
            version: version?.version,
            windows: version?.windows ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${version?.windows}` : null,
            linux: version?.linux ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${version?.linux}` : null,
            macos: version?.linux ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${version?.macos}` : null
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
  const gameVersionsRepo = ADS.getRepository(GameVersions)

  try {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (!gameVersion) {
      res.status(404).json({ message: "Version not found" })
    } else {
      res.json({
        version: gameVersion?.version,
        windows: gameVersion?.windows ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${gameVersion?.windows}` : null,
        linux: gameVersion?.linux ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${gameVersion?.linux}` : null,
        macos: gameVersion?.linux ? `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${gameVersion?.macos}` : null
      })
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error)
    res.status(500).json({ message: "Error fetching version" })
  }
}
