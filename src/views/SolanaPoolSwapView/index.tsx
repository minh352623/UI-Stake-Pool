import Link from "next/link";
import { FC, Key, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";
import styles from "./index.module.css";

import { Loader, SelectAndConnectWalletButton, SolanaLogo } from "components";
import * as anchor from "@project-serum/anchor";
import { useRouter } from "next/router";
import { apiPoolSwaping } from "api/pool-swap";
import { IInitPoolSwap } from "api/pool-swap/interface";
import { Metaplex } from "@metaplex-foundation/js";
import {
  AuthorityType,
  TOKEN_PROGRAM_ID,
  createAccount,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMint,
  createSyncNativeInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
} from "@solana/spl-token";
import { Client, Token, UtlConfig } from "@solflare-wallet/utl-sdk";
import Navbar from "components/Navbar";
import { useProgram } from "./useProgram";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

const networks = ["devnet", "mainnet-beta"];
const stableCoinsSolana = [
  {
    mintAddress: "So11111111111111111111111111111111111111112",
  },
];
export const SolanaPoolSwapView: FC = ({}) => {
  const wallet = useAnchorWallet();
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box justify-between">
          <div className="flex gap-3">
            <div className="flex-none">
              <button className="btn btn-square btn-ghost">
                <span className="text-4xl">🌔</span>
              </button>
            </div>
            <div className="flex-1 px-2 mx-2">
              <div className="text-sm breadcrumbs">
                <ul className="text-xl">
                  <li>
                    <span className="opacity-40">minh352623</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Navbar></Navbar>

          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 pt-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl">
                  Pool Swaping <SolanaLogo />
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          {!wallet ? (
            <SelectAndConnectWalletButton onUseWalletClick={() => {}} />
          ) : (
            <SwapScreen />
          )}
        </div>
      </div>
    </div>
  );
};
const SwapScreen = () => {
  return (
    <div className="rounded-lg flex-1 flex justify-center">
      <div className="flex  flex-col items-center justify-center">
        <div className="text-xs">
          <NetSwap />
        </div>
      </div>
    </div>
  );
};
const NetSwap: FC<any> = ({}) => {
  const wallet: any = useAnchorWallet();
  const wallet2 = useWallet();
  const { connect, connected } = useWallet();

  const { program } = useProgram({ connection, wallet });
  console.log("🚀 ~ program:", program);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletDeploy, setWalletDeploy] = useState<any>({
    address: "jUbsGTBDiK88WR6P3jgs8ANoFbmWJP8RaEZu4KMTSuy",
  });
  const [poolInfo, setPoolInfo] = useState<any>({
    networkType: "devnet",
    userCreated: "b65d37dd-b5dc-46b3-8530-4ae86e44aac7",
  });
  const [infoTokenStableCoin, setInfoTokenStableCoin] = useState<any[]>([]);
  const [infoTokens, setInfoTokens] = useState<any[]>([]);
  const [tokensSelected, setTokensSelected] = useState<any[]>([]);
  const setValueToPoolInfo = (inputName: string, value: any) => {
    setPoolInfo((poolInfo: any) => {
      return {
        ...poolInfo,
        [inputName]: value,
      };
    });
  };
  const [fee, setFee] = useState<number>(0.1);

  const initPoolSwapSolana = async (dataInit: IInitPoolSwap) => {
    console.log("🚀 ~ initPoolSwapSolana ~ dataInit:", dataInit);
    console.log("🚀 ~ initPoolSwapSolana ~ dataInit:", tokensSelected);
    if (tokensSelected.length < 2) {
      alert("Please select 2 tokens");
      return;
    }
    dataInit.tokenAMint = tokensSelected[0];
    dataInit.tokenBMint = tokensSelected[1];

    try {
      const dataTransfer = [
        {
          address: dataInit.tokenAMint,
          amount: dataInit.amountA,
        },
        {
          address: dataInit.tokenBMint,
          amount: dataInit.amountB,
        },
        {
          address: "So11111111111111111111111111111111111111112",
          amount: fee,
        },
      ];
      const data = await transferTokenAndChargFee(dataTransfer);
      console.log("🚀 ~ initPoolSwapSolana ~ data:", data);
      const result = await apiPoolSwaping.initPoolSwap(dataInit);
      console.log("🚀 ~ initPoolSwapSolana ~ result:", result);
    } catch (e) {
      console.log("🚀 ~ initPoolSwapSolana ~ e:", e);
    }
  };

  const initPoolSwapWithProgram = async () => {
    if (!program) {
      return;
    }
    const swapPair = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array([
        217, 28, 90, 33, 45, 230, 92, 140, 184, 101, 56, 129, 43, 222, 119, 19,
        165, 200, 218, 223, 231, 240, 199, 100, 229, 224, 237, 110, 32, 83, 175,
        86, 193, 19, 119, 169, 88, 213, 5, 34, 167, 98, 175, 138, 180, 247, 82,
        87, 112, 55, 147, 21, 18, 38, 145, 146, 236, 144, 167, 16, 138, 110,
        167, 91,
      ])
    );

    const aMintPubkey = new anchor.web3.PublicKey(
      "So11111111111111111111111111111111111111112"
    );
    const bMintPubkey = new anchor.web3.PublicKey(
      "EoJUJwZ27Zkk5FbW6Zngcpuy4z5gTTCiyAi3YAi1qxWp"
    );

    const [_pda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), aMintPubkey.toBuffer(), bMintPubkey.toBuffer()],
      program.programId
    );
    const pda = _pda;
    console.log("🚀 ~ initPoolSwapWithProgram ~ pda:", pda.toBase58());
    const poolMintPubkey = await createMint(
      connection,
      swapPair,
      pda,
      null,
      2,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log(
      "🚀 ~ initPoolSwapWithProgram ~ poolMintPubkey:",
      poolMintPubkey.toBase58()
    );

    const poolAccountForAdmin = await createAccount(
      connection,
      swapPair,
      poolMintPubkey,
      swapPair.publicKey,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log(
      "🚀 ~ initPoolSwapWithProgram ~ poolAccountForAdmin:",
      poolAccountForAdmin
    );
    // const poolAccountForUserA = await createAccount(connection, swapPair, poolMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
    // const aAccountForUserA = await createAccount(connection, userA, aMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
    // const bAccountForUserA = await createAccount(connection, userA, bMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
    // const aAccountForUserB = await createAccount(connection, userB, aMintPubkey, userB.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
    // const bAccountForUserB = await createAccount(connection, userB, bMintPubkey, userB.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
    const aAccountForPDA = await getOrCreateAssociatedTokenAccount(
      connection,
      swapPair,
      aMintPubkey,
      swapPair.publicKey
    );
    console.log(
      "🚀 ~ initPoolSwapWithProgram ~ aAccountForPDA:",
      aAccountForPDA.address.toBase58()
    );
    const bAccountForPDA = await getOrCreateAssociatedTokenAccount(
      connection,
      swapPair,
      bMintPubkey,
      swapPair.publicKey
    );
    console.log(
      "🚀 ~ initPoolSwapWithProgram ~ bAccountForPDA:",
      bAccountForPDA.address.toBase58()
    );
    const DEFAULT_TOKEN_A = 1000000;
    const DEFAULT_TOKEN_B = 1000000;
    const aMint = await getMint(
      connection,
      aMintPubkey,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log("🚀 ~ initPoolSwapWithProgram ~ aMint:", aMint);
    const bMint = await getMint(
      connection,
      bMintPubkey,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log("🚀 ~ initPoolSwapWithProgram ~ bMint:", bMint);
    if (!bMint.mintAuthority) {
      return;
    }
    await setAuthority(
      connection,
      swapPair,
      aAccountForPDA.address,
      swapPair.publicKey,
      AuthorityType.AccountOwner,
      pda,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    await setAuthority(
      connection,
      swapPair,
      bAccountForPDA.address,
      swapPair.publicKey,
      AuthorityType.AccountOwner,
      pda,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    // await mintTo(connection, swapPair, aMint.address, aAccountForPDA.address, aMint.mintAuthority, DEFAULT_TOKEN_A)
    await mintTo(
      connection,
      swapPair,
      bMint.address,
      bAccountForPDA.address,
      bMint.mintAuthority,
      DEFAULT_TOKEN_B
    );

    // await mintTo(connection, swapPair, aMint.address, aAccountForUserA, aMint.mintAuthority, DEFAULT_TOKEN_A)
    // await mintTo(connection, swapPair, bMint.address, bAccountForUserA, bMint.mintAuthority, DEFAULT_TOKEN_B)
    // await mintTo(connection, swapPair, aMint.address, aAccountForUserB, aMint.mintAuthority, DEFAULT_TOKEN_A * 10)
    // await mintTo(connection, swapPair, bMint.address, bAccountForUserB, bMint.mintAuthority, DEFAULT_TOKEN_B * 10)
    const fees = {
      tradeFeeNumerator: new anchor.BN(25),
      tradeFeeDenominator: new anchor.BN(10000),
      ownerTradeFeeNumerator: new anchor.BN(5),
      ownerTradeFeeDenominator: new anchor.BN(10000),
      ownerWithdrawFeeNumerator: new anchor.BN(0),
      ownerWithdrawFeeDenominator: new anchor.BN(0),
      hostFeeNumerator: new anchor.BN(20),
      hostFeeDenominator: new anchor.BN(100),
    };

    try {
      const tx = await program.methods
        .initialize(fees)
        .accounts({
          pair: swapPair.publicKey,
          pool: poolMintPubkey,
          pda: pda,
          tokenAForPda: aAccountForPDA.address,
          tokenBForPda: bAccountForPDA.address,
          tokenPoolForInitializer: poolAccountForAdmin,
          tokenPoolForFeeReceiver: poolAccountForAdmin,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .preInstructions([
          anchor.web3.SystemProgram.transfer({
            fromPubkey: swapPair.publicKey,
            toPubkey: aAccountForPDA.address,
            lamports: DEFAULT_TOKEN_A, // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
          }),
          createSyncNativeInstruction(aAccountForPDA.address),
          await program.account.swapPair.createInstruction(swapPair),
        ])
        .signers([swapPair])
        .rpc();
      console.log("Initialize transaction signature", tx);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getTokenMetadata = async (addressToken: string) => {
    const MINT_TO_SEARCH = addressToken;
    try {
      if (addressToken == "So11111111111111111111111111111111111111112")
        throw "sol";
      const metaplex = Metaplex.make(connection);

      const tokenAddress = new anchor.web3.PublicKey(MINT_TO_SEARCH);
      console.log("🚀 getMetadataNew--------22222:", MINT_TO_SEARCH);

      let nft = await metaplex.nfts().findByMint({ mintAddress: tokenAddress });
      console.log("🚀 ~ getTokenMetadata sol ~ nft:", nft);

      return nft;
    } catch (err) {
      // return err;
      console.log("🚀 getMetadataNew--------:", MINT_TO_SEARCH);
      const tokenAddress = new anchor.web3.PublicKey(MINT_TO_SEARCH);

      const data = await getMetadataNew(tokenAddress);
      return { json: data };
    }
  };
  const getMetadataNew = async (token: anchor.web3.PublicKey) => {
    const config = new UtlConfig({
      /**
       * 101 - mainnet, 102 - testnet, 103 - devnet
       */
      chainId: 103,
      /**
       * number of miliseconds to wait until falling back to CDN
       */
      timeout: 2000,
      /**
       * Solana web3 Connection
       */
      connection: new anchor.web3.Connection(
        anchor.web3.clusterApiUrl("devnet")
      ),
      /**
       * Backend API url which is used to query tokens
       */
      apiUrl: "https://token-list-api.solana.cloud",
      /**
       * CDN hosted static token list json which is used in case backend is down
       */
      cdnUrl:
        "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json",
    });
    const utl = new Client(config);
    const tokenMetadata: Token = await utl.fetchMint(token);
    return tokenMetadata;
  };
  const getInfoTokenForWallet = async (
    mintToken?: string,
    signer: anchor.web3.PublicKey = wallet.publicKey
  ) => {
    const MINT_TO_SEARCH = mintToken;
    try {
      const filters = [
        {
          dataSize: 165, //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32, //location of our query in the account (bytes)
            bytes: signer as any, //our search criteria, a base58 encoded string
          },
        },
      ];
      if (MINT_TO_SEARCH) {
        filters.push({
          memcmp: {
            offset: 0, //number of bytes
            bytes: MINT_TO_SEARCH, //base58 encoded string
          },
        });
      }

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
      );
      const balance = await connection.getBalance(signer);
      console.log("🚀 ~ getInfoTokenForWal ~ balance:-------------", balance);
      let infoTokens: any[] = [];
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        console.log(
          "🚀 ~ accounts.forEach ~ parsedAccountInfo:",
          parsedAccountInfo
        );
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        console.log("🚀 ~ accounts.forEach ~ mintAddress:", mintAddress);
        const tokenBalance =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        infoTokens.push({
          mintAddress,
          tokenBalance,
        });
      });
      infoTokens.push({
        mintAddress: "So11111111111111111111111111111111111111112",
        tokenBalance: balance / 10 ** 9,
      });
      const data = await updateInfoTokens(infoTokens);
      console.log("🚀 ~ getInfoTokenForWal ~ data:", data);

      setInfoTokens(data);
    } catch (err) {
      console.log("🚀 ~ getInfoTokenForWal ~ err:", err);
      return {
        mintAddress: "",
        tokenBalance: 0,
      };
    }
  };

  const getFee = async () => {
    try {
      const result = await apiPoolSwaping.getFeeCreatePoolSwap({
        networkType: "devnet",
        walletConnect: wallet.publicKey,
      });
      console.log("🚀 ~ getFee ~ result:", result);
    } catch (err) {
      console.log("🚀 ~ getFee ~ err:", err);
    }
  };
  useEffect(() => {
    if (wallet.publicKey) {
      getFee();
      getInfoTokenForWallet("", new anchor.web3.PublicKey(wallet.publicKey));
    }
  }, [wallet.publicKey]);
  async function updateInfoTokens(infoTokens: any[]) {
    try {
      // console.log("🚀 ~ updateInfoTokens ~ metaDataTokens:", metaDataTokens)
      const updatedTokens = await Promise.all(
        infoTokens.map(async (token, index) => {
          if (token.tokenBalance > 1) {
            const metaDataTokens = await getTokenMetadata(token.mintAddress);
            console.log("🚀 ~ updatedTokens ~ metaDataTokens:", metaDataTokens);
            return {
              ...token,
              ...metaDataTokens?.json,
              // ...metaDataTokens[index] // Assuming metadata has a `.json` property that you want to merge
            };
          }
        })
      );
      const datas = updatedTokens.map((item) => {});
      console.log("------------------", updatedTokens); // This should now log the resolved values
      return updatedTokens; // Return or otherwise use the updated tokens
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }

  const selectToken = (addressToken: string) => {
    const tokensDuplicate = [...tokensSelected];
    if (tokensDuplicate.includes(addressToken)) {
      const tokensRemaining = tokensDuplicate.filter(
        (token) => token != addressToken
      );
      setTokensSelected(tokensRemaining);
      return;
    }
    if (tokensDuplicate.length > 1) {
      alert("Limit 2 Token");
      return;
    }
    tokensDuplicate.push(addressToken);
    setTokensSelected(tokensDuplicate);
  };

  const getTokenMint = async (mint: anchor.web3.PublicKey) => {
    return getMint(connection, mint);
  };

  const transferTokenAndChargFee = async (data: any[]) => {
    try {
      const transaction = new anchor.web3.Transaction();
      const toAddress = new anchor.web3.PublicKey(walletDeploy.address);
      console.log(tokensSelected);

      await Promise.all(
        data.map(async (token) => {
          console.log("🚀 ~ awaitPromise.all ~ token:", token);
          if (token.address == "So11111111111111111111111111111111111111112") {
            transaction.add(
              anchor.web3.SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: toAddress,
                lamports: token.amount * 10 ** 9,
              })
            );
          } else {
            const tokenAccountTo = await getAssociatedTokenAddress(
              new anchor.web3.PublicKey(token.address),
              toAddress
            );
            let account = await connection.getAccountInfo(tokenAccountTo);
            if (account == null) {
              const createATAInstruction =
                createAssociatedTokenAccountInstruction(
                  wallet.publicKey,
                  tokenAccountTo,
                  toAddress,
                  new anchor.web3.PublicKey(token.address)
                );
              transaction.add(createATAInstruction);
            }

            const source = await getOrCreateAssociatedTokenAccount(
              connection,
              wallet,
              new anchor.web3.PublicKey(token.address),
              wallet.publicKey,
              false
            );
            console.log(source.address.toString());

            transaction.add(
              createTransferInstruction(
                source.address,
                tokenAccountTo,
                wallet.publicKey,
                token.amount * Math.pow(10, 9)
              )
            );
          }
          return "";
        })
      );
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("finalized")
      ).blockhash;

      const signature = await wallet2.sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "finalized");
      console.log("🚀 ~ addReward ~ signature:", signature);

      return signature;
    } catch (error) {
      console.log("🚀 ~ transferTwoTokenAndChargFee ~ error:", error);
    }
  };

  const importToken = async (
    contractAddress: string,
    onDone?: (tx?: string) => any
  ) => {
    try {
      console.log("importToken contractAddress", contractAddress);
      const tokenMintAddress = new anchor.web3.PublicKey(contractAddress);
      console.log("importToken tokenMintAddress", tokenMintAddress);
      const associatedToken = getAssociatedTokenAddressSync(
        tokenMintAddress,
        wallet.publicKey as any as anchor.web3.PublicKey,
        false
      );
      const transaction = new anchor.web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey as any as anchor.web3.PublicKey,
          associatedToken,
          wallet.publicKey as any as anchor.web3.PublicKey,
          tokenMintAddress
        )
      );
      const tx = await wallet2.sendTransaction(transaction, connection);
      if (tx) {
        onDone && onDone(tx);
      }
      console.log("importToken", tx);
      return tx;
    } catch (err) {
      console.log("importToken", err);
    }
  };

  return (
    <div
      style={{ minWidth: 240 }}
      className="mb-8 w-[600px]  flex  flex-col gap-5"
    >
      <div className="w-full border-b border-gray-500 pb-4 ">
        <div className="flex gap-5 flex-wrap mb-3">
          {infoTokens.length > 0 &&
            infoTokens.map((token, index) => {
              if (token && token.tokenBalance > 1 && token && token?.symbol) {
                return (
                  <div
                    key={index}
                    onClick={() => selectToken(token.mintAddress)}
                    className=" relative flex gap-3 items-center rounded-lg bg-purple-600 p-2 cursor-pointer hover:scale-110 transition-all"
                  >
                    {tokensSelected.includes(token.mintAddress) && (
                      <div className="p-1 absolute bg-yellow-400 top-[-16px] right-0 text-black">
                        {tokensSelected[1] &&
                        tokensSelected[1] == token.mintAddress
                          ? "TokenB"
                          : "Token A"}
                      </div>
                    )}
                    <img
                      src={
                        token?.image
                          ? token?.image
                          : token?.logoURI
                          ? token?.logoURI
                          : "question.webp"
                      }
                      className="w-[30px] h-[30px] rounded-full"
                      alt=""
                    />
                    <div className="flex flex-col gap-1 ">
                      <span className="font-bold">
                        {token?.symbol ? token.symbol : "Unrecognized Token"}
                      </span>
                      <span className="">{token.tokenBalance}</span>
                    </div>
                  </div>
                );
              }
            })}
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1 w-[50%]">
            <span>Amount Token A</span>
            <input
              name="amountA"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "amountA";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Amount Token A"
              className="mb-4 "
            ></input>
          </div>
          <div className="flex flex-col gap-2 flex-1 w-[50%]">
            <span>Amount Token B</span>
            <input
              name="amountB"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "amountB";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Amount Token B"
              className="mb-4 "
            ></input>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Curve Type</span>
            <input
              name="curveType"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "curveType";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Curve Type"
              className="mb-4"
            ></input>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <span>Network Type</span>
            <select
              onChange={(e) => {
                const value = e.target.value;
                console.log("🚀 ~ value:", value);
                const nameKey = "networkType";
                setValueToPoolInfo(nameKey, value);
              }}
              className="bg-[rgba(0, 0, 0, 0.1)]"
              name=""
              id=""
            >
              {networks.map((network) => {
                return (
                  <option
                    selected={poolInfo.networkType == network}
                    value={network}
                  >
                    {network}
                  </option>
                );
              })}
            </select>
            {/* <input name="networkType" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "networkType"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Network Type" className="mb-4"></input> */}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Owner Fee Address</span>

            <input
              name="ownerFeeAddress"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "ownerFeeAddress";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Owner Fee Address"
              className="mb-4 flex-1"
            ></input>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <span>Fee</span>
            <input
              name="fee"
              readOnly
              value={fee ? `${fee} SOL` : "0 SOL"}
              placeholder="Fee"
              className="mb-4 flex-1 text-yellow-500"
            ></input>
          </div>
        </div>

        {loading ? (
          <Loader></Loader>
        ) : (
          <button
            className="btn btn-primary rounded-full normal-case	w-full"
            onClick={() => initPoolSwapSolana(poolInfo)}
            style={{ minHeight: 0, height: 40 }}
          >
            Create pool swap
          </button>
        )}
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => initPoolSwapWithProgram()}
          style={{ minHeight: 0, height: 40 }}
        >
          Create pool swap program
        </button>
      </div>
    </div>
  );
};
