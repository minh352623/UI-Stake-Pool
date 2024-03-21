import Link from "next/link";
import { FC, Key, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";
import { Metaplex, PublicKey } from '@metaplex-foundation/js';
import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { useProgram } from "./useProgram";
import { ASSOCIATED_TOKEN_PROGRAM_ID, AuthorityType, TOKEN_PROGRAM_ID, createAccount, createAssociatedTokenAccountInstruction, createMint, createMintToInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getMint, getOrCreateAssociatedTokenAccount, setAuthority } from "@solana/spl-token";
import { SPL_TOKEN_PROGRAM_ID, splTokenProgram } from "@coral-xyz/spl-token";
import { getNextUnusedStakeReceiptNonce } from "@mithraic-labs/token-staking";
import { apiPoolStaking } from "api/pool-staking";
import { IInfoPoolStake } from "api/pool-staking/Interface";
import { useRouter } from "next/router";
import { Client, Token, UtlConfig } from '@solflare-wallet/utl-sdk';
import Navbar from "components/Navbar";
const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);
// const listPoolStake = [
//   {
//     "authority": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
//     "mint": "HswdwZUEAavy8G48qSQEFDpQBqDrpzEUxEm2JMDjANKB",
//     "stake_mint": "9RyrszWsFZww6N8tyrBy8QixLN6S72KgzYU62M4hwshR",
//     "vault": "8ArWpdPbgBtWmt8dmq4UWS1AfNToGMzrJMww3yp5SKSi",
//     "creator": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
//     "totalWeightedStake": "0",
//     "base_weight": "1000000000",
//     "max_weight": "5000000000",
//     "min_duration": "1000",
//     "max_duration": "31536000",
//     "pool_key": "7bJNmcFagSsaybag8AAeM63EY8b8vXvssZuL8ASvP3Gk",
//     "pool_rewards": []
//   },
//   {
//     "authority": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
//     "mint": "AsNGZoLtMHxFJux4tzkFjqJa2yq9iYmYhPkGNTK1FmTN",
//     "stakeMint": "9UbcfdHahVGPQgYRBBjRx1CKttafXNvT6BxtrmseCS48",
//     "vault": "F1ujYqD3WZUC1mXVXhKuJvs8tp7HKR4iQfhuUUzC2KQm",
//     "creator": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
//     "totalWeightedStake": 0,
//     "base_weight": 1000000000,
//     "max_weight": 4000000000,
//     "min_duration": 1000,
//     "max_duration": 63072000,
//     "pool_key": "2CsCkuDJqr3oZ2HiCKf7EPcC1YYUg321krFR9L1ugjtR",
//     pool_rewards: [{
//       mint_address: "9Hq2LbrRkZxa5pzuTVK5M4XmMFebb5ugJBaxhXDtCGf6"
//     }]
//   },
//   {
//     "authority": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
//     "mint": "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn",
//     "stakeMint": "HkX3vYzxZDZ94JYbY3AVsKpzpqjUiEFFSDJgp76akLUi",
//     "vault": "9sp1gKnudui5jJ9BSnk8c7jo2hz22yY1KjYUbqj3u2UF",
//     "creator": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
//     "totalWeightedStake": "00",
//     "base_weight": "3b9aca00",
//     "max_weight": "ee6b2800",
//     "min_duration": "00",
//     "max_duration": "01e13380",
//     "pool_key": "D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp",
//     "pool_rewards": [{
//       mint_address: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm"
//     }, { mint_address: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd" }]
//   },

// ]

export const SolanaSwapVersionTwo: FC = ({ }) => {
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
                                    Pool Staking <SolanaLogo />
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="flex justify-center">
                    {!wallet ? (
                        <SelectAndConnectWalletButton onUseWalletClick={() => { }} />
                    ) : (
                        <SawpScreen />
                    )}
                </div>
            </div>
        </div>
    );
};

const SawpScreen = () => {
    return (
        <div className="rounded-lg flex justify-center">

            <div className="flex flex-col items-center justify-center">
                <div className="text-xs">
                    <NetSwap />

                </div>

            </div>
        </div>
    );
};

type NetSwap = {
    // onSwapSent: (t: any) => void;
};

interface IPoolInit {
    mintAddress: string,
    none: number,
    min_duration: number,
    max_duration: number,
    max_weight: number,
    block_time: number,
    token_on_block_time: number
}

interface IInfoToken {
    mintAddress: string,
    tokenBalance: number
}

export const GlobalState = {
    SEED: "global_state",
};

const NetSwap: FC<NetSwap> = ({ }) => {
    const wallet: any = useAnchorWallet();
    const wallet2 = useWallet()
    const { program } = useProgram({ connection, wallet });
    const [loading, setLoading] = useState<boolean>(false);
    console.log("🚀 ~ program:", program)
    const [poolInfo, setPoolInfo] = useState<any>({
        networkType: "devnet",
        userCreated: "b65d37dd-b5dc-46b3-8530-4ae86e44aac7"
    })

    // admin
    const inittialPoolSwap = async (data: IPoolInit) => {
        if (!program) return;
        const fees = {
            tradeFeeNumerator: new anchor.BN(25),
            tradeFeeDenominator: new anchor.BN(10000),
            ownerTradeFeeNumerator: new anchor.BN(5),
            ownerTradeFeeDenominator: new anchor.BN(10000),
            ownerWithdrawFeeNumerator: new anchor.BN(0),
            ownerWithdrawFeeDenominator: new anchor.BN(0),
            hostFeeNumerator: new anchor.BN(20),
            hostFeeDenominator: new anchor.BN(100),
        }
        try {
            const admin = anchor.web3.Keypair.fromSecretKey(new Uint8Array(
                [43, 75, 111, 133, 60, 34, 33, 108, 243, 78, 85, 26, 98, 179, 0, 94, 116, 193, 147, 86, 122, 217, 11, 178, 172, 37, 40, 213, 227, 148, 234, 56, 56, 112, 133, 192, 183, 39, 161, 240, 167, 254, 201, 74, 193, 15, 227, 184, 247, 74, 200, 182, 156, 18, 88, 153, 240, 52, 8, 35, 92, 52, 171, 119]
            ));
            const swapPair = anchor.web3.Keypair.generate();
            const aMintPubkey = new anchor.web3.PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")
            const bMintPubkey = new anchor.web3.PublicKey("HkpGiFiQB6QEC8wPGwukM15FfJLTBZpcwcmMRtCP2MrN")
            const [_pda, _] = await PublicKey.findProgramAddress([Buffer.from("pool"), aMintPubkey.toBuffer(), bMintPubkey.toBuffer()], program.programId);
            const pda = _pda
            const poolMintPubkey = await createMint(connection, admin, pda, null, 2, undefined, undefined, TOKEN_PROGRAM_ID);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const poolMint: any = await getMint(connection, poolMintPubkey)
            const aMint: any = await getMint(connection, aMintPubkey)
            const bMint: any = await getMint(connection, bMintPubkey)
            console.log("Token Mint")
            if (!poolMint) {
                console.log("no poolMint");
                return;
            }
            console.table([
                { name: "LP", address: poolMintPubkey.toBase58(), authority: poolMint.mintAuthority.toBase58() },
                { name: "A", address: aMintPubkey.toBase58(), authority: aMint.mintAuthority.toBase58() },
                { name: "B", address: bMintPubkey.toBase58(), authority: bMint.mintAuthority.toBase58() },
            ])

            const poolAccountForAdmin = await createAccount(connection, admin, poolMintPubkey, admin.publicKey, anchor.web3.Keypair.generate());
            // poolAccountForUserA = await createAccount(connection, admin, poolMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
            // aAccountForUserA = await createAccount(connection, userA, aMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
            // bAccountForUserA = await createAccount(connection, userA, bMintPubkey, userA.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
            // aAccountForUserB = await createAccount(connection, userB, aMintPubkey, userB.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
            // bAccountForUserB = await createAccount(connection, userB, bMintPubkey, userB.publicKey, undefined, undefined, TOKEN_PROGRAM_ID);
            const aAccountForPDA:any = await createAccount(connection, admin, aMintPubkey, admin.publicKey, anchor.web3.Keypair.generate());
            const bAccountForPDA:any = await createAccount(connection, admin, bMintPubkey, admin.publicKey, anchor.web3.Keypair.generate());
            // await setAuthority(connection, admin, aAccountForPDA, admin.publicKey, AuthorityType.AccountOwner, pda, undefined, undefined, TOKEN_PROGRAM_ID)
            // await setAuthority(connection, admin, bAccountForPDA, admin.publicKey, AuthorityType.AccountOwner, pda, undefined, undefined, TOKEN_PROGRAM_ID)
            // await mintTo(connection, admin, aMint.address, aAccountForPDA, aMint.mintAuthority, DEFAULT_TOKEN_A)
            // await mintTo(connection, admin, bMint.address, bAccountForPDA, bMint.mintAuthority, DEFAULT_TOKEN_B)
            // await mintTo(connection, admin, aMint.address, aAccountForUserA, aMint.mintAuthority, DEFAULT_TOKEN_A)
            // await mintTo(connection, admin, bMint.address, bAccountForUserA, bMint.mintAuthority, DEFAULT_TOKEN_B)
            // await mintTo(connection, admin, aMint.address, aAccountForUserB, aMint.mintAuthority, DEFAULT_TOKEN_A * 10)
            // await mintTo(connection, admin, bMint.address, bAccountForUserB, bMint.mintAuthority, DEFAULT_TOKEN_B * 10)
            const tx = await program.methods.initialize(fees)
                .accounts({
                    pair: swapPair.publicKey,
                    pool: poolMintPubkey,
                    pda: pda,
                    tokenAForPda: aAccountForPDA,
                    tokenBForPda: bAccountForPDA,
                    tokenPoolForInitializer: poolAccountForAdmin,
                    tokenPoolForFeeReceiver: poolAccountForAdmin,
                    tokenProgram: TOKEN_PROGRAM_ID,
                }).preInstructions([
                    await program.account.swapPair.createInstruction(swapPair),
                ]).signers([swapPair]).rpc();
            console.log("Initialize transaction signature", tx);
        } catch (e) {
            console.error(e)
            throw e
        }
    }


    const setValueToPoolInfo = (inputName: string, value: any) => {
        setPoolInfo((poolInfo: any) => {
            return {
                ...poolInfo,
                [inputName]: value
            }
        })
    }

    return (
        <div style={{ minWidth: 240 }} className="mb-8   flex  w-[600px] flex-col gap-5">
            <div className="w-full border-b border-gray-500 pb-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 w-[70%]">
                        <span>Mint Address</span>
                        <input name="mintAddress" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "mintAddress"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Enter address token stake" className="mb-4 "></input>
                    </div>
                    <div className="flex flex-col gap-2 w-[30%]">
                        <span>None</span>
                        <input name="none" type="number" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "none"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="None" className="mb-4 "></input>
                    </div>

                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Min Duration</span>
                        <input name="min_duration" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "min_duration"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Min Duration" className="mb-4"></input>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <span>Max Duration</span>
                        <input name="max_duration" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "max_duration"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Max Duration" className="mb-4"></input>
                    </div>

                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Min Weight</span>
                        <input name="minWeight" value={0} readOnly onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "minWeight"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Min Weight" className="mb-4"></input>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Max Weight</span>
                        <input name="max_weight" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "max_weight"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Max Weight" className="mb-4"></input>
                    </div>

                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Block Time</span>
                        <input name="block_time" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "block_time"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Min Weight" className="mb-4"></input>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Token On Block Time</span>
                        <input name="token_on_block_time" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "token_on_block_time"
                            setValueToPoolInfo(nameKey, value)
                        }
                        } placeholder="Token On Block Time" className="mb-4"></input>
                    </div>

                </div>

                {loading ?
                    <Loader></Loader>
                    : <button
                        className="btn btn-primary rounded-full normal-case	w-full"
                        onClick={() => inittialPoolSwap(poolInfo)}
                        style={{ minHeight: 0, height: 40 }}
                    >
                        Create pool stake
                    </button>
                }





            </div>
        </div>
    );
};
