import Link from "next/link";
import { FC, Key, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";
import { Metaplex } from '@metaplex-foundation/js';
import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { swap } from "./swap";
import { useProgram } from "./useProgram";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMintToInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { SPL_TOKEN_PROGRAM_ID, splTokenProgram } from "@coral-xyz/spl-token";
import { getNextUnusedStakeReceiptNonce } from "@mithraic-labs/token-staking";
import { SplTokenStaking } from "./spl_token_staking";
import { apiPoolStaking } from "api/pool-staking";
import { IInfoPoolStake } from "api/pool-staking/Interface";

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

export const SolanaPoolStakeView: FC = ({ }) => {
  const wallet = useAnchorWallet();


  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
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
            <SwapScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const SwapScreen = () => {
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
  max_weight: number
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
  console.log("🚀 ~ program:", program)
  const [amountReward, setAmountReward] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [poolInfo, setPoolInfo] = useState<IPoolInit>({
    mintAddress: "",
    none: 0,
    min_duration: 0,
    max_duration: 31536000 * 4,
    max_weight: 4
  })
  const [tokenReward, setTokenReward] = useState<string>("")
  const [infoTokens, setInfoTokens] = useState<any[]>([])
  const [historyAddReward, setHistoryAddreward] = useState<any[]>([
    {
      mint_address: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm",
      date_time: 1708503662366,
      amount: 5
    },
    {
      mint_address: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd",
      date_time: 1708503662366,
      amount: 10
    }
  ])
  const setValueToPoolInfo = (inputName: string, value: any) => {
    setPoolInfo(poolInfo => {
      return {
        ...poolInfo,
        [inputName]: value
      }
    })
  }

  const [listPoolStake, setListPoolStake] = useState<any[]>(
    [
      {
        "authority": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
        "mint": "HswdwZUEAavy8G48qSQEFDpQBqDrpzEUxEm2JMDjANKB",
        "stakeMint": "9RyrszWsFZww6N8tyrBy8QixLN6S72KgzYU62M4hwshR",
        "vault": "8ArWpdPbgBtWmt8dmq4UWS1AfNToGMzrJMww3yp5SKSi",
        "creator": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
        "totalWeightedStake": "0",
        "base_weight": "1000000000",
        "max_weight": "5000000000",
        "min_duration": "1000",
        "max_duration": "31536000",
        "pool_key": "7bJNmcFagSsaybag8AAeM63EY8b8vXvssZuL8ASvP3Gk",
        "pool_rewards": []
      },
      {
        "authority": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
        "mint": "AsNGZoLtMHxFJux4tzkFjqJa2yq9iYmYhPkGNTK1FmTN",
        "stakeMint": "9UbcfdHahVGPQgYRBBjRx1CKttafXNvT6BxtrmseCS48",
        "vault": "F1ujYqD3WZUC1mXVXhKuJvs8tp7HKR4iQfhuUUzC2KQm",
        "creator": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
        "totalWeightedStake": 0,
        "base_weight": 1000000000,
        "max_weight": 4000000000,
        "min_duration": 1000,
        "max_duration": 63072000,
        "pool_key": "2CsCkuDJqr3oZ2HiCKf7EPcC1YYUg321krFR9L1ugjtR",
        pool_rewards: [{
          mint_address: "9Hq2LbrRkZxa5pzuTVK5M4XmMFebb5ugJBaxhXDtCGf6"
        }]
      },
      {
        "authority": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
        "mint": "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn",
        "stakeMint": "HkX3vYzxZDZ94JYbY3AVsKpzpqjUiEFFSDJgp76akLUi",
        "vault": "9sp1gKnudui5jJ9BSnk8c7jo2hz22yY1KjYUbqj3u2UF",
        "creator": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
        "totalWeightedStake": "00",
        "base_weight": "3b9aca00",
        "max_weight": "ee6b2800",
        "min_duration": "00",
        "max_duration": "01e13380",
        "pool_key": "D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp",
        "pool_rewards": [{
          mint_address: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm"
        }, { mint_address: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd" }]
      },

    ]
  )

  const [poolStakeSelect, setPoolStakeSelect] = useState<IInfoPoolStake>({
    "authority": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
    "mint": "HswdwZUEAavy8G48qSQEFDpQBqDrpzEUxEm2JMDjANKB",
    "stakeMint": "2QXc1Xg1YyAZG83uCzRTHuZVNLFsXmG4WBsyc29CMQ9D",
    "vault": "Cd857YP77LKugMrpBWSdfWDNAUU6dRJa6fM4b73jBMht",
    "creator": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
    "totalWeightedStake": "",
    "base_weight": "1000000000",
    "max_weight": "5000000000",
    "min_duration": "1000",
    "max_duration": "31536000",
    "pool_key": "7LiC86n7YWVv9ySwB8GvV7xkszd7moGA4Wdyn7guc9qA",
    "pool_rewards": []
  })
  // {
  //   "authority": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
  //   "mint": "GHANstGTbisEQ3wYo5soc6pXtr3yUCkNckP9nFkiZScH",
  //   "stakeMint": "CxpkQL5Y96H5opHp1mzHinSuX7GCe3FMAYVSDqJGzJ9d",
  //   "vault": "rXdRpQyGCxBuje1FXrDe1PUzzhRn3sXVAyVBABC4bWF",
  //   "creator": "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
  //   "totalWeightedStake": "0",
  //   "base_weight": "1000000000",
  //   "max_weight": "3000000000",
  //   "min_duration": "1000",
  //   "max_duration": "31536000",
  //   "pool_key":"B3ULFQeTDB3AgzzB8ytdR4ZaAv2y3wG3JyyCTtEuGYhh",
  //   "pool_rewards":[]
  // }


  function isNumeric(value: any) {
    return /^[0-9]{0,9}(\.[0-9]{1,2})?$/.test(value);
  }

  const importToken = async (contractAddress: string, onDone?: (tx?: string) => any) => {
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
      const tx = await wallet2.sendTransaction(
        transaction,
        connection
      );
      if (tx) {
        onDone && onDone(tx);
      }
      console.log("importToken", tx);
      return tx;
    } catch (err) {
      console.log("importToken", err);
    }
  }

  // admin
  const inittialPool = async (data: IPoolInit) => {
    console.log("🚀 ~ inittialPool ~ data:", data)
    // return;
    try {
      if (!program) return;
      console.log("🚀 ~ inittialPool ~ program:", program)

      setLoading(true)

      const SCALE_FACTOR_BASE = 1000000000;
      const nonce = Number(data.none);
      const min_duration = new anchor.BN(data.min_duration);
      const max_duration = new anchor.BN(data.max_duration); // 1 year in seconds 31536000
      const max_weight = new anchor.BN(data.max_weight * parseInt(SCALE_FACTOR_BASE.toString()));


      const mintToBeStaked = new anchor.web3.PublicKey(
        data.mintAddress
      );
      const authority = wallet.publicKey;
      const [stakepool_key] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          new anchor.BN(nonce).toArrayLike(Buffer, "le", 1),
          mintToBeStaked.toBuffer(),
          authority.toBuffer(),
          Buffer.from("stakePool", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ inittialPool ~ stakepool_key:", stakepool_key.toString())
      const [stakeMintKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );


      const signature: string = await program.methods
        .initializeStakePool(nonce, max_weight, min_duration, max_duration)
        .accounts({
          payer: wallet.publicKey,
          authority: authority,
          stakePool: stakepool_key,
          stakeMint: stakeMintKey,
          mint: mintToBeStaked,
          vault: vaultKey,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({
          commitment: "finalized",
        });
      console.log("🚀 ~ inittialPool ~ signature:", signature)

      const [stakePool] = await Promise.all([
        program.account.stakePool.fetch(stakepool_key),
      ]);

      console.log("🚀 ~ it ~ stakePool:", stakePool);
      console.log({
        authority: (stakePool as any).authority.toString(),
        mint: (stakePool as any).mint.toString(),
        stakeMint: (stakePool as any).stakeMint.toString(),
        vault: (stakePool as any).vault.toString(),
        creator: (stakePool as any).creator.toString(),
        totalWeightedStake: Number((stakePool as any).totalWeightedStake),
        base_weight: Number((stakePool as any).baseWeight),
        max_weight: Number((stakePool as any).maxWeight),
        min_duration: Number((stakePool as any).minDuration),
        max_duration: Number((stakePool as any).maxDuration),
      });

      apiPoolStaking.saveInfoPoolStaking({
        authority: (stakePool as any).authority.toString(),
        mint: (stakePool as any).mint.toString(),
        stakeMint: (stakePool as any).stakeMint.toString(),
        vault: (stakePool as any).vault.toString(),
        creator: (stakePool as any).creator.toString(),
        totalWeightedStake: Number((stakePool as any).totalWeightedStake).toString(),
        base_weight: Number((stakePool as any).baseWeight).toString(),
        max_weight: Number((stakePool as any).maxWeight).toString(),
        min_duration: Number((stakePool as any).minDuration).toString(),
        max_duration: Number((stakePool as any).maxDuration).toString(),
        pool_key: stakepool_key.toString(),
        pool_rewards: []
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)

      console.log("🚀 ~ inittialPool ~ err:", err)
    }
  }

  const getInfoPool = async (poolKey: string) => {
    if (!program) return;

    const stakepool_key = new anchor.web3.PublicKey(poolKey)
    const [stakePool] = await Promise.all([
      program.account.stakePool.fetch(stakepool_key),
    ]);

    console.log("🚀 ~ it ~ stakePool:", stakePool);
    console.log({
      authority: (stakePool as any).authority.toString(),
      mint: (stakePool as any).mint.toString(),
      stakeMint: (stakePool as any).stakeMint.toString(),
      vault: (stakePool as any).vault.toString(),
      creator: (stakePool as any).creator.toString(),
      totalWeightedStake: Number((stakePool as any).totalWeightedStake),
      base_weight: Number((stakePool as any).baseWeight),
      max_weight: Number((stakePool as any).maxWeight),
      min_duration: Number((stakePool as any).minDuration),
      max_duration: Number((stakePool as any).maxDuration),
    });
  }

  const addRewardPool = async (mintTokenNew: string) => {
    try {
      if (!program) return;
      setLoading(true)
      const rewardPoolIndex = poolStakeSelect.pool_rewards.length;
      const _authority = wallet.publicKey
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const rewardMint2 = new anchor.web3.PublicKey(mintTokenNew);

      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakepool_key.toBuffer(),
          rewardMint2.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ addRewardPool ~ rewardVaultKey:", rewardVaultKey.toString())
      //  new anchor.web3.PublicKey("7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG")
      const signature = await program.methods
        .addRewardPool(rewardPoolIndex)
        .accounts({
          payer: wallet.publicKey,
          authority: _authority,
          rewardMint: rewardMint2,
          stakePool: stakepool_key,
          rewardVault: rewardVaultKey,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({
          commitment: "finalized",
        });
      console.log("🚀 ~ addRewardPool ~ signature:", signature)
      await updatePoolStake(mintTokenNew)
      await getListPoolStake();
      setLoading(false)

    } catch (err) {
      setLoading(false)
      console.log("🚀 ~ addRewardPool ~ err:", err)
    }
  }
  const addReward = async (tokenAddress: string, amount: number) => {
    if (!program) return;
    try {
      setLoading(true)
      const pr0_pub = wallet.publicKey;

      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const rewardMint = new anchor.web3.PublicKey(tokenAddress);
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakepool_key.toBuffer(),
          rewardMint.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      const totalReward = amount * 1_000_000_000;
      const transferIx = createTransferInstruction(
        getAssociatedTokenAddressSync(rewardMint, pr0_pub),
        rewardVaultKey,
        pr0_pub,
        totalReward
      );

      // transfer 1 reward token to RewardPool at index 0
      const signature = await wallet2.sendTransaction(
        new anchor.web3.Transaction()
          .add(transferIx),
        connection,
        { preflightCommitment: "finalized" }
      );
      await connection.confirmTransaction(signature, "finalized");
      console.log("🚀 ~ addReward ~ signature:", signature);
      await updatePoolStake(tokenAddress, amount);
      await getListPoolStake();

      setLoading(false)
    } catch (err) {
      setLoading(false)

      console.log("🚀 ~ addReward ~ err:", err)
    }


  }

  // client 
  const depositStakingSplToken = async () => {
    try {
      if (!program) return;



      console.log("🚀 ~ depositStakingSplToken ~ poolStakeSelect:", poolStakeSelect)

      const mintToBeStaked = new anchor.web3.PublicKey(
        poolStakeSelect.mint
      );
      console.log("🚀 ~ depositStakingSplToken ~ mintToBeStaked:", mintToBeStaked.toString())
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ stakeMint:", stakeMint.toString())

      // await importToken(stakeMint.toString());
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey:", stakeMintAccountKey.address.toString())
      // console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey2:", stakeMintAccountKey2.address.toString())

      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      console.log("🚀 ~ depositStakingSplToken ~ mintToBeStakedAccount:", mintToBeStakedAccount.toString())

      const deposit1Amount = new anchor.BN(7_000_000_000);
      const min_duration = new anchor.BN(1000);


      // deposit

      const nextNonce = await getNextUnusedStakeReceiptNonce(
        program.provider.connection,
        program.programId,
        wallet.publicKey,
        stakepool_key
      );
      // const nextNonce = 0;
      console.log("🚀 ~ depositStakingSplToken ~ nextNonce:", nextNonce)

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakepool_key.toBuffer(),
          new anchor.BN(nextNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeReceiptKey:", stakeReceiptKey.toString())
      // const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakepool_key.toBuffer(),
      //     rewardMint1.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );

      // const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakepool_key.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );
      // console.log("🚀 ~ depositStakingSplToken ~ rewardVaultKey:", rewardVaultKey.toString())
      const arr = poolStakeSelect.pool_rewards.map(reward => {
        const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            stakepool_key.toBuffer(),
            new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
            Buffer.from("rewardVault", "utf-8"),
          ],
          program.programId
        );
        return {
          pubkey: rewardVaultKey,
          isWritable: false,
          isSigner: false,
        }
      })
      console.log("🚀 ~ arr ~ arr:", arr);

      const [globalStateAddress, globalStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakepool_key.toBuffer()

          , Buffer.from("globalState")],
        program.programId
      );

      const rewardsTransferAmount = new anchor.BN(10_000_000_000);
      const fee_token_spl = new anchor.web3.PublicKey("75khJVhdfu9t4teJkRL3RaE1KZaWXsFNS5nfZRsNwGvQ");
      const to = new  anchor.web3.PublicKey("5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6")
      const detination = getAssociatedTokenAddressSync(fee_token_spl,to);
      console.log("🚀 ~ depositStakingSplToken ~ detination:", detination.toString())
      const source = getAssociatedTokenAddressSync(fee_token_spl, wallet.publicKey)
      console.log("🚀 ~ depositStakingSplToken ~ source:", source.toString())
      const transferIx = createTransferInstruction(
        source,
        detination,
        wallet.publicKey,
        rewardsTransferAmount.toNumber()
      );
      await program.methods
        .deposit(nextNonce, deposit1Amount, min_duration)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          from: mintToBeStakedAccount,
          stakeMint,
          stakePool: stakepool_key,
          vault: vaultKey,
          destination: stakeMintAccountKey.address,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          globalState:globalStateAddress
        })
        // .remainingAccounts([
        //   {
        //     pubkey: rewardVaultKey,
        //     isWritable: false,
        //     isSigner: false,
        //   },
        //   {
        //     pubkey: rewardVaultKey2,
        //     isWritable: false,
        //     isSigner: false,
        //   },
        // ])
        .remainingAccounts(arr)
        .preInstructions([transferIx])
        .rpc({ skipPreflight: true });


    } catch (e) {
      console.log("🚀 ~ depositStakingSplToken ~ e:", e);
    }
  };

  const transferSplToken = async () => {
    if (!program) return;

    const amount = new anchor.BN(50);
    const mintToBeStaked = new anchor.web3.PublicKey(
      poolStakeSelect.mint
    );
    const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);

    const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
      program.programId
    );
    console.log("🚀 ~ transferAmountMintToAdmin ~ vaultKey:", vaultKey.toString())


    const frommintToBeStakedAccount = getAssociatedTokenAddressSync(
      mintToBeStaked,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    const tomintToBeStakedAccount = getAssociatedTokenAddressSync(
      mintToBeStaked,
      new anchor.web3.PublicKey("DzguMtFxZkKGhpmrteBLhM6kDBadctp2nyjNY5nRhHfY"),
      false,
      TOKEN_PROGRAM_ID
    );
    const transactionSignature = await program.methods
      .transferTokens(amount)
      .accounts({
        sender: wallet.publicKey,
        recipient: new anchor.web3.PublicKey("DzguMtFxZkKGhpmrteBLhM6kDBadctp2nyjNY5nRhHfY"),
        mintAccount: mintToBeStaked,
        senderTokenAccount: frommintToBeStakedAccount,
        recipientTokenAccount: tomintToBeStakedAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Success!");
    console.log(`   Transaction Signature: ${transactionSignature}`);
  }

  const transferAmountMintToAdmin = async () => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        poolStakeSelect.mint
      );
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      // await importToken("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );
      console.log("🚀 ~ transferAmountMintToAdmin ~ stakeMintAccountKey:", stakeMintAccountKey.address)

      const receiptNonce = 0;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce)
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakepool_key.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      const remainingAccounts = poolStakeSelect.pool_rewards.map(reward => {

        const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            stakepool_key.toBuffer(),
            new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
            Buffer.from("rewardVault", "utf-8"),
          ],
          program.programId
        );

        const depositorReward1AccountKey = getAssociatedTokenAddressSync(
          new anchor.web3.PublicKey(reward.mint_address),
          wallet.publicKey
        );

        return [
          {
            pubkey: rewardVaultKey,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: depositorReward1AccountKey,
            isWritable: true,
            isSigner: false,
          },
        ]
      })
      await program.methods
        .transferToAdmin(new anchor.BN(4500000000))
        .accounts({
          claimBase: {
            owner: wallet.publicKey,
            stakePool: stakepool_key,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          authority: wallet.publicKey,
          vault: vaultKey,
          stakeMint,
          stakePool: stakepool_key,
          from: stakeMintAccountKey.address,
          destination: mintToBeStakedAccount,
        })
        .remainingAccounts(remainingAccounts.flat())
        .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err)
    }
  };

  const withfraw = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        poolStakeSelect.mint
      );
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      // await importToken("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );
      const receiptNonce = receiptNonceNumber;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce)
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakepool_key.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ withfraw ~ stakeReceiptKey  withdraw:", stakeReceiptKey.toString())

      const remainingAccounts = poolStakeSelect.pool_rewards.map(reward => {

        const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            stakepool_key.toBuffer(),
            new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
            Buffer.from("rewardVault", "utf-8"),
          ],
          program.programId
        );

        const depositorReward1AccountKey = getAssociatedTokenAddressSync(
          new anchor.web3.PublicKey(reward.mint_address),
          wallet.publicKey
        );

        return [
          {
            pubkey: rewardVaultKey,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: depositorReward1AccountKey,
            isWritable: true,
            isSigner: false,
          },
        ]
      })
      await program.methods
        .withdraw()
        .accounts({
          claimBase: {
            owner: wallet.publicKey,
            stakePool: stakepool_key,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          vault: vaultKey,
          stakeMint,
          from: stakeMintAccountKey.address,
          destination: mintToBeStakedAccount,
        })
        .remainingAccounts(remainingAccounts.flat())
        .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err)
    }
  }

  const claimReward = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);

      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const receiptNonce = receiptNonceNumber;

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakepool_key.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      // const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakepool_key.toBuffer(),
      //     rewardMint1.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );

      // const depositorReward1AccountKey = getAssociatedTokenAddressSync(
      //   rewardMint1,
      //   wallet.publicKey
      // );

      // const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakepool_key.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );
      // const depositorReward1AccountKey2 = getAssociatedTokenAddressSync(
      //   rewardMint2,
      //   wallet.publicKey
      // );
      const remainingAccounts = poolStakeSelect.pool_rewards.map(reward => {

        const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            stakepool_key.toBuffer(),
            new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
            Buffer.from("rewardVault", "utf-8"),
          ],
          program.programId
        );

        const depositorReward1AccountKey = getAssociatedTokenAddressSync(
          new anchor.web3.PublicKey(reward.mint_address),
          wallet.publicKey
        );

        return [
          {
            pubkey: rewardVaultKey,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: depositorReward1AccountKey,
            isWritable: true,
            isSigner: false,
          },
        ]
      })

      console.log(remainingAccounts.flat());


      await program.methods
        .claimAll()
        .accounts({
          claimBase: {
            owner: wallet.publicKey,
            stakePool: stakepool_key,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID
          },

        })
        .remainingAccounts(
          remainingAccounts.flat()
        )
        // .remainingAccounts([
        //   {
        //     pubkey: rewardVaultKey,
        //     isWritable: true,
        //     isSigner: false,
        //   },
        //   {
        //     pubkey: depositorReward1AccountKey,
        //     isWritable: true,
        //     isSigner: false,
        //   },
        //   {
        //     pubkey: rewardVaultKey2,
        //     isWritable: true,
        //     isSigner: false,
        //   },
        //   {
        //     pubkey: depositorReward1AccountKey2,
        //     isWritable: true,
        //     isSigner: false,
        //   },
        // ])
        .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ claimReward ~ err:", err)
    }
  }

  const infoReceipt = async (receiptNonce: number) => {
    if (!program) return;
    console.log("🚀 ~ infoReceipt ~ poolStakeSelect:", poolStakeSelect)

    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

    const tokenProgram = splTokenProgram({ programId: TOKEN_PROGRAM_ID, provider: provider as any });
    console.log("🚀 ~ infoReceipt ~ tokenProgram:", tokenProgram)

    const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
    const rewardMint1 = new anchor.web3.PublicKey(poolStakeSelect.pool_rewards[0].mint_address);
    const rewardMint2 = new anchor.web3.PublicKey(poolStakeSelect.pool_rewards[1].mint_address);

    const depositerReward1AccKey = getAssociatedTokenAddressSync(
      rewardMint1,
      wallet.publicKey
    );
    const depositerReward2AccKey = getAssociatedTokenAddressSync(
      rewardMint2,
      wallet.publicKey
    );
    const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        stakepool_key.toBuffer(),
        new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
        Buffer.from("stakeDepositReceipt", "utf-8"),
      ],
      program.programId
    );


    const [depositerReward1Account, depositerReward2Account, stakeReceipt, stakePool] =
      await Promise.all([
        tokenProgram.account.account.fetch(depositerReward1AccKey),
        tokenProgram.account.account.fetch(depositerReward2AccKey),
        program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
        program.account.stakePool.fetch(stakepool_key),
      ]);
    // console.log("🚀 ~ infoReceipt ~ stakeReceipt:", stakeReceipt)




    (stakeReceipt as any).claimedAmounts.forEach((item: any) => {
      console.log(Number(item));

    })
    // console.log("🚀 ~ infoReceipt ~ depositerReward1Account:", depositerReward1Account)
    // console.log("🚀 ~ infoReceipt ~ depositerReward1Account:", {
    //   a: Number(depositerReward1Account.delegatedAmount),
    //   b: Number(depositerReward1Account.amount)

    // })

    // console.log("🚀 ~ infoReceipt ~ depositerReward2Account:", depositerReward2Account)


    const infoReceipt: any = {};
    infoReceipt.depositAmount = Number(stakeReceipt.depositAmount) / 10 ** 9;
    infoReceipt.effectiveStake = Number(stakeReceipt.effectiveStake) / 10 ** 18;
    infoReceipt.lockupDuration = Number(stakeReceipt.lockupDuration);
    infoReceipt.depositTimestamp = Number(stakeReceipt.depositTimestamp);
    infoReceipt.dateExpires = new Date((Number(stakeReceipt.lockupDuration) + Number(stakeReceipt.depositTimestamp)) * 1000)
    infoReceipt.rewards = await rewards(Number(stakeReceipt.effectiveStake) / 10 ** 18);
    console.log("🚀 ~ infoReceipt ~ infoReceipt:", infoReceipt)

  }

  const getInfoTokenForWallet = async (mintToken?: string, signer: anchor.web3.PublicKey = wallet.publicKey) => {
    const MINT_TO_SEARCH = mintToken
    try {
      const filters = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: signer as any,  //our search criteria, a base58 encoded string 
          },
        },
      ];
      if (MINT_TO_SEARCH) {
        filters.push({
          memcmp: {
            offset: 0, //number of bytes
            bytes: MINT_TO_SEARCH, //base58 encoded string
          },
        })
      }

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
      );
      let infoTokens: any[] = [
      ]
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        console.log("🚀 ~ accounts.forEach ~ parsedAccountInfo:", parsedAccountInfo)
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        infoTokens.push({
          mintAddress,
          tokenBalance
        })
      });

      const data = await updateInfoTokens(infoTokens)
      console.log("🚀 ~ getInfoTokenForWal ~ data:", data)

      setInfoTokens(data)
    } catch (err) {
      console.log("🚀 ~ getInfoTokenForWal ~ err:", err)
      return {
        mintAddress: "",
        tokenBalance: 0
      }
    }
  }
  async function updateInfoTokens(infoTokens: any[]) {
    try {
      const updatedTokens = await Promise.all(infoTokens.map(async (token) => {
        const metadata: any = await getTokenMetadata(token.mintAddress);
        return {
          ...token,
          ...metadata.json // Assuming metadata has a `.json` property that you want to merge
        };
      }));

      console.log(updatedTokens); // This should now log the resolved values
      return updatedTokens; // Return or otherwise use the updated tokens
    } catch (error) {
      console.error("An error occurred:", error);
      return []
    }
  }
  const rewards = async (amountEffDeposit: number, dateStartStaking = "0") => {
    console.log("🚀 ~ rewards ~ amountEffDeposit:", amountEffDeposit)
    try {
      if (!program) return;

      await getInfoTokenForWallet("", new anchor.web3.PublicKey(poolStakeSelect.pool_key));
      const [stakePool] =
        await Promise.all([
          program.account.stakePool.fetch(new anchor.web3.PublicKey(poolStakeSelect.pool_key)),
        ]);
      console.log("🚀 ~ reward ~ stakePool:", Number(stakePool.totalWeightedStake))
      const totalWeightedStake = Number(stakePool.totalWeightedStake) / 10 ** 18;
      console.log("🚀 ~ rewards ~ totalWeightedStake:", totalWeightedStake)
      const data = poolStakeSelect.pool_rewards.map(reward => {
        let totalToken = 0
        historyAddReward.forEach(history => {
          if (history.mint_address == reward.mint_address && history.date_time > Number(dateStartStaking)) {
            totalToken += history.amount
          }
        })
        return {
          mint_address: reward.mint_address,
          total: totalToken
        }
      })
      const rewards = infoTokens.map(token => {
        if (token.mintAddress != poolStakeSelect.mint) {
          const rate = (amountEffDeposit / (totalWeightedStake));
          console.log("🚀 ~ data ~ data:", data)

          const total = ((data.find((item: any) => item.mint_address == token.mintAddress) as any).total)
          console.log("🚀 ~ rewards ~ total:", total)
          return {
            addressTokenReward: token.mintAddress,
            receiveReward: Number(total) * (rate)
          }
        }
      })
      console.log("🚀 ~ reward ~ infoTokens:", rewards)
      return rewards;
    } catch (err) {
      console.log("🚀 ~ reward ~ err:", err)
    }
  }

  const calculateStakeWeight = (
    min_duration: anchor.BN,
    max_duration: anchor.BN,
    base_weight: anchor.BN,
    max_weight: anchor.BN,
    duration: anchor.BN
  ) => {
    const SCALE_FACTOR_BASE = new anchor.BN(1_000_000_000);

    const durationSpan = max_duration.sub(min_duration);
    if (durationSpan.eq(new anchor.BN(0))) {
      return base_weight;
    }
    const durationExceedingMin = duration.sub(min_duration);
    const normalizedWeight = durationExceedingMin
      .mul(SCALE_FACTOR_BASE)
      .div(durationSpan);
    const weightDiff = max_weight.sub(base_weight);

    const result = anchor.BN.max(
      base_weight.add(normalizedWeight.mul(weightDiff).div(SCALE_FACTOR_BASE)),
      base_weight
    );
    console.log("🚀 ~ result %:", Number(result))

    return result
  };

  const getTokenMetadata = async (addressToken: string) => {

    const MINT_TO_SEARCH = addressToken
    try {

      const metaplex = Metaplex.make(connection);

      const tokenAddress = new anchor.web3.PublicKey(MINT_TO_SEARCH);

      let nft = await metaplex.nfts().findByMint({ mintAddress: tokenAddress });

      return nft
    } catch (err) {
      console.log("🚀 ~ getInfoTokenForWal ~ err:", err)
    }
  }

  // api
  const updatePoolStake = async (mint_address: string, amount = 0) => {
    try {
      const result = await apiPoolStaking.updateInfoPoolStaking({ authority: wallet.publicKey.toString(), poolKey: poolStakeSelect.pool_key, pool_rewards: [...poolStakeSelect.pool_rewards, { mint_address: mint_address, amount }] });
      return result
    } catch (err) {
      console.log("🚀 ~ updatePoolStake ~ err:", err)
    }
  }
  const getListPoolStake = async () => {
    try {
      const result = await apiPoolStaking.getAllPoolStakingByAuthority();
      console.log("🚀 ~ getListPoolStake ~ data:", result.data.data)
      setListPoolStake(result.data.data);
      // setPoolStakeSelect(result.data.data[0]);
    } catch (err) {
      console.log("🚀 ~ getListPoolStake ~ err:", err)
    }
  }

  useEffect(() => {
    getListPoolStake();
  }, [])
  useEffect(() => {
    if (poolStakeSelect && poolStakeSelect.pool_key) {

      getInfoTokenForWallet("", new anchor.web3.PublicKey(poolStakeSelect.pool_key));
    }
  }, [poolStakeSelect])

  // locked

  const getStatusLocked = async () => {
    if (!program) return;
    console.log("🚀 ~ getStatusLocked ~ program:", program)

    const [globalStateAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(anchor.utils.bytes.utf8.encode(GlobalState.SEED))],
      program.programId
    );
    console.log("🚀 ~ getStatusLocked ~ globalStateAddress:", globalStateAddress);
    const globalState = await program.account.globalState.fetch(globalStateAddress);

    console.log("Global State Data:", globalState.data);
  }

  const initGlobalState = async () => {
    if (!program) return;
    console.log("🚀 ~ getStatusLocked ~ program:", program)
    const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
    console.log("🚀 ~ initGlobalState ~ stakepool_key:", stakepool_key)

    const [globalStateAddress, globalStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakepool_key.toBuffer()

        , Buffer.from("globalState")],
      program.programId
    );

    await program.methods
      .initGlobalState()
      .accounts({
        globalState: globalStateAddress,
        payer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        stakePool:stakepool_key
      })
      .rpc({ skipPreflight: true });

  }

  const lockPool = async () => {
    if (!program) return;
    console.log("🚀 ~ getStatusLocked ~ program:", program)
    const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
    console.log("🚀 ~ lockPool ~ stakepool_key:", stakepool_key)

    const [globalStateAddress, globalStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakepool_key.toBuffer()

        , Buffer.from("globalState")],
      program.programId
    );

    await program.methods
      .updateGlobalState(false)
      .accounts({
        globalState: globalStateAddress,
        authority: wallet.publicKey,
        stakePool:stakepool_key
      })
      .rpc({ skipPreflight: true });

  }

  const fetchAllReceipt = async ()=>{
    if (!program) return;
    console.log("🚀 ~ fetchAllReceipt ~ program:", program)

    const allReceipts = await program.account.stakeDepositReceipt.all();
    console.log("🚀 ~ fetchAllReceipt ~ allReceipts:", allReceipts)
    allReceipts.forEach(item=>{
      console.log({
        publicKey: item.publicKey.toString()
      });
      
    })
  }

  return (
    <div style={{ minWidth: 240 }} className="mb-8   flex  flex-col gap-5">
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
          <div className="flex flex-col gap-2">
            <span>Min Duration</span>
            <input name="min_duration" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "min_duration"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Min Duration" className="mb-4"></input>
          </div>

          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <span>Min Weight</span>
            <input name="minWeight" value={0} readOnly onChange={(e) => {
              const value = e.target.value;
              const nameKey = "minWeight"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Min Weight" className="mb-4"></input>
          </div>
          <div className="flex flex-col gap-2">
            <span>Max Weight</span>
            <input name="max_weight" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "max_weight"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Max Weight" className="mb-4"></input>
          </div>

        </div>

        {loading ?
          <Loader></Loader>
          : <button
            className="btn btn-primary rounded-full normal-case	w-full"
            onClick={() => inittialPool(poolInfo)}
            style={{ minHeight: 0, height: 40 }}
          >
            Create pool stake
          </button>
        }





      </div>

      <div className="w-full border-b border-gray-500 pb-4">
        <h1 className="mb-5 text-3xl text-center">
          Add Pool Reward
        </h1>
        <div className="flex gap-3">

          <input name="tokenReward" onChange={(e) => {
            setTokenReward(e.target.value)
          }
          } placeholder="Address Token Reward" className="mb-4 "></input>

        </div>

        {loading ?
          <Loader></Loader> :
          <button
            className="btn btn-primary rounded-full normal-case	w-full"
            onClick={() => addRewardPool(tokenReward)}
            style={{ minHeight: 0, height: 40 }}
          >
            Add Pool Reward
          </button>}
      </div>


      <div className="w-full  border-b border-gray-500 pb-4">
        <h1 className="mb-5 text-3xl text-center">
          Add Token To Pool Reward
        </h1>
        {poolStakeSelect?.pool_rewards.length > 0 && poolStakeSelect?.pool_rewards?.map((reward: { mint_address: string; }, index: Key | null | undefined) => {
          return <div key={index} className="flex gap-3">
            <div className="flex gap-2">
              <img src={infoTokens.find(token => token.mintAddress === reward.mint_address)?.image}
                className="w-[40px] h-[40px] rounded-full"
                alt="" />
              <div className="flex flex-col gap-1">


                <span className="font-bold">{infoTokens.find(token => token.mintAddress === reward.mint_address)?.name}</span>
                <span className="font-bold">{infoTokens.find(token => token.mintAddress === reward.mint_address)?.tokenBalance.toFixed(2)}</span>
              </div>
            </div>
            <input name="amount" type="number" onChange={(e) => {
              setAmountReward(Number(e.target.value))
            }
            } placeholder="Amount Reward" className="mb-4 flex-1"></input>
            {loading ?
              <Loader></Loader> :
              <button
                className="btn btn-primary rounded-full normal-case"
                onClick={() => addReward(reward.mint_address, amountReward)}
                style={{ minHeight: 0, height: 40 }}
              >
                Add
              </button>}
          </div>
        })}



      </div>


      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={depositStakingSplToken}
        style={{ minHeight: 0, height: 40 }}
      >
        Deposit
      </button>
      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => withfraw(0)}
        style={{ minHeight: 0, height: 40 }}
      >
        Withdraw and claim reward
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => claimReward(0)}
        style={{ minHeight: 0, height: 40 }}
      >
        Claim Reward
      </button>
      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => infoReceipt(7)}
        style={{ minHeight: 0, height: 40 }}
      >
        Get Info Reward
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() =>
          calculateStakeWeight(new anchor.BN(poolStakeSelect.min_duration), new anchor.BN(poolStakeSelect.max_duration), new anchor.BN(poolStakeSelect.base_weight), new anchor.BN(poolStakeSelect.max_weight), new anchor.BN(31536000))

        }
        style={{ minHeight: 0, height: 40 }}
      >
        % weight
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => getInfoPool("5hkcBdcYoRNs6ZgwHj3S6YJmFKqWQwmh2Ukneuk56nhN")

        }
        style={{ minHeight: 0, height: 40 }}
      >
        pool info
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => transferAmountMintToAdmin()

        }
        style={{ minHeight: 0, height: 40 }}
      >
        transferAmountMintToAdmin
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => getStatusLocked()

        }
        style={{ minHeight: 0, height: 40 }}
      >
        getStatusLocked
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => initGlobalState()

        }
        style={{ minHeight: 0, height: 40 }}
      >
        initGlobalState
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => lockPool()

        }
        style={{ minHeight: 0, height: 40 }}
      >
        lockPool
      </button>
      
      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => fetchAllReceipt()

        }
        style={{ minHeight: 0, height: 40 }}
      >
        fetchAllReceipt
      </button>
    </div>
  );
};
