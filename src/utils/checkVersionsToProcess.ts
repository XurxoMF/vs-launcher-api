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

  // If a version fails to import 3 times it'll be added here so it's not imported anymore until an API restart
  let ignoredVersions: string[] = []

  for (const version of versions) {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (gameVersion && !ignoredVersions.includes(version)) continue

    let processing = true
    let fails = 0

    while (processing && fails < 3) {
      const winUrl = json[version].windows.urls.cdn ?? json[version].windows.urls.local
      const linuxUrl = json[version].linux.urls.cdn ?? json[version].linux.urls.local
      const macosArm64Url = json[version]["mac-arm64"]?.urls.cdn ?? json[version]["mac-arm64"]?.urls.local
      // "mac" no longer exists upstream; superseded by "mac-x64"
      const macosX64Url = json[version]["mac-x64"]?.urls.cdn ?? json[version]["mac-x64"]?.urls.local

      if (!winUrl || !linuxUrl || !macosArm64Url || !macosX64Url) {
        console.log(`🔴 Couldn't get some of the URLS for the version v${version}!`)
        continue
      }

      const urls: VersionURLSType = {
        win: winUrl,
        linux: linuxUrl,
        macosArm64: macosArm64Url,
        macosX64: macosX64Url
      }

      const imported = await processVersion(version, urls, Date.now())

      if (imported) {
        processing = false
      } else {
        fails++
      }
    }
  }

  IMPORTING = false
}
