import express, { Router } from "express"
import { getNewById, getNews } from "./getNews"
import path from "path"

const router = Router()

router.get("/", getNews)
router.get("/:id", getNewById)
router.use("/files", express.static(path.join(__dirname, `../../../public/news`)))

export default router
