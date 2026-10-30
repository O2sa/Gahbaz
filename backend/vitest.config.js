import { defineConfig } from "vitest/config";
import fs from "node:fs";
import path from "node:path";

function resolveTsExtension() {
  return {
    name: "resolve-ts-extension",
    enforce: "pre",
    resolveId(source, importer) {
      if (importer && source.startsWith(".") && source.endsWith(".js")) {
        const dir = path.dirname(importer);
        const jsFile = path.resolve(dir, source);
        if (!fs.existsSync(jsFile)) {
          const tsFile = jsFile.replace(/\.js$/, ".ts");
          if (fs.existsSync(tsFile)) {
            return tsFile;
          }
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [resolveTsExtension()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.js"],
    testTimeout: 20000,
  },
});
