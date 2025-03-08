import { Worker } from "worker_threads"
import path from "path"

export async function downloadWindowsFile(version: string, versionData: DVersionType): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url: versionData.urls.cdn, outputPath: process.env.TMP_PATH, fileName: `win-${version}.exe` }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(true)
      if (message.type === "error") return resolve(false)
    })

    worker.on("error", () => {
      console.log(`🔴 Download worker error!`)
      return resolve(false)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`)
      }
      return resolve(false)
    })
  })
}

export async function downloadLinuxFile(version: string, versionData: DVersionType): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url: versionData.urls.cdn, outputPath: process.env.TMP_PATH, fileName: `linux-${version}.tar.gz` }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(true)
      if (message.type === "error") return resolve(false)
    })

    worker.on("error", () => {
      console.log(`🔴 Download worker error!`)
      return resolve(false)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`)
      }
      return resolve(false)
    })
  })
}

export async function downloadMacFile(version: string, versionData: DVersionType): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url: versionData.urls.cdn, outputPath: process.env.TMP_PATH, fileName: `macos-${version}.tar.gz` }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(true)
      if (message.type === "error") return resolve(false)
    })

    worker.on("error", () => {
      console.log(`🔴 Download worker error!`)
      return resolve(false)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`)
      }
      return resolve(false)
    })
  })
}
