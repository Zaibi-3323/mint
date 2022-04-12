import { useWallet } from "@solana/wallet-adapter-react";
import { ParamsWithStore } from '@metaplex-foundation/mpl-token-vault';
import { Borsh, TupleNumericType } from '@metaplex-foundation/mpl-core';
import { actions, programs, transactions } from '@metaplex/js';
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, clusterApiUrl,Transaction,SystemProgram, TransactionInstruction,SYSVAR_RENT_PUBKEY, sendAndConfirmTransaction } from "@solana/web3.js";
import { ENV as ChainId } from "@solana/spl-token-registry";
import { FC, useEffect, useState } from "react";
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  AccountLayout,
  Token,
  // NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";
import { PriceFloor, PriceFloorType, WinnerLimit, WinnerLimitType } from '@metaplex-foundation/mpl-auction';
import axios from "axios";
import BN from 'bn.js';
import moment from 'moment';
import { serialize } from 'borsh';
import {
  AUCTION_SCHEMA,
  AmountRange,
  SAFETY_DEPOSIT_BOX_SCHEMA,
  SafetyDepositConfig,
  SetAuthorityArgs,
  SetWhitelistedCreatorArgs,
  ValidateSafetyDepositBoxV2Args,
  WHITELIST_CREATOR_SCHEMA,
  metaplexConfirm,
  toPublicKey } from './consts';
  import {
    deploySolanaNFT,
  } from './solanaDoc'
  import { toast } from "react-toastify";
const nacl = require('tweetnacl');
const metaplex = require('@metaplex/js');
const bs58 = require('bs58');
toast.configure();
const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;
const storeID = process.env.REACT_APP_STORE_ID || '';
const storeKey = new PublicKey(storeID);
const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112");

interface Token2Add {
  tokenAccount: PublicKey;
  tokenMint: PublicKey;
  amount: BN;
}
export class Creator {
  address: string;
  verified: boolean;
  share: number;

  constructor(args: { address: string; verified: boolean; share: number }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

const WalletTest: FC = () => {
  
    const wallet: any = useWallet();
  
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);
    const [tokenAccountAddress, setTokenAccountAddress] = useState<string>("");
    const [mintsToVault, setMintsToVault] = useState<Token2Add[]>([]);
    const [availableMints, setAvailableMints] = useState<any[]>([]);
    const [metaDataMints, setMetaDataMints] = useState<any[]>([]);
    const [attributes, setAttributes] = useState<any>({
      name: "",
      description: "",
      symbol: "",
      external_url: "",
      image: "",
      animation_url: undefined,
      attributes: undefined,
      sellerFeeBasisPoints: 1000,
      // creators: creators,
      properties: {
        files: [],
        category: "image",
      },
    });
    
    // Vaults
    const [VaultsList, setVaultsList] = useState<any[]>([]);
    const [inActiveVaultsList, setInActiveVaultsList] = useState<any[]>([]);
    // -------------------------------------------------------
    // Auction
    const [AuctionList, setAuctionList] = useState<any[]>([]);
    const [AuctionListed, setAuctionListed] = useState<any[]>([]);
    // -------------------------------------------------------
    // 
    const [externalPriceAccountV1, setExternalPriceAccount] = useState<any>(); 
    // -------------------------------------------------------
    const [Store, SetStore] = useState<any>({storeId:storeKey}); 
    const [deployToken, setDeployToken] = useState<any>(); 
    const endpoint = {
      name: "devnet",
      label: "devnet",
      url: clusterApiUrl("devnet"),
      chainId: ChainId.Devnet,
    };
    // State
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletConnected, setWallet] = useState<any>();
    const [creators, setCreators] = useState([
      new Creator({
        address: wallet.publicKey?.toBase58(),
        verified: true,
        share: 100,
      }),
    ]);
    // Actions
     useEffect(() => {
      if (wallet.connected) {
        wallet.privateKey = PrivateKey;
        setWalletAddress(wallet.publicKey?.toBase58())
      }
    }, [wallet]);
  
    useEffect(() => {
      if (wallet.connected) {
        setCreators([
          new Creator({
            address: wallet.publicKey?.toBase58(),
            verified: true,
            share: 100,
          }),
        ]);
  
      }
    }, [wallet]);
    // minting ===============================================
    const pinFileToIPFS = async (file: any): Promise<any> => {
      let data: any = new FormData();
      data.append("file", file);
      data.append("pinataMetadata", JSON.stringify({
        name:"zain",
        creator: creators
      }));
      
      const fileData: any = await uploadFileToIpfs(data);
      const fileUrl: string = `https://gateway.pinata.cloud/ipfs/${fileData.data.IpfsHash}`;
      const fileOutputData = {fileUrl,hash:fileData.data.IpfsHash};
      const metaData: any = await uploadJsonToIpfs(fileOutputData);
      return metaData
    };
    const uploadFileToIpfs = async (formData: any) => {
      console.log('formData=====>', formData.get('file'));
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      //we gather a local file from the API for this example, but you can gather the file from anywhere
      const response = await axios.post(url, formData,  {
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
          "Authorization": `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });
      console.log('response=========>', response)
      return response;
    };
    const uploadJsonToIpfs = async (dataInput: any) => {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const data = {
        "name": "zain",
        "symbol": "Gamo",
        "sellerFeeBasisPoints": 0,
        "image": dataInput.fileUrl,
        "description": "Description",
        "properties": {
          "creators": creators?.map((creator: any) => {
            return {
              address: creator?.address,
              share: creator?.share,
            };
          }),
        }
      };
      //we gather a local file from the API for this example, but you can gather the file from anywhere
      const response = await axios.post(url, data,  {
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });
      console.log('response=========>', response)
      dataInput.metaDataUrl = 'https://gateway.pinata.cloud/ipfs/'+response.data.IpfsHash
      return dataInput;
    };
    const mintNewNFT = async () => {
      // console.log('file state==============>', file)
      const uploadedNftFile = await pinFileToIPFS(file);
      console.log("uploadedNftFile =========> ", uploadedNftFile);
  
      const connection = new Connection(endpoint.url, "confirmed");
      if(wallet) {
        wallet.privateKey = PrivateKey;
        const mintResponse = await deploySolanaNFT({from:wallet,maxSupply:2,uri:uploadedNftFile.metaDataUrl,testnet:true});
        
        console.log('mint response', mintResponse);
        const validMetaData = mintResponse.metadata.toBase58();
        const edition = mintResponse.edition.toBase58();
        const mint = mintResponse.mint.toBase58();
        const txId = mintResponse.txId;
        const mintMetadata ={
          validMetaData,
          edition,
          txId,
          mint
        }
         const data = {
          mintMetadata,
          mint,
          mintUri:uploadedNftFile.fileUrl,
          ipfsMetaData:uploadedNftFile,
          supply:2,
          creators,
          currentOwner: wallet.publicKey.toBase58(),
          previousOwner:'',
          status:'minted',
          price:1,
        }
        const resp = await axios.post('http://localhost:5000/nfts/mintNft', data)
        const mintMeta:any = { ...mintResponse, mintID:resp.data.mintId };
        setMetaDataMints([mintMeta, ...metaDataMints]);
        toast.success("Success -- !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }else{
        alert('wallet not connected');
      }
      // console.log("🚀 ~ file: TestComponentFile.js ~ line 19 ~ mintNFT ~ connection", connection)
    };
    const mintForm = () => {
        return (
          <div className="container">
            <h1>Mint Your NFT</h1>
            <div className='card'>
              <div className='m-5'>
                {/* <div className='text-secondary text-bold'>Name </div>
                <input className='form-control' name="name" onChange={e => setName(e.target.value)} placeholder="enter name here..." />
                <div className='text-secondary text-bold mt-3'>Description </div>
                <textarea className='form-control' rows={4} name="description" onChange={e => setDesc(e.target.value)} placeholder="enter description here..."></textarea> */}
                <div className='text-secondary text-bold mt-3'>Select Image</div>
                <input
                  type="file"
                  className="btn btn-info text-white btn-sm"
                  name="file"
                  multiple={false}
                  onChange={handleImage}
                />
                <hr />
                <button className='btn btn-primary' onClick={mintNewNFT}>Mint NFT</button>
                <button className='btn btn-primary' onClick={getAllNftsFromWallet}>getAllNftsFromWallet  </button>
                {/* <button className='btn btn-primary' onClick={createStoreFun}>init Store  </button> */}
                {/* <button className='btn btn-primary' onClick={getListedAuctions}>get Listed Auctions  </button> */}
                
                
                {/* <button className='btn btn-primary' onClick={createVault}>create Vault </button>
                <button className='btn btn-primary' onClick={initVault}>Init Vault </button>
                
                <button className='btn btn-primary' onClick={deploySolanaToken}>deploy solana token  </button>
                <button className='btn btn-primary' onClick={mintSolanaToken}>mint solana token  </button>
                <button className='btn btn-primary' onClick={createExternalPriceTransaction}>Create external  </button>
                <button className='btn btn-primary' onClick={listAuctions}>listAuctions  </button> */}
                
              </div>
            </div>
          </div>
      );
    };
    const getAllNftsFromWallet = async () => {
      const ownerPublickey = wallet.publicKey;
      const connection = new Connection(endpoint.url, "confirmed");
      const NFTMetaData = await Metadata.findDataByOwner(connection, ownerPublickey);
      const NFTMintsData = []
      for(let mintItem of NFTMetaData) {
          const metaData:any = await axios.get(mintItem.data.uri);
          const mintData:any = {...mintItem};
          if(metaData.data){
          mintData.metaData = metaData.data;
          }
          NFTMintsData.push(mintData);
      }
      setAvailableMints(NFTMintsData);
      console.log(":rocket: ~ file: TestComponentFile.js ~ line 33 ~ getAllNftsFromWal ~ NFTMetaData", NFTMetaData);
    };
    const handleImage = (e: any) => {
      const file = e.target.files[0];
      setFile(file);
      // let reader: any = new FileReader();
      // if (file) {
      //   reader.onloadend = () => {
      //     setFile(reader?.result);
      //   };
      //   reader.readAsDataURL(file);
      // }
      // if(e.target.files.length > 0) {
      //   setFile(e.target.files[0])
      // }
    };
    const showMints = () => {
        return (
          <div className="container">
            <h1>available Mints</h1>
            <div className="container">
              <div className="col-md-12 row">
                {availableMints.map((item, index) => {
                  return(
                    <div key={index} className='card col-md-3'>
                      <h6>Mint {item.mint}</h6>
                      <img src={item?.metaData?.image} width="100%" height="100px" alt="image"/>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
    };
    // =========================================================
   
    return (
        <div className="App">
          <div className="container">
            {/* <div className="header-container">
              <p className="header">🍭</p>
              <p className="sub-text">Minting Portal</p>
              {!walletAddress && renderNotConnectedContainer()}
            </div> */}
            {mintForm()}
            {/* {showInActiveVaults()} */}
            {showMints()}
            {/* {listAuctions()} */}
            {/* <div className="footer-container">
              <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
              <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`built on @${TWITTER_HANDLE}`}</a>
            </div> */}
          </div>
        </div>
      );

};
export default WalletTest;