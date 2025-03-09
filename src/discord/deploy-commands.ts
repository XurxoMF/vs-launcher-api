import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIContextMenuApplicationCommandsJSONBody, Routes } from "discord.js"
import fse from "fs-extra"
import path from "path"
import * as dotenv from "dotenv"
import { DCommandBase } from "@/discord/discord.types"

dotenv.config({ path: "/app/.env" })

const COMMAND_ID: string = ""

const commands: (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[] = []

// Load all the available commands
const folderPath = path.join(__dirname, "commands")
const commandFolders = fse.readdirSync(folderPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(folderPath, folder)
  const commandFiles = fse.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    import(filePath).then((dCommand: { default: DCommandBase }) => {
      const command = dCommand.default

      if (!command.data || !command.execute || !command.data.toJSON) {
        console.log(`🟡 Command on ${filePath} doesn't contain data or execute!`)
        return
      }

      commands.push(command.data.toJSON())
      console.log(`🟢 Command on ${filePath} successfully loaded!`)
    })
  }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN)

// Deploy commands
;(async () => {
  try {
    if (COMMAND_ID.length > 0) {
      rest
        .delete(Routes.applicationGuildCommand(process.env.DISCORD_APP_ID, process.env.DISCORD_GUILD_ID, COMMAND_ID))
        .then(() => console.log("🟢 Command successfully deleted!"))
        .catch(console.error)
    } else {
      await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.DISCORD_GUILD_ID), {
        body: commands
      })
      console.log(`🟢 Successfully refreshed/added all the app commands!`)
    }
  } catch (error) {
    console.error(error)
    console.log(`🔴 There was an error refreshing/adding the app commands!`)
  }
})()
