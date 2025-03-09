import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { getDClient } from "@/discord"
import { DCommandChatInput, DCommandTypes } from "@/discord/discord.types"
import { EMOJIS } from "@/discord/config.data"

const command: DCommandChatInput = {
  type: DCommandTypes.ChatInput,
  cooldown: 10,
  data: new SlashCommandBuilder().setName("ping").setDescription("Returns pong with some latency info."),
  async execute(interaction: ChatInputCommandInteraction) {
    const DClient = await getDClient()

    await interaction.deferReply()

    const reply = await interaction.fetchReply()

    const ping = reply.createdTimestamp - interaction.createdTimestamp

    interaction.editReply(`> **Pong!** *Client \`${ping}ms\`* · *Websocket: \`${DClient.ws.ping}ms\`*`)
  }
}

export default command
