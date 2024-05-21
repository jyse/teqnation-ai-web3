import { readFile } from "fs/promises";
import { join } from "path";
import fs from "fs";
const pinataSDK = require("@pinata/sdk");
const path = require("path");
const pinata = new pinataSDK({
  pinataJWTKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYWM1ODMxMy03ZWY4LTRlYWMtOTk4ZS01ZTVkMjA5ZTFhMjgiLCJlbWFpbCI6Implc3N5dGhlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1Njk3MjAxMDRkNjVjMGMxMDVmMiIsInNjb3BlZEtleVNlY3JldCI6IjRhMjI1MTMxYTM3NWUwZTRhMzZhYmU4N2UxMjJiMjE4MTgyZDRlMTdjYmQwZGM4OGZhMTQwYTcyZTFmNWM3ZDEiLCJpYXQiOjE3MDg5ODU1ODl9.4pqY87fQhLVzdGcoCewZ4EytPwtHJD-dcXUVPSTq7CM"
});

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const uploadImgsToIpfs = async () => {
  const imagesPath = join(process.cwd(), "public", "images");

  const options = {
    pinataMetadata: {
      name: "Images",
      keyvalues: {
        folder: "Art",
        timestamp: Date.now()
      }
    },
    pinataOptions: {
      cidVersion: 0
    }
  };
  try {
    const ipfsObj = await pinata.pinFromFS(imagesPath, options);
    return ipfsObj.IpfsHash;
  } catch (error) {
    console.log("👹✨Error uploading images to IPFS: ", error);
  }
};

export async function GET() {
  console.log("post");
  const imgHash = await uploadImgsToIpfs();
  console.log("🐰Hash for Images: ", imgHash);

  return new Response(JSON.stringify(imgHash));
}
