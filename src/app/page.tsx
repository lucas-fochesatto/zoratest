"use client"

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createCreatorClient, SubmitParams } from '@zoralabs/protocol-sdk';
import { useAccount, useChainId, usePublicClient, useSignTypedData } from 'wagmi';
import { TypedDataDefinition } from 'viem';

export default function Home() {
  const chainId = useChainId();
  const publicClient = usePublicClient()!;
  const { address: creatorAddress } = useAccount();
  const { signTypedData, data: signature } = useSignTypedData();
  
  const [typedDataDefinition, setTypedDataDefinition] = useState<TypedDataDefinition | null>(null);
  const [submitFunction, setSubmitFunction] = useState<(params: SubmitParams) => Promise<void>>();

  useEffect(() => {
    if (chainId && publicClient && creatorAddress) {
      const creatorClient = createCreatorClient({ chainId, publicClient });

      creatorClient.createPremint({
        contract: {
          contractAdmin: creatorAddress!,
          contractName: 'Testing Contract',
          contractURI: 'ipfs://bafkreiainxen4b4wz4ubylvbhons6rembxdet4a262nf2lziclqvv7au3e',
        },
        token: {
          tokenURI: 'ipfs://bafkreice23maski3x52tsfqgxstx3kbiifnt5jotg3a5ynvve53c4soi2u',
          createReferral: "0xa9760110671d7a5a37A72F684D7D1d92F2dE84dA",
          // maximum number of tokens that can be minted.
          maxSupply: BigInt('50000'),
          // the maximum number of tokens that can be minted to a single address.
          maxTokensPerAddress: BigInt('10'),
          // the earliest time the premint can be brought onchain.  0 for immediate.
          mintStart: BigInt('0'),
          // the duration of the mint.  0 for infinite.
          mintDuration: BigInt('0'),
          // the price in eth per token, for paid mints.  0 for it to be a free mint.
          pricePerToken: BigInt('0'),
          payoutRecipient: creatorAddress!,
        },
      }).then(({ typedDataDefinition, submit }) => {
        setTypedDataDefinition(typedDataDefinition);
        setSubmitFunction(() => submit);
      }).catch(error => {
        console.error('Error creating premint:', error);
      });
    }
  }, [chainId, publicClient, creatorAddress]);

  useEffect(() => {
    if (signature && submitFunction) {
      submitFunction({ signature });
    }
  }, [signature, submitFunction]);

  const handleCreate = () => {
    if (typedDataDefinition) {
      signTypedData(typedDataDefinition);
    } else {
      console.error('Typed data not ready');
    }
  }


  return (
    <div className='flex flex-col items-center p-10 gap-8'>
      <h1 className='text-3xl'>Bem-vindo!</h1>
      
      <ConnectButton />

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
