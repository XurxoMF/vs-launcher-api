import { Request, Response } from "express"
import { ADS } from "@db"
import { Settings } from "@repos"

export const getSettings = async (req: Request, res: Response) => {
  const settingsRepo = ADS.getRepository(Settings)

  try {
    const settings = await settingsRepo.find()

    if (!settings) {
      res.status(404).json({ message: "No settings found" })
    } else {
      res.json(
        settings.map((setting) => {
          return <Settings>{
            key: setting?.key,
            value: setting?.value
          }
        })
      )
    }
  } catch (error) {
    console.log("🔴 Error al buscar settings:", error)
    res.status(500).json({ message: "Error fetching settings" })
  }
}

export const getSettingByKey = async (req: Request, res: Response) => {
  const key = req.params.key
  const settingsRepo = ADS.getRepository(Settings)

  try {
    const setting = await settingsRepo.findOneBy({ key })

    if (!setting) {
      res.status(404).json({ message: "Setting not found" })
    } else {
      res.json({
        key: setting?.key,
        value: setting?.value
      })
    }
  } catch (error) {
    console.log("🔴 Error buscando el setting:", error)
    res.status(500).json({ message: "Error fetching setting" })
  }
}
