"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { createCreatorClient, createCollectorClient } from "@zoralabs/protocol-sdk";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient, useAccount, useWriteContract } from "wagmi";

export default function Mint() {
    const chainId = useChainId();
    const publicClient = usePublicClient()!;
    const { address } = useAccount();
    const { writeContract } = useWriteContract();

    const creatorClient = createCreatorClient({ chainId, publicClient });

    const [tokens, setTokens] = useState();

    // initiate the collector client
    const collectorClient = createCollectorClient({ chainId, publicClient });

    useEffect(() => {

        const fetchTokens = async () => {
            if(!address) return;
            const tokens = await collectorClient.getTokensOfContract({
                tokenContract: "0xBAeB4Df378f18D50D723eE624043e62E012bC32d",
            });

            console.log(tokens)

            setTokens(tokens as any);
        }

        fetchTokens();
    }, [address])

    const handleCreateToken = async () => {
        const { parameters } = await creatorClient.create1155({
            // by providing a contract creation config, the contract will be created
            // if it does not exist at a deterministic address
            contract: "0xBAeB4Df378f18D50D723eE624043e62E012bC32d",
            token: {
                tokenMetadataURI: "ipfs://DUMMY/token.json",
            },
            // account to execute the transaction (the creator)
            account: address!,
        });

        writeContract(parameters)
    }

    return (
        <div>
            <button onClick={handleCreateToken}>Create Token</button>

            <ConnectButton/>
        </div>
    )
}