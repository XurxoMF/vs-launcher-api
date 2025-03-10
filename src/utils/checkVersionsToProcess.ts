import { ADS } from "@db"
import { Versions } from "@repos"

import { processVersion, VersionURLSType } from "@/utils/precessVersion"

// Before importing any new version check if this is enabled to now overload the server.
export let IMPORTING = false

export async function checkVersionsTopRocess() {
  if (process.env.AUTOIMPORTER == "false" || IMPORTING) return

  IMPORTING = true

  const gameVersionsRepo = ADS.getRepository(Versions)

  const data = await fetch("https://api.vintagestory.at/stable-unstable.json")
  const json: VersionsType = await data.json()

  const versions = Object.keys(json).reverse()

  for (const version of versions) {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (gameVersion) continue

    const urls: VersionURLSType = {
      win: json[version]["windows"].urls.cdn,
      linux: json[version]["linux"].urls.cdn,
      macos: json[version]["mac"].urls.cdn
    }

    if (!urls.win) urls.win = json[version]["windows"].urls.local
    if (!urls.linux) urls.win = json[version]["linux"].urls.local
    if (!urls.macos) urls.win = json[version]["mac"].urls.local

    if (!urls.win || !urls.linux || !urls.macos) return console.log("🔴 Couldn't get some of the version URLS!")

    await processVersion(version, urls, Date.now())
  }
}
