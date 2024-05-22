"use client";

import { createWallet, inAppWallet, walletConnect } from "thirdweb/wallets";

import AdminTools from "./AdminTools";
import { ConnectButton } from "thirdweb/react";
import React from "react";
import Setup from "./Setup";
import styles from "../page.module.css";
import {client} from "@/app/constants";

const adminAddress = "0x3b21E4a79F5BE5AB4a854ae0b161873cE2cDCc73".toLowerCase();

const ViewConnections2 = () => {
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
      auth: {
        options: ["email", "google", "apple", "facebook", "phone"],
      },
    }),
  ];

  return (
    <div className={styles.viewConnections}>
      <div className={styles.container}>
          <h1>Hi there!</h1>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"dark"}
          connectModal={{ size: "wide" }}
        />
      </div>
    </div>
  );
};

export default ViewConnections2;
