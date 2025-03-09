declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string
      PROTOCOL: string
      AUTOIMPORTER: string
      DISCORD_BOT_TOKEN: string
      DISCORD_GUILD_ID: string
      DISCORD_APP_ID: string
      DISCORD_DEV_MODE: boolean
      DISCORD_DEV_ID: string
    }
  }
}

export {}
