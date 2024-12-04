import express, { Router } from "express"
import { getVersionByVersion, getVersions } from "./getVersions"
import path from "path"

const router = Router()

router.get("/", getVersions)
router.get("/:version", getVersionByVersion)
router.use("/files", express.static(path.join(__dirname, `../../../public/versions`)))

export default router
