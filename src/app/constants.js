import {createThirdwebClient, getContract} from "thirdweb";

import {bscTestnet} from "thirdweb/chains";

// import type {ThirdwebClient} from "thirdweb/src/client/client";
// import type {Chain} from "thirdweb/src/chains/types";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
    throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
    clientId: clientId,
});

export const CHAIN = bscTestnet;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
//
export const contract = getContract({
    client,
    address: CONTRACT_ADDRESS,
    chain: CHAIN,
});
