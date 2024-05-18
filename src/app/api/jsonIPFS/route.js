import fs from "fs";
import path from "path";
import { join } from "path";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({
  pinataJWTKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYWM1ODMxMy03ZWY4LTRlYWMtOTk4ZS01ZTVkMjA5ZTFhMjgiLCJlbWFpbCI6Implc3N5dGhlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1Njk3MjAxMDRkNjVjMGMxMDVmMiIsInNjb3BlZEtleVNlY3JldCI6IjRhMjI1MTMxYTM3NWUwZTRhMzZhYmU4N2UxMjJiMjE4MTgyZDRlMTdjYmQwZGM4OGZhMTQwYTcyZTFmNWM3ZDEiLCJpYXQiOjE3MDg5ODU1ODl9.4pqY87fQhLVzdGcoCewZ4EytPwtHJD-dcXUVPSTq7CM"
});

export async function uploadJSONtoIPFS(imgsHashIpfs) {
  console.log("Uploading Json objects to IPFS");

  const collectionFilePath = join(
    process.cwd(),
    "public",
    "collection",
    "collection.json"
  );

  try {
    const collectionContent = await fs.promises.readFile(
      collectionFilePath,
      "utf-8"
    );
    const collectionData = JSON.parse(collectionContent);
    const cardsJSONDir = path.join(process.cwd(), "public", "cards");

    if (!fs.existsSync(cardsJSONDir)) {
      fs.mkdirSync(cardsJSONDir, { recursive: true });
    }

    collectionData.forEach((item, index) => {
      const individualJSONPath = path.join(cardsJSONDir, `${index}.json`);
      item.image = `ipfs://${imgsHashIpfs}/${index}.png`;
      fs.writeFileSync(individualJSONPath, JSON.stringify(item, null, 2));
    });

    const options = {
      pinataMetadata: {
        name: "JSON Objects",
        keyvalues: {
          folder: "json",
          timestamp: Date.now()
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    const result = await pinata.pinFromFS(cardsJSONDir, options);
    return result.IpfsHash;
  } catch (error) {
    console.log(error, "what is the error here? 🍬🍬🍬🍬🍬");
    console.log("👹✨Error reading/updating JSON file");
  }
}

export async function writeJSONFile(airtableData, imgHash) {
  const transformedData = airtableData.map((record, index) => {
    return {
      name: record.fields["Name"],
      image: `ipfs://${imgHash}/${index}.png`,
      description: record.fields["Description: "],
      accountNumber: record.fields["Metamask account:"],
      job: record.fields["Job Title:"],
      linkedIn: record.fields["LinkedIn:"],
      imgName: `${index}.png`,
      tokenId: index
    };
  });

  // see if you have time to write the function to always be updated with the airtable data and current images, even after updating things

  const collectionJSONPathFolder = path.join(
    process.cwd(),
    "public",
    "collection"
  );
  const collectionFilePath = path.join(
    collectionJSONPathFolder,
    "collection.json"
  );

  try {
    fs.mkdirSync(collectionJSONPathFolder, { recursive: true });

    const dataStr = JSON.stringify(transformedData, null, 2);

    fs.writeFileSync(collectionFilePath, dataStr);

    console.log("Data successfully written to collection.json");
  } catch (error) {
    console.error("Error writing Airtable data to collection.json:", error);
  }
}

export async function POST(request) {
  const { imgsHashIpfs, airtableData } = await request.json();

  console.log(imgsHashIpfs, "IMGS HASH PASSED THROUGH!");
  console.log(airtableData, "AIRTABLE DATA");

  await writeJSONFile(airtableData, imgsHashIpfs);
  const jsonHashIpfs = await uploadJSONtoIPFS(imgsHashIpfs);
  fs.writeFileSync("jsonHashIpfs.txt", jsonHashIpfs, "utf-8");
  console.log("JSON HASH IPFS written to jsonHashIpfs.txt");

  // Read the updated collection.json file
  const collectionFilePath = path.join(
    process.cwd(),
    "public",
    "collection",
    "collection.json"
  );
  const collectionContent = fs.readFileSync(collectionFilePath, "utf-8");
  const collectionData = JSON.parse(collectionContent);

  return new Response(
    JSON.stringify({
      success: true,
      collection: collectionData,
      jsonHashIpfs: jsonHashIpfs
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
