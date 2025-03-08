import { DataSource } from "typeorm"

export const ADS = new DataSource({
  type: "sqlite",
  database: "/app/db/vslapi.sqlite",
  entities: [__dirname + "/models/*.model.ts"],
  synchronize: true
})

export const initializeDatabase = async () => {
  try {
    await ADS.initialize()
    console.log("🟢 Data Source initialized!")
  } catch (err) {
    console.error("🔴 Error initializing Data Source:", err)
  }
}
