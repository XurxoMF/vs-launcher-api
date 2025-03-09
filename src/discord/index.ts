import { Collection, GatewayIntentBits } from "discord.js"
import path from "path"
import fse from "fs-extra"
import { DBaseEventType, DCommandBase, DCommandChatInput, DCommandMessageContextMenu, DCommandTypes, DCommandUserContextMenu } from "@/discord/discord.types"
import DClientClass from "@/discord/classes/DClient"

let DCLIENT_READY: Promise<DClientClass> | null = null

const intents = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent
  ]
}

const DClient: DClientClass = new DClientClass(intents, new Collection(), new Collection(), new Collection(), new Collection())

// Command imports
const folderPath = path.join(__dirname, "commands")
const commandFolders = fse.readdirSync(folderPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(folderPath, folder)
  const commandsFiles = fse.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"))

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file)
    import(filePath).then((dCommand: { default: DCommandBase }) => {
      const command = dCommand.default

      if (!command.data || !command.execute) {
        console.log(`🟡 Command ${filePath} doesn't contains data or execute!`)
        return
      }

      switch (command.type) {
        case DCommandTypes.ChatInput:
          DClient.comandosChatImput.set(command.data.name, <DCommandChatInput>command)
          break
        case DCommandTypes.MessageContextMenu:
          DClient.comandosMessageContextMenu.set(command.data.name, <DCommandMessageContextMenu>command)
          break
        case DCommandTypes.UserContextMenu:
          DClient.comandosUserContextMenu.set(command.data.name, <DCommandUserContextMenu>command)
        default:
          break
      }
    })
    const command: DCommandBase = require(filePath)
  }
}

// Event handler
const eventsPath = path.join(__dirname, "events")
const eventFiles = fse.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event: DBaseEventType = require(filePath)
  if (event.once) {
    DClient.once(event.name, (...args: any) => event.execute(DClient, ...args))
  } else {
    DClient.on(event.name, (...args: any) => event.execute(DClient, ...args))
  }
}

export function startDClient() {
  if (!DCLIENT_READY) {
    DCLIENT_READY = new Promise<DClientClass>((resolve, reject) => {
      DClient.once("ready", () => {
        console.log(`🟢 Discord bot running!`)
        resolve(DClient)
      })

      DClient.login(process.env.DISCORD_BOT_TOKEN).catch(reject)
    })
  }

  return DCLIENT_READY
}

export async function getDClient() {
  if (!DCLIENT_READY) throw new Error("🔴 Discord client is not loaded! Use startClient() first!")
  return DCLIENT_READY
}
