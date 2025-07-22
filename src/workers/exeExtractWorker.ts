import { workerData, parentPort } from "worker_threads"
import fse from "fs-extra"
import { spawn } from "child_process"

const { filePath, outputPath } = workerData

console.log(`💡 Extracting ${filePath} on ${outputPath}...`)

if (!fse.existsSync(outputPath)) {
  fse.mkdirSync(outputPath, { recursive: true })
}

const command = "innoextract"
const args = ["-d", outputPath, filePath]

const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] })

let stderrData = ""

child.stderr.on("data", (data: Buffer) => {
  stderrData += data.toString()
})

child.on("close", (code: number) => {
  if (code !== 0) {
    console.log(`🔴 Error extracting ${filePath}!`)
    console.error(stderrData.trim() || "(no error message)")
    return parentPort?.postMessage({ type: "error" })
  }

  console.log(`🟢 Finished ${filePath} extraction!`)
  return parentPort?.postMessage({ type: "finished" })
})
