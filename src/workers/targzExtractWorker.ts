import { parentPort, workerData } from "worker_threads"
import tar from "tar-fs"
import fse from "fs-extra"
import { createGunzip } from "zlib"

const { filePath, outputPath } = workerData

console.log(`💡 Extracting ${filePath} on ${outputPath}...`)

if (!fse.existsSync(outputPath)) {
  fse.mkdirSync(outputPath, { recursive: true })
}

const input = fse.createReadStream(filePath)

const output = tar.extract(outputPath)

input.on("error", (err) => {
  console.log(`🔴 Error extracting ${filePath}!`)
  return parentPort?.postMessage({ type: "error", error: err })
})

output.on("error", (err) => {
  console.log(`🔴 Error extracting ${filePath}!`)
  return parentPort?.postMessage({ type: "error", error: err })
})

input
  .pipe(createGunzip())
  .pipe(output)
  .on("finish", () => {
    console.log(`🟢 Finished ${filePath} extraction!`)
    return parentPort?.postMessage({ type: "finished", outputPath })
  })
