import { Context } from "hono"
import { ADS } from "@db"
import { Versions } from "@repos"

export const getVersions = async (c: Context) => {
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersions = await gameVersionsRepo.find({ order: { releaseDate: "DESC" } })

    if (!gameVersions) {
      return c.json({ message: "No versions found" }, 404)
    } else {
      return c.json(
        gameVersions.map((version) => {
          return {
            version: version?.version,
            type: version?.type,
            releaseDate: version?.releaseDate,
            importedDate: version?.importedDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${version?.version}.zip`,
            windowsSha: version?.winSha,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${version?.version}.zip`,
            linuxSha: version?.linuxSha,
            macosArm64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-arm64/${version?.version}.zip`,
            macosArm64Sha: version?.macArm64Sha,
            macosX64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-x64/${version?.version}.zip`,
            macosX64Sha: version?.macX64Sha,
            /** @deprecated */
            macos: IsGreaterThanOrEqualTo_1_22_3(version?.version)
              ? `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-x64/${version?.version}.zip`
              : `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}.zip`,
            /** @deprecated */
            macosSha: version?.macSha ?? version?.macX64Sha
          }
        }, 200)
      )
    }
  } catch (error) {
    console.log("🔴 Error al buscar versions:", error)
    return c.json({ message: "Error fetching versions" }, 500)
  }
}

function tryParseInt(int: string) {
  if (typeof int !== 'string') return null
  try {
    return parseInt(int)
  }
  catch {
    return null
  }
}

/**
 * A simple function to determine if a version string is
 * greater-than-or-equal-to "1.22.3". It does not compare pre-release info as
 * this was not necessary for this particular version comparison.
 *
 * The release of VS1.22.3 change `mac` releases to `mac-x64` and introduced
 * `mac-arm64`. This required a change in our asset paths. Releases prior to
 * VS1.22.3 will be served via the original paths while releases of VS1.22.3 and
 * later will route Mac releases to ISA-specific archives.
 */
function IsGreaterThanOrEqualTo_1_22_3(version: string): boolean {
  const parts = version.split(/\.|-/)

  const versionObject = {
    major: tryParseInt(parts[0]) ?? -1,
    minor: tryParseInt(parts[1]) ?? -1,
    patch: tryParseInt(parts[2]) ?? -1,
    prerelease: parts[3] != null ? `-${parts[3]}` : null
  }

  if (versionObject.major > 1) return true
  else if (versionObject.major < 0) return false
  // versionObject.major === 1
  else if (versionObject.minor > 22) return true
  else if (versionObject.minor < 22) return false
  else if (versionObject.minor === 22) return versionObject.patch >= 3
  else
    return false
}

export const getVersionByVersion = async (c: Context) => {
  const version = c.req.param("version")
  const gameVersionsRepo = ADS.getRepository(Versions)

  try {
    const gameVersion = await gameVersionsRepo.findOneBy({ version })

    if (!gameVersion) {
      return c.json({ message: "Version not found" }, 404)
    } else {
      return c.json(
        {
          version: gameVersion?.version,
          type: gameVersion?.type,
          releaseDate: gameVersion?.releaseDate,
          importedDate: gameVersion?.importedDate,
          windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${gameVersion?.version}.zip`,
          windowsSha: gameVersion?.winSha,
          linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${gameVersion?.version}.zip`,
          linuxSha: gameVersion?.linuxSha,
          macosArm64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-arm64/${gameVersion?.version}.zip`,
          macosArm64Sha: gameVersion?.macArm64Sha,
          macosX64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-x64/${gameVersion?.version}.zip`,
          macosX64Sha: gameVersion?.macX64Sha,
          /** @deprecated */
          macos: IsGreaterThanOrEqualTo_1_22_3(gameVersion?.version)
            ? `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos-x64/${gameVersion?.version}.zip`
            : `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion?.version}.zip`,
          /** @deprecated */
          macosSha: gameVersion?.macSha ?? gameVersion?.macX64Sha
        },
        200
      )
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error)
    return c.json({ message: "Error fetching version" }, 500)
  }
}
