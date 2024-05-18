"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import { useRouter } from "next/navigation"; // Import useRouter
import { connectSmartContract } from "../../../utils/connectSmartContract";

// console logs for each step
// call it Step 1, 2, 3, 4, etc. according to presentation slide

const styleImg = {
  borderRadius: "4px"
};

const AdminTools = () => {
  const [airtableData, setAirtableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);
  const [collection, setCollection] = useState([]);
  const [jsonHashIpfs, setJSONHashIpfs] = useState();
  const router = useRouter();

  const getAirTableData = async () => {
    setIsLoading(true);
    console.log("🚀 Getting data from Airtable");
    try {
      const res = await fetch("/api/airtable");
      if (!res.ok) throw new Error("❗Failed to load data");
      const data = await res.json();

      setAirtableData(data.records);
      setMessage(
        `Data succesfully retrieved from Airtable! Count: ${data.records.length}`
      );
      console.log("✅ Data successfully retrieved from Airtable!");
      console.log("📝 Airtable records: ", data.records);
      setStep(1);
    } catch (error) {
      console.error(error.message);
      setMessage("Failed to fetch data from Airtable.");
    } finally {
      setIsLoading(false);
    }
  };

  const writeToFileSystem = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: airtableData })
      });

      if (!res.ok) throw new Error("Failed to load data");

      setMessage("Data succesfully written to the file system!");
      setStep(2);
    } catch (error) {
      console.error(error.message);
      setMessage("Failed to write data to File System.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDataToIPFS = async () => {
    setIsLoading(true);
    try {
      const imgsHashIpfsResponse = await fetch("/api/imgIPFS");
      if (!imgsHashIpfsResponse.ok)
        throw new Error("Failed to get IPFS hash for images");

      const imgsHashIpfs = await imgsHashIpfsResponse.json();

      const jsonObjResponse = await fetch("/api/jsonIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imgsHashIpfs,
          airtableData: airtableData
        })
      });

      const { success, collection, jsonHashIpfs } =
        await jsonObjResponse.json();
      if (success) {
        setIsLoading(false);
        setMessage("Images + JSON objects succesfully uploaded to IPFS!");
        setCollection(collection);
        setJSONHashIpfs(jsonHashIpfs);
        setStep(3);
      } else {
        throw new Error("Failed to upload data to IPFS");
      }
    } catch (error) {
      console.error(error.message);
      setMessage("Failedi to upload data to IPFS.");
    } finally {
      setIsLoading(false);
    }
  };

  // get contractAddress - in .env
  // get ABI in manual/abi.json
  // adjust .env in vercel before git commit and push.
  const connectSm = async () => {
    console.log("Connecting Frontend to 📝 Smart contract");
    try {
      const connectedContract = await connectSmartContract();
      console.log("✅📝 Contract connected!: ", connectedContract);
      setMessage("Frontend & Smart Contract are 🔗 connected 🔗!");
      setIsLoading(false);
      setStep(4); // Move to the final step
    } catch (error) {
      console.error("Failed to connect to smart contract: ", error);
      // Handle the error appropriately in the UI
      setMessage("Failed to connect to smart contract. Please try again.");
    }
  };

  const readyForMint = () => {
    router.push("/collection");
    // router.push("/collection");
  };

  return (
    <div className={styles.adminTools}>
      <h1>Hi Admin!</h1>
      {isLoading ? (
        <h1>Wait...</h1>
      ) : (
        <>
          <div className={styles.message}>
            <h1>{message}</h1>
          </div>
          {step === 0 && (
            <button className={styles.button} onClick={() => getAirTableData()}>
              <h1>Pull data from Airtable</h1>
            </button>
          )}
          {step === 1 && (
            <button
              className={styles.buttonFs}
              onClick={() => writeToFileSystem()}
            >
              <h1>Write to file system</h1>
            </button>
          )}
          {step === 2 && (
            <button
              className={styles.button}
              onClick={() => uploadDataToIPFS()}
            >
              <h1>Upload to IPFS</h1>
            </button>
          )}
          {step === 3 && jsonHashIpfs && (
            <>
              <div className={styles.remixIDE}>
                <h1>Let&apos;s go to Remix IDE</h1>
              </div>

              <h1> Once contract has been deployed 👇</h1>
              <button className={styles.button} onClick={() => connectSm()}>
                <h1>Connect Frontend to smart Contract using ethers.js</h1>
              </button>
              <div className={styles.gallery}>
                {collection?.map((obj, index) => {
                  return (
                    <div className={styles.img} key={index}>
                      <Image
                        priority={true}
                        src={`/images/${obj.imgName}`}
                        width={250}
                        height={250}
                        alt={obj.imgName || "Image"}
                        style={styleImg}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              {/* <Link href={"/collection"}> */}
              <button className={styles.button} onClick={() => readyForMint()}>
                <h1> Ready for minting?</h1>
              </button>
              {/* </Link> */}
              <div className={styles.gallery}>
                {collection?.map((obj, index) => {
                  return (
                    <div
                      className={styles.img}
                      onClick={() => handleImg(index)}
                      key={index}
                    >
                      <Image
                        priority={true}
                        src={`/images/${obj.imgName}`}
                        width={250}
                        height={250}
                        alt={obj.imgName || "Image"}
                        style={styleImg}
                      />
                    </div>
                  );
                })}
              </div>
              {/* </Link> */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTools;
