import fs from "fs";
import { swaggerSpec } from "../config/swagger.js";

fs.writeFileSync(
    "./openapi.json",
    JSON.stringify(swaggerSpec, null, 2)
);

console.log("OpenAPI spec generated: openapi.json");