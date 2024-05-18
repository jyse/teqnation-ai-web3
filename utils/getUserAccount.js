import { ethers } from "ethers";
import abi from "../src/manual/abi.json";

export const getUserAccount = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      // Return the first account address
      return accounts[0];
    } catch (error) {
      console.error("Error fetching accounts: ", error);
      return null; // Handle errors or absence of MetaMask appropriately
    }
  } else {
    console.log("MetaMask is not installed.");
    return null; // Handle case where MetaMask is not installed
  }
};
