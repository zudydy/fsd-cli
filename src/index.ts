#!/usr/bin/env node

import { Command } from "commander"
import { generate, init } from "@/commands"
import { packageVersion } from "@/utils"

const program = new Command()

program
  .name("fsd")
  .description("FSD(Feature-Sliced Design) CLI")
  .version(packageVersion)

program.command("init").alias("i").action(init)
program.command("generate").alias("g").action(generate)

program.parse(process.argv)
