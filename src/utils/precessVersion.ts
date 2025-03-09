import { ADS } from "@db"
import { Versions } from "@repos"
import { EmbedBuilder, WebhookClient } from "discord.js"

import { EMBED_COLORS, EMOJIS } from "@/discord/config.data"

import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers"
import { extractLinuxFile, extractMacFile, extractWindowsFile } from "@/utils/extractManagers"
import { compressLinuxFile, compressMacFile, compressWindowsFile } from "@/utils/compressManager"
import { deleteTmpFolder } from "@/utils/deleteManager"
import { generateSHA256 } from "@/utils/shaGeneratorManager"

export type VersionURLSType = { win: string; linux: string; macos: string }

export async function processVersion(version: string, urls: VersionURLSType, releaseDate: number): Promise<boolean> {
  const webhook = new WebhookClient({ url: process.env.DISCORD_PUBLIC_UPDATES_WEBHOOK })
  let content = ``
  const embed = new EmbedBuilder().setTitle(`VS v${version} · IMPORTING`).setDescription(`${EMOJIS.LOADING} Preparing everything!`).setColor(EMBED_COLORS.VSL).setTimestamp(new Date())
  const message = await webhook.send({ embeds: [embed] })

  try {
    const gameVersionsRepo = ADS.getRepository(Versions)

    // Download Windows file
    embed.setDescription(content + `${EMOJIS.LOADING} Downloading Windows file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winFile = await downloadWindowsFile(version, urls.win)
    if (!winFile) {
      embed.setDescription((content += `:red_circle: Windows file failed to download!\n`))
      await webhook.editMessage(message.id, { embeds: [embed] })
      throw new Error("Windows file failed to download!")
    }
    embed.setDescription((content += `:green_circle: Windows file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Download Linux file
    embed.setDescription(content + `${EMOJIS.LOADING} Downloading Linux file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const linuxFile = await downloadLinuxFile(version, urls.linux)
    if (!linuxFile) {
      embed.setDescription((content += `:red_circle: Linux file failed to download!\n`))
      await webhook.editMessage(message.id, { embeds: [embed] })
      throw new Error("Linux file failed to download!")
    }
    embed.setDescription((content += `:green_circle: Linux file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Download MacOS file
    embed.setDescription(content + `${EMOJIS.LOADING} Downloading MacOS file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macFile = await downloadMacFile(version, urls.macos)
    if (!macFile) {
      embed.setDescription((content += `:red_circle: MacOS file failed to download!\n`))
      await webhook.editMessage(message.id, { embeds: [embed] })
      throw new Error("MacOS file failed to download!")
    }
    embed.setDescription((content += `:green_circle: MacOS file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Extract Windows file
    embed.setDescription(content + `${EMOJIS.LOADING} Extracting Windows file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winOut = await extractWindowsFile(version, winFile)
    if (!winOut) {
      embed.setDescription((content += `:red_circle: Windows file failed to extract!\n`))
      await webhook.editMessage(message.id, { embeds: [embed] })
      throw new Error("Windows file failed to extract!")
    }
    embed.setDescription((content += `:green_circle: Windows file extracted!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // TODO: Continue with logs...
    const linuxOut = await extractLinuxFile(version, linuxFile)
    const macOut = await extractMacFile(version, macFile)

    if (!winOut || !linuxOut || !macOut) {
      console.log("🔴 Some of the OS versions couldn't be extracted!")
      return false
    }

    const winZip = await compressWindowsFile(version, winOut)
    const linuxZip = await compressLinuxFile(version, linuxOut)
    const macZip = await compressMacFile(version, macOut)

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
    console.log("🔴 There was an error processing the files!")

    const tmpDeleted = await deleteTmpFolder()
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!")

    return false
  } finally {
    const tmpDeleted = await deleteTmpFolder()
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!")

    console.log("🟢 All OS versions added to the DB!")
    return true
  }
}
