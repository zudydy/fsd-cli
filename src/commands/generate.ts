import { input, select } from "@inquirer/prompts"
import { layerChoices, segmentChoices } from "@/constants"

export const generate = async () => {
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

  console.log("Selected layer: ", layer)
  console.log("Entered slice: ", slice)
  console.log("Selected segment: ", segment)
}
