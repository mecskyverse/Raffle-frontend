import { useEffect } from "react";
import { useMoralis } from "react-moralis";
export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateMoralis,
  } = useMoralis();

  return <div>Hi there</div>;
}
