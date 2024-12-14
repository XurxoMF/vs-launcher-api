import { Request, Response } from "express"
import { ADS } from "@db"
import { News } from "@repos"

export const getNews = async (req: Request, res: Response) => {
  const newsRepo = ADS.getRepository(News)

  try {
    const news = await newsRepo.find({ order: { id: "DESC" } })

    if (!news) {
      res.status(404).json({ message: "No news found" })
    } else {
      res.json(
        news.map((current_new) => {
          return <News>{
            id: current_new?.id,
            md: `${process.env.PROTOCOL}${process.env.DOMAIN}${current_new?.md}`,
            author: current_new?.author,
            title: current_new?.title,
            date: current_new?.date,
            version: current_new?.version
          }
        })
      )
    }
  } catch (error) {
    console.log("🔴 Error al buscar news:", error)
    res.status(500).json({ message: "Error fetching news" })
  }
}

export const getNewById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const newsRepo = ADS.getRepository(News)

  try {
    const current_new = await newsRepo.findOneBy({ id })

    if (!current_new) {
      res.status(404).json({ message: "New not found" })
    } else {
      res.json({
        id: current_new?.id,
        md: `${process.env.PROTOCOL}${process.env.DOMAIN}${current_new?.md}`,
        author: current_new?.author,
        title: current_new?.title,
        date: current_new?.date,
        version: current_new?.version
      })
    }
  } catch (error) {
    console.log("🔴 Error buscando el new:", error)
    res.status(500).json({ message: "Error fetching new" })
  }
}
