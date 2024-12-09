import { execSync } from "child_process"
import fs from "fs"
import path from "path"

export const generateEntityApi = (
  baseDir: string,
  slice: string,
  apiInstance?: string,
) => {
  const dir = path.join(baseDir, "entities", slice)

  const files = {
    "api/schema/index.ts": "",
    "api/api.ts": `import { ${apiInstance || ""} } from "@/shared/api"\n\nimport {} from "./schema"\n\nexport const ${slice}Apis = {}\n`,
    "api/index.ts": `export * from "./api"\nexport * from "./query"\nexport * from "./schema"\n`,
    "api/query.ts": `import {} from "./schema"\n\nexport const ${slice}Queries = {}\n`,
    "index.ts": `export * from "./api"\n`,
  }

  // 디렉터리 생성 및 파일 생성 로그 추가
  console.log(`Creating directory and files for entity: ${slice}`)
  fs.mkdirSync(dir, { recursive: true })

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content, "utf8")

    // 파일 경로를 /src 이하만 출력
    const relativePath = path.relative(path.join(__dirname, "../"), fullPath)
    console.log(`Created file: /${relativePath}`)
  }

  console.log()

  // 중복된 코드 재사용을 위한 함수
  const updateAndSortApisAndQueries = (
    filePath: string,
    importLine: string,
    apiExportLine: string,
    queryExportLine: string,
  ) => {
    const relativePath = path.relative(path.join(__dirname, "../"), filePath)

    let content = fs.readFileSync(filePath, "utf8")

    // import 추가
    if (!content.includes(importLine)) {
      content = importLine + content
    } else {
      console.log(`import line already exists in /${relativePath}`)
    }

    // export 객체에 새로운 API 추가
    if (!content.includes(apiExportLine)) {
      content = content.replace(
        /export const apis = {([\s\S]*?)}/,
        `export const apis = {$1${apiExportLine}}`,
      )
    } else {
      console.log(`API export line already exists in /${relativePath}`)
    }

    // export 객체에 새로운 Query 추가
    if (!content.includes(queryExportLine)) {
      content = content.replace(
        /export const queries = {([\s\S]*?)}/,
        `export const queries = {$1${queryExportLine}}`,
      )
    } else {
      console.log(`Query export line already exists in /${relativePath}`)
    }

    // apis와 queries 객체를 각각 알파벳 순으로 정렬
    const sortedContent = content
      .replace(/export const apis = {([\s\S]*?)}/, (match, exportContent) => {
        const sortedExportString = sortExportObject(exportContent)
        return `export const apis = {\n${sortedExportString}\n}`
      })
      .replace(
        /export const queries = {([\s\S]*?)}/,
        (match, exportContent) => {
          const sortedExportString = sortExportObject(exportContent)
          return `export const queries = {\n${sortedExportString}\n}`
        },
      )

    // 수정된 내용 저장
    fs.writeFileSync(filePath, sortedContent, "utf8")

    // Lint 적용
    try {
      execSync(`npx eslint ${filePath} --fix`, { stdio: "inherit" })
    } catch (err) {
      console.error(`Failed to apply lint on /${relativePath}:`, err)
    }

    console.log(`Updated index file: /${relativePath}`)
  }

  // 객체를 알파벳 순으로 정렬하는 함수
  const sortExportObject = (exportContent: any) => {
    const exportObject = exportContent
      .split("\n")
      .filter(Boolean)
      .reduce((acc: any, line: any) => {
        const [key, value] = line
          .split(":")
          .map((s: any) => s.trim().replace(",", ""))
        if (key && value) {
          acc[key] = value
        }
        return acc
      }, {})

    return Object.entries(exportObject)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `  ${key}: ${value},`)
      .join("\n")
  }

  // index 파일 업데이트
  if (!fs.existsSync(path.join(baseDir, "entities/index.ts"))) {
    fs.writeFileSync(
      path.join(baseDir, "entities/index.ts"),
      `export const apis = {\n}\n\nexport const queries = {\n}\n`,
      "utf8",
    )
  }
  const entitiesIndexPath = path.join(baseDir, "entities/index.ts")
  const importLine = `import { ${slice}Apis, ${slice}Queries } from "./${slice}"\n`
  const apiExportLine = `  ${slice}: () => ${slice}Apis,\n`
  const queryExportLine = `  ${slice}: () => ${slice}Queries,\n`

  updateAndSortApisAndQueries(
    entitiesIndexPath,
    importLine,
    apiExportLine,
    queryExportLine,
  )

  console.log()
  console.log(
    `🎉 API and Query modules for '${slice}' entity generated and updated in index.ts successfully.`,
  )
}
