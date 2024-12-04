import { Router } from "express"
import { getSettingByKey, getSettings } from "./getSettings"

const router = Router()

router.get("/", getSettings)
router.get("/:key", getSettingByKey)

export default router
