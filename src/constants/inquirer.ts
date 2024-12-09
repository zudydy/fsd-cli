import { Separator } from "@inquirer/prompts"
import { InquirerChoice, Layer, Segment } from "@/types"

export const layerChoices: (InquirerChoice<Layer> | Separator)[] = [
  {
    name: "app",
    value: "app",
    description:
      "everything that makes the app run — routing, entrypoints, global styles, providers.",
  },
  {
    name: "pages",
    value: "pages",
    description: "full pages or large parts of a page in nested routing.",
  },
  {
    name: "widgets",
    value: "widgets",
    description:
      "large self-contained chunks of functionality or UI, usually delivering an entire use case.",
  },
  {
    name: "features",
    value: "features",
    description:
      "reused implementations of entire product features, i.e. actions that bring business value to the user.",
  },
  {
    name: "entities",
    value: "entities",
    description:
      "business entities that the project works with, like user or product.",
  },
  {
    name: "shared",
    value: "shared",
    description:
      "reusable functionality, especially when it's detached from the specifics of the project/business, though not necessarily.",
  },
  new Separator(),
  {
    name: "processes",
    value: "processes",
    description: "complex inter-page scenarios",
    disabled: "(process is deprecated, don't use it)",
  },
]

export const segmentChoices: InquirerChoice<Segment>[] = [
  {
    name: "ui",
    value: "ui",
    description:
      "everything related to UI display: UI components, date formatters, styles, etc.",
  },
  {
    name: "api",
    value: "api",
    description:
      "backend interactions: request functions, data types, mappers, etc.",
  },
  {
    name: "model",
    value: "model",
    description:
      "the data model: schemas, interfaces, stores, and business logic.",
  },
  {
    name: "lib",
    value: "lib",
    description: "library code that other modules on this slice need.",
  },
  {
    name: "config",
    value: "config",
    description: "configuration files and feature flags.",
  },
]
