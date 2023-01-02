import { abi, contractAddress } from "../constants/index";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
export default function LotteryEntrance() {
  // here we are importing an chaindid object and renaming it to chainIdHex
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isLoading,
    isFetching,
  } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const chainId = parseInt(chainIdHex)
  
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const dispatch = useNotification();

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

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    
    const entranceFeeFromContract = (await getEntranceFee()).toString();
   
    
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFromContract);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
    
  }

  async function updateRecentWinner() {
    const filter = {
      address: contractAddress,
      topics: [ethers.utils.id("WinnerPicked(address)")],
    };
   
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateRecentWinner();
    updateUI();
    handleNewNotification(tx);
  };
  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>

          <div>
            Entrance Fee is : {ethers.utils.formatUnits(entranceFee, "ether")}
            <br />
            The Current number of Players is:{numPlayers}
            <br />
            The most previous winner was: {recentWinner}
            <br />
          </div>
        </div>
      ) : (
        <>
        
        <div>Contract Not Detected Connect your wallet to goerli testnet</div>
        </>
      )}
    </div>
  );
}