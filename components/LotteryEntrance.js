import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
export default function LotteryEntrance() {
  // here we are importing an chaindid object and renaming it to chainIdHex
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const chainId = parseInt(chainIdHex);

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const dispatch = useNotification;
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        let entranceFeeFromContract = await getEntranceFee();

        setEntranceFee(entranceFeeFromContract);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);
  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };
  return (
    <div>
      Hi From Lottery Entrance!
      {raffleAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Raffle
          </button>
          Entrance Fee is : {ethers.utils.formatUnits(entranceFee, "ether")}
        </div>
      ) : (
        <div>Contract Not Detected</div>
      )}
    </div>
  );
}
