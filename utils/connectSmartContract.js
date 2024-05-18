import { ethers } from "ethers";
import abi from "../src/manual/abi.json";

export const connectSmartContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      console.log("📝🏠 Contract address: ", contractAddress);

      if (!contractAddress) {
        throw new Error(
          "Smart contract address is not defined in environment variables."
        );
      }

      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("✅🔗📝 Contract connected: ", contract);
      return contract;
    } catch (error) {
      console.error("Failed to connect to smart contract: ", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  } else {
    throw new Error("🦊 Metamask is not available");
  }
};
