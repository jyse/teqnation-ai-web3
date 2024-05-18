"use client";
import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import QRCode from "qrcode.react";
import Link from "next/link";
import Image from "next/image";

const styleImg = {
  borderRadius: "4px"
};

const CollectionPage = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to retrieve collection");

        const collection = await response.json();

        console.log("✅📝🐲Collection retrieved: ", collection);
        setCollection(collection.data); // Adjust based on the actual structure of your response
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCollection();
  }, []);

  return (
    <div>
      <div className={styles.collectionTitle}>
        <h1> Collection</h1>
      </div>

      <div className={styles.collectionList}>
        {collection?.map((item, index) => (
          <>
            <div className={styles.cardContainer} key={index}>
              <div>
                <Image
                  priority={true}
                  src={`/images/${item.imgName}`}
                  width={250}
                  height={250}
                  alt={`Collection ${index}`}
                  style={styleImg}
                />
              </div>
              <div className={styles.qrCodeContainer}>
                <QRCode
                  value={`https://devworldconnections.vercel.app/mint?tokenId=${item.tokenId}`}
                  size={250}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <div className={styles.metaDataContainer}>
                <div className={styles.row}>
                  <h1> {item.name} </h1>
                </div>
                <div className={styles.row}>
                  <h2>{item.description}</h2>
                </div>
                <div className={styles.row}>
                  {/* <Link href={`${item.linkedIn}`}>
                    <h2> 🔗 LinkedIn </h2>
                  </Link> */}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
