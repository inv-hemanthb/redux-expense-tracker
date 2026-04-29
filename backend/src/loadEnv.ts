import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const envPath = path.join(repoRoot, ".env");

const result = dotenv.config({ path: envPath, quiet: true });
if (result.parsed) {
    expand({ parsed: result.parsed });
}
