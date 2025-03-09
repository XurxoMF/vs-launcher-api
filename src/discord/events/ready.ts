import { Events, ActivityType, CommandInteraction } from "discord.js"
import { getDClient } from "@/discord"
import { DReadyEventType } from "@/discord/discord.types"

const readyEvent: DReadyEventType = {
  name: Events.ClientReady,
  once: true,
  async execute() {
    const DClient = await getDClient()

    DClient.user?.setPresence({
      activities: [
        {
          name: `VS Launcher!`,
          type: ActivityType.Playing
        }
      ]
    })
  }
}

export default readyEvent
