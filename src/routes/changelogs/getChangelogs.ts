import { Request, Response } from "express"
import { ADS } from "@db"
import { Changelogs } from "@repos"

export const getChangelogs = async (req: Request, res: Response) => {
  const changelogsRepo = ADS.getRepository(Changelogs)

  try {
    const changelogs = await changelogsRepo.find()

    if (!changelogs) {
      res.status(404).json({ message: "No changelogs found" })
    } else {
      res.json(
        changelogs.map((changelog) => {
          return <Changelogs>{
            md: `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${changelog?.md}`,
            author: changelog?.author,
            title: changelog?.title,
            date: changelog?.date,
            version: changelog?.version
          }
        })
      )
    }
  } catch (error) {
    console.log("🔴 Error buscando changelogs:", error)
    res.status(500).json({ message: "Error fetching versions" })
  }
}

export const getChangelogsByVersion = async (req: Request, res: Response) => {
  const version = req.params.version
  const changelogsRepo = ADS.getRepository(Changelogs)
  const parsedVersion = version.replace(/-/g, ".")

  try {
    const changelog = await changelogsRepo.findOneBy({ version: parsedVersion })

    if (!changelog) {
      res.status(404).json({ message: "Changelog not found" })
    } else {
      res.json({
        md: `${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}${changelog?.md}`,
        author: changelog?.author,
        title: changelog?.title,
        date: changelog?.date,
        version: changelog?.version
      })
    }
  } catch (error) {
    console.log("🔴 Error buscando el changelog:", error)
    res.status(500).json({ message: "Error fetching changelog" })
  }
}
