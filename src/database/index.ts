import { DataSource } from "typeorm"

export const ADS = new DataSource({
  type: "sqlite",
  database: `${process.env.DB_PATH}`,
  entities: [__dirname + "/models/*.model.ts"],
  synchronize: true
})

export const initializeDatabase = async () => {
  try {
    await ADS.initialize()
    console.log("🟢 Data Source inicializado!")
  } catch (err) {
    console.error("🔴 Error al inicializar el Data Source:", err)
  }
}
