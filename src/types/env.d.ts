declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    DOMAIN: string
    PROTOCOL: string
    DB_PATH: string
    PUBLIC_PATH: string
    TMP_PATH: string
  }
}
