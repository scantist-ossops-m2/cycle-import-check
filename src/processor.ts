import { reduce, concat, map } from "lodash";
import { resolveFilePath } from "./file";
import { FileImportDescription } from "./type";

/**
 * findFileDependencies
 * 
 * @param fileAbsolutePath 
 * @param fileCodeString 
 */
export const findFileDependencies = (fileAbsolutePath: string, fileCodeString: string) => {
  return concat(
    findImportDependencies(fileAbsolutePath, fileCodeString),
    findExportDependencies(fileAbsolutePath, fileCodeString),
  )
}

export const findImportDependencies = (fileAbsolutePath: string, fileCodeString: string) => {
  var result: FileImportDescription[] = []
  const importLines = fileCodeString.match(/import.*?["|'](.*?)["|']/g)
  if (importLines) {
    const imports: FileImportDescription[] = reduce(importLines, (pre, line) => {
      const result = /import.*?["|'](.*?)["|']/.exec(line)
      const importStatementCode = result[0]
      const importRelativePath = result[1]
      const importFile = resolveFilePath(fileAbsolutePath, importRelativePath)
      // ignore node_module import
      if (importFile) {
        return concat(pre, {
          fromFile: fileAbsolutePath,
          importFile,
          code: importStatementCode,
        })
      } else {
        return pre;
      }
    }, [])
    result = concat(result, imports)
  }
  return result;
}

export const findExportDependencies = (fileAbsolutePath: string, fileCodeString: string) => {
  var result: FileImportDescription[] = []
  const lines = fileCodeString.match(/export.*?from.*?["|'](.*?)["|']/g)
  if (lines) {
    const exportsLines: FileImportDescription[] = reduce(lines, (pre, line) => {

      const result = /export.*?from.*?["|'](.*?)["|']/.exec(line)
      const exportStatementCode = result[0]
      const exportRelativePath = result[1]

      const importFile = resolveFilePath(fileAbsolutePath, exportRelativePath)
      // ignore node_module import
      if (importFile) {
        return concat(pre, {
          fromFile: fileAbsolutePath,
          importFile,
          code: exportStatementCode
        })
      } else {
        return pre;
      }
    }, [])
    result = concat(result, exportsLines)
  }
  return result;
}
