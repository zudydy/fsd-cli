import * as fs from "fs"
import { join } from "path"
import { confirm, input, select } from "@inquirer/prompts"
import { layerChoices, segmentChoices } from "@/constants"
import { Layer, Segment } from "@/types"
import { generateEntityApi } from "@/commands/generate-entity-api"

export const generate = async () => {
  const baseDir = await input({
    message: "Enter a base directory",
    default: ".",
  })

  const language = await select<string>({
    message: "Select a language",
    default: "ts",
    choices: ["ts", "js"],
  })

  const layer = await select({
    message: "Select a layer",
    choices: layerChoices,
    pageSize: 10,
    loop: false,
  })

  const slice = await input({
    message: "Enter a slice name",
  })

  const segment = await select({
    message: "Select a segment",
    choices: segmentChoices,
    pageSize: 10,
    loop: false,
  })

  if (layer === "entities" && segment === "api") {
    const isUsedTemplate = await confirm({
      message: "Do you want to use template?",
    })

    if (isUsedTemplate) {
      const apiInstance = await input({
        message: "Enter an API instance",
      })

      generateEntityApi(baseDir, slice, apiInstance)
      return
    }
  }

  await generateFile(baseDir, language, layer, slice, segment)
}

const generateFile = async (
  baseDir: string,
  language: string,
  layer: Layer,
  slice: string,
  segment: Segment,
) => {
  const sliceDirPath = join(baseDir, layer, slice)
  const segmentDirPath = join(sliceDirPath, segment)

  const sliceFilePath = join(sliceDirPath, `index.${language}`)
  const segmentFilePath = join(segmentDirPath, `index.${language}`)

  try {
    if (!fs.existsSync(sliceFilePath)) {
      fs.writeFileSync(sliceFilePath, "")
    }

    if (fs.existsSync(segmentFilePath)) {
      console.error(`File ${segmentFilePath} already exists`)
      return
    }

    fs.mkdirSync(segmentDirPath, { recursive: true })
    fs.writeFileSync(segmentFilePath, "")
    console.log(`Created ${segmentFilePath}`)
  } catch (error) {
    console.error(`Error creating file: ${error}`)
  }
}
