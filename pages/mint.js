import React, { useEffect, useState } from "react";

import Link from "next/link";
import { connectSmartContract } from "../utils/connectSmartContract";
import { ethers } from "ethers";
import { getUserAccount } from "../utils/getUserAccount";
import styles from "../src/app/page.module.css";
import { useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const MintPage = () => {
  const router = useRouter();
  const { tokenId } = router.query;
  // const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isAlreadyMinted, setIsAlreadyMinted] = useState(false);
  const [userAddress, setUserAddress] = useState("");


  useEffect(() => {
    const initContract = async () => {
      try {
        const connectedContract = await connectSmartContract();
        console.log("🐲 Contract connected before mint", connectedContract);
        setContract(connectedContract);
      } catch (error) {
        console.error(error);
      }
    };
    initContract();
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await getUserAccount();
      setUserAddress(account);
    };
    fetchAccount();
  }, []);
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

const handleMint = async () => {
  console.log("minting 🍬🍬🍬🍬🍬");
  if (!contract) {
    console.error("Contract not connected");
    return;
  }

  try {
    setLoading(true);

    // Check if token is already minted
    const isAlreadyMinted = await contract.call("isTokenMinted", [tokenId]);

    console.log(isAlreadyMinted, "ALREADY?🧸🧸🧸🧸🧸🧸");
    if (isAlreadyMinted) {
      alert(`Token ID ${tokenId} has already been minted`);
      setIsAlreadyMinted(true);
      setLoading(false);
      return; // Exit the function to prevent minting
    }

    const signerAddress = await contract.signer.getAddress();

    const mintTx = await contract.call("safeMint", [signerAddress, tokenId], {
      value: ethers.utils.parseEther("0.001")
    });

    console.log("🐼 MINT transaction: ", mintTx);
    const receipt = await mintTx.wait();

    setLoading(false);
    setMintSuccess(true);
    setTransactionHash(receipt.transactionHash);
    console.log("✅🍬 Minting successful: ", receipt.transactionHash);
  } catch (error) {
    console.error("❌🍬 Minting failed:", error);
    setLoading(false);
    if (error.message.includes("Token already minted")) {
      alert(`Token ID ${tokenId} has already been minted`);
    }
  } finally {
    setLoading(false);
  }
};

  const redirectTestNetOpenSea = (userAddress) => {
    const openSeaURL = `https://testnets.opensea.io/${userAddress}`;
    window.location.href = openSeaURL;
  };

  console.log(tokenId, "what is tokenId here? 🍬🍬🍬🍬🍬🍬");

  return (
    <div className={styles.mintLayout}>
      <h1>Meet & Mint</h1>
      {loading ? (
        <div className={styles.mintLoading}>
          <h1>Minting in progress...🍬🍬🍬🍬</h1>
        </div>
      ) : isAlreadyMinted ? (
        <div className={styles.mintError}>
          <h1> ❗This token has already been minted </h1>
        </div>
      ) : mintSuccess ? (
        <div className={styles.mintSuccess}>
          <div className={styles.mintTransaction}>
            <h1>✅ 🍬 Minting successful!</h1>
            <h1> Mint hash: {transactionHash}</h1>
          </div>
          <button
            className={styles.checkAccount}
            onClick={() => redirectTestNetOpenSea(userAddress)}
            disabled={!userAddress}
          >
            <h1> Check your account here </h1>
          </button>
        </div>
      ) : tokenId ? (
        <>
          <div className={styles.cardToBeMinted}>
            <img src={`/images/${tokenId}.png`} alt={`Token ${tokenId}`} />
            <button onClick={handleMint} disabled={!contract}>
              <h2>{`Mint Token ${tokenId}`}</h2>
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MintPage;
