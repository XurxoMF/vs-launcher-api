import { ADS } from "@db"
import { Versions } from "@repos"

import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers"
import { extractLinuxFile, extractMacFile, extractWindowsFile } from "@/utils/extractManagers"
import { compressLinuxFile, compressMacFile, compressWindowsFile } from "@/utils/compressManager"
import { deleteTmpFolder } from "@/utils/deleteManager"
import { generateSHA256 } from "@/utils/shaGeneratorManager"

export type VersionURLSType = { win: string; linux: string; macos: string }

export async function processVersion(version: string, urls: VersionURLSType, releaseDate: number): Promise<boolean> {
  const gameVersionsRepo = ADS.getRepository(Versions)

  const winFile = await downloadWindowsFile(version, urls.win)
  const linuxFile = await downloadLinuxFile(version, urls.linux)
  const macFile = await downloadMacFile(version, urls.macos)

  if (!winFile || !linuxFile || !macFile) {
    console.log("🔴 Some of the OS versions couldn't be downloaded!")
    return false
  }

  const winOut = await extractWindowsFile(version, winFile)
  const linuxOut = await extractLinuxFile(version, linuxFile)
  const macOut = await extractMacFile(version, macFile)

  if (!winOut || !linuxOut || !macOut) {
    console.log("🔴 Some of the OS versions couldn't be extracted!")
    return false
  }

  const winZip = await compressWindowsFile(version, winOut)
  const linuxZip = await compressLinuxFile(version, linuxOut)
  const macZip = await compressMacFile(version, macOut)

  // Delete TMP folder, if it fails just notify and continue.
  const tmpDeleted = await deleteTmpFolder()
  if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!")

  if (!winZip || !linuxZip || !macZip) {
    console.log("🔴 Some of the OS versions couldn't be compressed!")
    return false
  }

  const winSha = await generateSHA256(winZip)
  const linuxSha = await generateSHA256(linuxZip)
  const macSha = await generateSHA256(macZip)

  if (!winSha || !linuxSha || !macSha) {
    console.log("🔴 Some of the OS versions failed generating their SHA256!")
    return false
  }

  console.log("🟢 All OS versions processed! Adding them to the DB!")

  // Get the type of the version. "stable", "rc" or "pre"
  let type: string
  const versionParts = version.split("-")

  if (versionParts.length < 2) {
    type = "stable"
  } else {
    const subVersionParts = versionParts[1].split(".")
    if (subVersionParts.length < 1) {
      type = "stable"
    } else {
      type = subVersionParts[0]
    }
  }

  try {
    await gameVersionsRepo.insert({
      version,
      type,
      releaseDate,
      importedDate: Date.now(),
      winSha,
      linuxSha,
      macSha
    })
  } catch (err) {
    console.log("🔴 Error adding the OS versions to the DB!")
    return false
  }

  console.log("🟢 All OS versions added to the DB!")
  return true
}
