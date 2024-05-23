"use client";

import {createWallet, inAppWallet, walletConnect} from "thirdweb/wallets";
import React, {useEffect, useState} from "react";
import AdminTools from "./AdminTools";
import {ConnectButton, ConnectEmbed} from "thirdweb/react";
import Setup from "./Setup";
import styles from "../page.module.css";
import {CHAIN, client} from "@/app/constants";

const adminAddress = "0x423b634BD967531BE48dB364f760da815d3cd98E".toLowerCase();

const ViewConnections2 = () => {
    const [userAddress, setUserAddress] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

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

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log("Please connect to a wallet.");
            } else {
                setUserAddress(accounts[0]);
                setIsAdmin(adminAddress.includes(accounts[0].toLowerCase()));
            }
        };

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);

            window.ethereum
                .request({method: "eth_accounts"})
                .then(handleAccountsChanged)
                .catch((err) => {
                    console.error("Error fetching accounts:", err);
                });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setUserAddress(accounts[0]);
                setIsAdmin(adminAddress.includes(accounts[0].toLowerCase()));
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask to use this feature.");
        }
    };

    return (
        <div className={styles.viewConnections}>
            <div className={styles.container}>
                {!userAddress ? (
                    <>
                        <h1>Hi there!</h1>
                        <ConnectButton
                            client={client}
                            wallets={wallets}
                            theme={"dark"}
                            connectModal={{size: "wide"}}
                            chain={CHAIN}
                        />
                    </>
                ) : isAdmin ? (
                    <AdminTools/>
                ) : (
                    <div>
                        <Setup/>
                    </div>
                )}
                <ConnectButton
                    client={client}
                    wallets={wallets}
                    theme={"dark"}
                    connectModal={{size: "wide"}}
                    chain={CHAIN}
                />
            </div>
        </div>
    );
};

export default ViewConnections2;
