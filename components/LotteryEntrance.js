import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
export default function LotteryEntrance() {
  // here we are importing an chaindid object and renaming it to chainIdHex
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log(`contract address = ${contractAddress}`);

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  // const { runContractFunction: enterRaffle } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: raffleAddress,
  //   functionName: "enterRaffle",
  //   params: {},
  //  msg.value,
  // });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        const something = await getEntranceFee();
        console.log(something);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);
  return <div>chain Id = {chainId}</div>;
}
