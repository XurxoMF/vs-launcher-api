import express, { Router } from "express"
import path from "path"
import { getChangelogs, getChangelogsByVersion } from "./getChangelogs"

const router = Router()

router.get("/", getChangelogs)
router.get("/:version", getChangelogsByVersion)
router.use("/files", express.static(path.join(__dirname, `../../../public/changelogs`)))

export default router
