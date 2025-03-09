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
  const json: DVersionsType = await data.json()

  const versions = Object.keys(json)

  for (const version of versions) {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (gameVersion) {
      console.log(`Versión ${version} ${gameVersion.id} encontrada`)
      continue
    }

    const urls: VersionURLSType = {
      win: json[version]["windows"].urls.cdn,
      linux: json[version]["linux"].urls.cdn,
      macos: json[version]["mac"].urls.cdn
    }

    await processVersion(version, urls, Date.now())
  }
}
