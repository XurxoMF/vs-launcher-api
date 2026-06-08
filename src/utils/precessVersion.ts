import { ADS } from "@db"
import { Versions } from "@repos"
import { EmbedBuilder, WebhookClient } from "discord.js"

import { EMBED_COLORS, EMOJIS } from "@/discord/config.data"

import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers"
import { extractLinuxFile, extractMacFile, extractWindowsFile } from "@/utils/extractManagers"
import { compressLinuxFile, compressMacFile, compressWindowsFile } from "@/utils/compressManager"
import { deleteTmpFolder } from "@/utils/deleteManager"
import { generateSHA256 } from "@/utils/shaGeneratorManager"

export type VersionURLSType = {
  win: string
  linux: string
  macosArm64?: string | null | undefined
  macosX64: string
}

export async function processVersion(version: string, urls: VersionURLSType, releaseDate: number): Promise<boolean> {
  console.log(`💡 Downloading VS v${version}!`)

  let content = `New VS Version available! ${version}`
  let embedDesc = ``

  const embed = new EmbedBuilder().setTitle(`v${version} · IMPORTING...`).setDescription(`${EMOJIS.LOADING} Preparing everything!`).setColor(EMBED_COLORS.VSL).setTimestamp(new Date())

  const webhook = new WebhookClient({ url: process.env.DISCORD_PUBLIC_UPDATES_WEBHOOK })
  const message = await webhook.send({ content, embeds: [embed] })

  try {
    const gameVersionsRepo = ADS.getRepository(Versions)

    // Download Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading Windows file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winFile = await downloadWindowsFile(version, urls.win)
    if (!winFile) throw new Error("❌ · Windows file failed to download!")
    embed.setDescription((embedDesc += `✅ · Windows file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Download Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading Linux file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const linuxFile = await downloadLinuxFile(version, urls.linux)
    if (!linuxFile) throw new Error("❌ · Linux file failed to download!")
    embed.setDescription((embedDesc += `✅ · Linux file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Download MacOS-ARM64 file; Null when Vintage Story version < 1.22.3
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading MacOS-arm64 file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    // ? Should this be a warning instead of an error?
    if (!urls.macosArm64) throw new Error("❌ · MacOS-ARM64 file unavailable!")
    const macArm64File = urls.macosArm64 != null ? null : await downloadMacFile(version, urls.macosArm64)
    if (!macArm64File) throw new Error("❌ · MacOS-ARM64 file failed to download!")
    embed.setDescription((embedDesc += `✅ · MacOS-ARM64 file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Download MacOS-x64 file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading MacOS-x64 file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macX64File = await downloadMacFile(version, urls.macosX64)
    if (!macX64File) throw new Error("❌ · MacOS-x64 file failed to download!")
    embed.setDescription((embedDesc += `✅ · MacOS-x64 file downloaded!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Extract Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting Windows file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winOut = await extractWindowsFile(version, winFile)
    if (!winOut) throw new Error("❌ · Windows file failed to extract!")
    embed.setDescription((embedDesc += `✅ · Windows file extracted!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Extract Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting Linux file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const linuxOut = await extractLinuxFile(version, linuxFile)
    if (!linuxOut) throw new Error("❌ · Linux file failed to extract!")
    embed.setDescription((embedDesc += `✅ · Linux file extracted!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Extract MacOS-ARM64 file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting MacOS-ARM64 file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macArm64Out = await extractMacFile(version, macArm64File)
    if (!macArm64Out) throw new Error("❌ · MacOS-ARM64 file failed to extract!")
    embed.setDescription((embedDesc += `✅ · MacOS-ARM64 file extracted!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Extract MacOS-x64 file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting MacOS-x64 file!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macX64Out = await extractMacFile(version, macX64File)
    if (!macX64Out) throw new Error("❌ · MacOS-x64 file failed to extract!")
    embed.setDescription((embedDesc += `✅ · MacOS-x64 file extracted!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Compress Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing Windows VS Version!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winZip = await compressWindowsFile(version, winOut)
    if (!winZip) throw new Error("❌ · Windows VS Version failed to compress!")
    embed.setDescription((embedDesc += `✅ · Windows VS Version compressed!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Compress Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing Linux VS Version!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const linuxZip = await compressLinuxFile(version, linuxOut)
    if (!linuxZip) throw new Error("❌ · Linux VS Version failed to compress!")
    embed.setDescription((embedDesc += `✅ · Linux VS Version compressed!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Compress MacOS-ARM64 file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing MacOS-ARM64 VS Version!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macArm64Zip = await compressMacFile(version, macArm64Out, 'arm64')
    if (!macArm64Zip) throw new Error("❌ · MacOS-ARM64 VS Version failed to compress!")
    embed.setDescription((embedDesc += `✅ · MacOS-ARM64 VS Version compressed!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Compress MacOS-x64 file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing MacOS-x64 VS Version!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macX64Zip = await compressMacFile(version, macX64Out, "x64")
    if (!macX64Zip) throw new Error("❌ · MacOS-x64 VS Version failed to compress!")
    embed.setDescription((embedDesc += `✅ · MacOS-x64 VS Version compressed!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Generate Windows SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating Windows SHA256!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const winSha = await generateSHA256(winZip)
    if (!winSha) throw new Error("❌ · Windows SHA256 could not be generated!")
    embed.setDescription((embedDesc += `✅ · Windows SHA256 generated!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Generate Linux SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating Linux SHA256!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const linuxSha = await generateSHA256(linuxZip)
    if (!linuxSha) throw new Error("❌ · Linux SHA256 could not be generated!")
    embed.setDescription((embedDesc += `✅ · Linux SHA256 generated!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Generate MacOS-ARM64 SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating MacOS-ARM64 SHA256!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macArm64Sha = await generateSHA256(macArm64Zip)
    if (!macArm64Sha) throw new Error("❌ · MacOS-ARM64 SHA256 could not be generated!")
    embed.setDescription((embedDesc += `✅ · MacOS-ARM64 SHA256 generated!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Generate MacOS-x64 SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating MacOS-x64 SHA256!`)
    await webhook.editMessage(message.id, { embeds: [embed] })
    const macX64Sha = await generateSHA256(macX64Zip)
    if (!macX64Sha) throw new Error("❌ · MacOS-x64 SHA256 could not be generated!")
    embed.setDescription((embedDesc += `✅ · MacOS-x64 SHA256 generated!\n`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    // Add VS Versions to the DB
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Saving VS Versions on the database!`)
    await webhook.editMessage(message.id, { embeds: [embed] })

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
      macArm64Sha,
      macX64Sha
    } satisfies Omit<Versions, 'id' | 'createdAt' | 'updatedAt'>)

    embed.setDescription((embedDesc += `✅ · VS Version saved!\n\nYou can now download it on VS Launcher!`))
    await webhook.editMessage(message.id, { embeds: [embed] })
    await webhook.send({ content: `<@&1339150731076435990> New VS Version ready!` })

    console.log(`🟢 VS v${version} added successfully!`)
  } catch (err: any) {
    console.log(err)

    embed.setDescription((embedDesc += `❌ · There was an error importing this version!`))
    await webhook.editMessage(message.id, { embeds: [embed] })

    const tmpDeleted = await deleteTmpFolder()
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!")

    return false
  } finally {
    const tmpDeleted = await deleteTmpFolder()
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!")

    return true
  }
}
