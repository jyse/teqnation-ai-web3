import fs from "fs";
import path from "path";
import axios from "axios";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export async function POST(request) {
  const { data } = await request.json();
  const directory = path.join(process.cwd(), "public", "images"); // Target directory to save images

  let imageCounter = 0;

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    for (const record of data) {
      const imageItems = record.fields["Image"];

      if (imageItems && Array.isArray(imageItems)) {
        for (const imageItem of imageItems) {
          const imageUrl =
            typeof imageItem === "string" ? imageItem : imageItem.url;

          if (imageUrl) {
            const response = await axios({
              method: "get",
              url: imageUrl,
              responseType: "stream"
            });
            const outputPath = path.join(directory, `${imageCounter}.png`);
            await streamPipeline(
              response.data,
              fs.createWriteStream(outputPath)
            );

            imageCounter++;
          } else {
            console.warn("No URL found in this imageItem:", imageItem);
          }
        }
      } else {
        console.warn("No Image items found in this record:", record);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Images successfully written to the filesystem!"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error processing images:", error);
    return new Response(
      JSON.stringify({ message: "Failed to process images." }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
