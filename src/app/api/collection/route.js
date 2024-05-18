import fs from "fs";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const jsonFilePath = join(
    process.cwd(),
    "public",
    "collection",
    "collection.json"
  );

  // Check if the file exists
  try {
    await fs.promises.access(jsonFilePath, fs.constants.F_OK);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Collection file does not exist"
      }),
      { status: 404 }
    );
  }

  // File exists, proceed to read its content
  const jsonContent = await readFile(jsonFilePath, "utf-8");
  console.log(jsonContent, "JSON CONTENT 🌊🌴🚵‍♂️💏💖 ");
  const jsonData = JSON.parse(jsonContent);

  return new Response(
    JSON.stringify({
      data: jsonData
    })
  );
}
