declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    DOMAIN: string
    PROTOCOL: string
    DB_PATH: string
    SSL_KEY_PATH: string
    SSL_CERT_PATH: string
  }
}
