import { useWallet } from "@solana/wallet-adapter-react";
import { actions, programs } from "@metaplex/js";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { ENV as ChainId } from "@solana/spl-token-registry";
import { useEffect } from "react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

const WalletTest = () => {
  const wallet = useWallet();

  const endpoint = {
    name: "devnet",
    label: "devnet",
    url: clusterApiUrl("devnet"),
    chainId: ChainId.Devnet,
  };
  const connection = new Connection(endpoint.url, "confirmed");
  const mintNFT = async () => {
    console.log("🚀 ~ file: TestComponentFile.js ~ line 19 ~ mintNFT ~ connection", connection);
    const mintNFTResponse = await actions.mintNFT({
      connection,
      wallet: wallet,
      uri: `https://gateway.pinata.cloud/ipfs/QmTSQbVgwANrduUFgWweohHYpVRWpc4jUEM4DX4fVrxc2a`,
      maxSupply: 1,
    });
    console.log("🚀 ~ file: TestComponentFile.js ~ line 5 ~ WalletTest ~ wallet", mintNFTResponse);
  };

  const getAllNftsFromWallet = async () => {
    const ownerPublickey = wallet.publicKey;
    const NFTMetaData = await Metadata.findDataByOwner(connection, ownerPublickey);
    console.log("🚀 ~ file: TestComponentFile.js ~ line 33 ~ getAllNftsFromWal ~ NFTMetaData", NFTMetaData);
  };

  useEffect(() => {
    getAllNftsFromWallet();
  });
  return <div></div>;
};
export default WalletTest;
