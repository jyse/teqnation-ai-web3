"use client";
import React, { useState, useEffect } from "react";
import Setup from "./Setup";
import AdminTools from "./AdminTools";
import styles from "../page.module.css";

const adminAddress = "0x1d9a826de2763371e8f55fb353a11a6e934689aa".toLowerCase();

const ViewConnections = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const connectWallet = async () => {
    console.log("Connecting 🦊Wallet!");
    if (window.ethereum) {
      console.log("🦊✅Installed");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        setUserAddress(accounts[0]);
        console.log("🦊User address: ", accounts[0]);
        setIsAdmin(adminAddress.includes(accounts[0].toLocaleLowerCase()));
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert(
          "Metamask is not installed. Please install it to use this feature."
        );
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else {
        setUserAddress(accounts[0]);
        setIsAdmin(adminAddress.includes(accounts[0].toLowerCase()));
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      // Correctly remove the listener by passing the same function reference
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return (
    <div className={styles.viewConnections}>
      <div className={styles.container}>
        {!userAddress ? (
          <>
            <h1>Hi there!</h1>
            <button className={styles.button} onClick={connectWallet}>
              <h1>Connect 🦊 Wallet</h1>
            </button>
          </>
        ) : isAdmin ? (
          <AdminTools />
        ) : (
          <div>
            <Setup />
          </div>
        )}
      </div>
    </div>
  );
};
export default ViewConnections;
