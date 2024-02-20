import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";
import * as Metadata from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex } from '@metaplex-foundation/js';
import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { swap } from "./swap";
import { useProgram } from "./useProgram";
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMintToInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { SPL_TOKEN_PROGRAM_ID, splTokenProgram } from "@coral-xyz/spl-token";
import { getNextUnusedStakeReceiptNonce } from "@mithraic-labs/token-staking";
import { SplTokenStaking } from "./spl_token_staking";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

const listPoolStake = [

  {
    "authority": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
    "mint": "AsNGZoLtMHxFJux4tzkFjqJa2yq9iYmYhPkGNTK1FmTN",
    "stakeMint": "9UbcfdHahVGPQgYRBBjRx1CKttafXNvT6BxtrmseCS48",
    "vault": "F1ujYqD3WZUC1mXVXhKuJvs8tp7HKR4iQfhuUUzC2KQm",
    "creator": "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
    "totalWeightedStake": 0,
    "baseWeight": 1000000000,
    "maxWeight": 4000000000,
    "minDuration": 1000,
    "maxDuration": 63072000,
    "poolKey": "2CsCkuDJqr3oZ2HiCKf7EPcC1YYUg321krFR9L1ugjtR",
    poolRewards:[{
      addressMint:"9Hq2LbrRkZxa5pzuTVK5M4XmMFebb5ugJBaxhXDtCGf6"
    }]
},
{
  "authority": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
  "mint": "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn",
  "stakeMint": "HkX3vYzxZDZ94JYbY3AVsKpzpqjUiEFFSDJgp76akLUi",
  "vault": "9sp1gKnudui5jJ9BSnk8c7jo2hz22yY1KjYUbqj3u2UF",
  "creator": "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
  "totalWeightedStake": "00",
  "baseWeight": "3b9aca00",
  "maxWeight": "ee6b2800",
  "minDuration": "00",
  "maxDuration": "01e13380",
  "poolKey": "D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp",
  "poolRewards": [{
    addressMint: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm"
  }, { addressMint: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd" }]
},

]

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
  minDuration: number,
  maxDuration: number,
  maxWeight: number
}

interface IInfoToken {
  mintAddress: string,
  tokenBalance: number
}

const NetSwap: FC<NetSwap> = ({ }) => {
  const wallet: any = useAnchorWallet();
  const wallet2 = useWallet()
  const { program } = useProgram({ connection, wallet });
  const [amountReward, setAmountReward] = useState<number>(0);
  const [poolInfo, setPoolInfo] = useState<IPoolInit>({
    mintAddress: "",
    none: 0,
    minDuration: 0,
    maxDuration: 31536000 * 4,
    maxWeight: 4
  })
  const [tokenReward, setTokenReward] = useState<string>("")
  const [infoTokens, setInfoTokens] = useState<any[]>([])
  const setValueToPoolInfo = (inputName: string, value: any) => {
    setPoolInfo(poolInfo => {
      return {
        ...poolInfo,
        [inputName]: value
      }
    })
  }

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

  //
  const inittialPool = async (data: IPoolInit) => {
    console.log("🚀 ~ inittialPool ~ data:", data)
    // return;
    try {
      if (!program) return;

      const SCALE_FACTOR_BASE = 1000000000;
      const nonce = Number(data.none);
      const minDuration = new anchor.BN(data.minDuration);
      const maxDuration = new anchor.BN(data.maxDuration); // 1 year in seconds 31536000
      const maxWeight = new anchor.BN(data.maxWeight * parseInt(SCALE_FACTOR_BASE.toString()));


      const mintToBeStaked = new anchor.web3.PublicKey(
        data.mintAddress
      );
      const authority = wallet.publicKey;
      const [stakePoolKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          new anchor.BN(nonce).toArrayLike(Buffer, "le", 1),
          mintToBeStaked.toBuffer(),
          authority.toBuffer(),
          Buffer.from("stakePool", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ inittialPool ~ stakePoolKey:", stakePoolKey.toString())
      const [stakeMintKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );


      await program.methods
        .initializeStakePool(nonce, maxWeight, minDuration, maxDuration)
        .accounts({
          payer: wallet.publicKey,
          authority: authority,
          stakePool: stakePoolKey,
          stakeMint: stakeMintKey,
          mint: mintToBeStaked,
          vault: vaultKey,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();


      setTimeout(async () => {
        const [stakePool] = await Promise.all([
          program.account.stakePool.fetch(stakePoolKey),
        ]);

        console.log("🚀 ~ it ~ stakePool:", stakePool);
        console.log({
          authority: (stakePool as any).authority.toString(),
          mint: (stakePool as any).mint.toString(),
          stakeMint: (stakePool as any).stakeMint.toString(),
          vault: (stakePool as any).vault.toString(),
          creator: (stakePool as any).creator.toString(),
          totalWeightedStake: Number((stakePool as any).totalWeightedStake),
          baseWeight: Number((stakePool as any).baseWeight),
          maxWeight: Number((stakePool as any).maxWeight),
          minDuration: Number((stakePool as any).minDuration),
          maxDuration: Number((stakePool as any).maxDuration),
        });
      }, 20000)
    } catch (err) {
      console.log("🚀 ~ inittialPool ~ err:", err)
    }
  }

  const addRewardPool = async (mintTokenNew: string) => {
    try {
      if (!program) return;
      const rewardPoolIndex = listPoolStake[0].poolRewards.length;
      const _authority = wallet.publicKey
      const stakePoolKey = new anchor.web3.PublicKey(listPoolStake[0].poolKey);
      const rewardMint2 = new anchor.web3.PublicKey(mintTokenNew);

      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint2.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ addRewardPool ~ rewardVaultKey:", rewardVaultKey.toString())
      return program.methods
        .addRewardPool(rewardPoolIndex)
        .accounts({
          payer: wallet.publicKey,
          authority: _authority,
          rewardMint: rewardMint2,
          stakePool: stakePoolKey,
          rewardVault: rewardVaultKey,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      console.log("🚀 ~ addRewardPool ~ err:", err)
    }
  }

  const depositStakingSplToken = async () => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        listPoolStake[0].mint
      );
      const stakePoolKey = new anchor.web3.PublicKey(listPoolStake[0].poolKey);
      const rewardMint1 = new anchor.web3.PublicKey(listPoolStake[0].poolRewards[0].addressMint);
      // const rewardMint2 = new anchor.web3.PublicKey(listPoolStake[0].poolRewards[1].addressMint);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ stakeMint:", stakeMint.toString())

      // const stakeMintAccountKey = getAssociatedTokenAddressSync(
      //   stakeMint,
      //   wallet.publicKey,
      //   false,
      //   TOKEN_PROGRAM_ID
      // );
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

      const deposit1Amount = new anchor.BN(3_000_000_000);
      const minDuration = new anchor.BN(1000);


      // deposit

      const nextNonce = await getNextUnusedStakeReceiptNonce(
        program.provider.connection,
        program.programId,
        wallet.publicKey,
        stakePoolKey
      );
      // const nextNonce = 0;
      console.log("🚀 ~ depositStakingSplToken ~ nextNonce:", nextNonce)

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(nextNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeReceiptKey:", stakeReceiptKey.toString())
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );

      // const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakePoolKey.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );
      console.log("🚀 ~ depositStakingSplToken ~ rewardVaultKey:", rewardVaultKey.toString())

      await program.methods
        .deposit(nextNonce, deposit1Amount, minDuration)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          from: mintToBeStakedAccount,
          stakeMint,
          stakePool: stakePoolKey,
          vault: vaultKey,
          destination: stakeMintAccountKey.address,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .remainingAccounts([
          {
            pubkey: rewardVaultKey,
            isWritable: false,
            isSigner: false,
          },
          // {
          //   pubkey: rewardVaultKey2,
          //   isWritable: false,
          //   isSigner: false,
          // },
        ])
        .rpc({ skipPreflight: true });


    } catch (e) {
      console.log("🚀 ~ depositStakingSplToken ~ e:", e);
    }
  };

  const addReward = async (tokenAddress: string, amount: number) => {
    if (!program) return;

    const pr0_pub = wallet.publicKey;

    const stakePoolKey = new anchor.web3.PublicKey(listPoolStake[0].poolKey);
    const rewardMint = new anchor.web3.PublicKey(tokenAddress);

    const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakePoolKey.toBuffer(),
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
    await wallet2.sendTransaction(
      new anchor.web3.Transaction()
        .add(transferIx),
      connection
    );
  }


  const withfraw = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;

      const TEST_MINT_DECIMALS = 9;

      const mintToBeStaked = new anchor.web3.PublicKey(
        listPoolStake[0].mint
      );
      const stakePoolKey = new anchor.web3.PublicKey(listPoolStake[0].poolKey);
      const rewardMint1 = new anchor.web3.PublicKey(listPoolStake[0].poolRewards[0].addressMint);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
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
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );


      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );

      // const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakePoolKey.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );


      // const depositorReward1AccountKey2 = getAssociatedTokenAddressSync(
      //   rewardMint2,
      //   wallet.publicKey
      // );
      await program.methods
        .withdraw()
        .accounts({
          claimBase: {
            owner: wallet.publicKey,
            stakePool: stakePoolKey,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          vault: vaultKey,
          stakeMint,
          from: stakeMintAccountKey.address,
          destination: mintToBeStakedAccount,
        })
        .remainingAccounts([
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
          // {
          //   pubkey: rewardVaultKey2,
          //   isWritable: true,
          //   isSigner: false,
          // },
          // {
          //   pubkey: depositorReward1AccountKey2,
          //   isWritable: true,
          //   isSigner: false,
          // },
        ])
        .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err)
    }
  }

  const claimReward = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        listPoolStake[0].mint
      );
      const stakePoolKey = new anchor.web3.PublicKey(listPoolStake[0].poolKey);
      const rewardMint1 = new anchor.web3.PublicKey(listPoolStake[0].poolRewards[0].addressMint);

      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const receiptNonce = receiptNonceNumber;

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
  
      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );

      // const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakePoolKey.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );
      // const depositorReward1AccountKey2 = getAssociatedTokenAddressSync(
      //   rewardMint2,
      //   wallet.publicKey
      // );
      console.log("🚀 ~ claimReward ~ depositorReward1AccountKey:", depositorReward1AccountKey)

      await program.methods
        .claimAll()
        .accounts({
          claimBase: {
            owner: wallet.publicKey,
            stakePool: stakePoolKey,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID
          },

        })
        .remainingAccounts([
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
          // {
          //   pubkey: rewardVaultKey2,
          //   isWritable: true,
          //   isSigner: false,
          // },
          // {
          //   pubkey: depositorReward1AccountKey2,
          //   isWritable: true,
          //   isSigner: false,
          // },
        ])
        .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ claimReward ~ err:", err)
    }
  }

  const infoReceipt = async (receiptNonce: number) => {
    if (!program) return;
    console.log("🚀 ~ infoReceipt ~ program:", program)

    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

    const tokenProgram = splTokenProgram({ programId: TOKEN_PROGRAM_ID, provider: provider as any });
    console.log("🚀 ~ infoReceipt ~ tokenProgram:", tokenProgram)

    const stakePoolKey = new anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp");
    const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm")

    const depositerReward1AccKey = getAssociatedTokenAddressSync(
      rewardMint1,
      wallet.publicKey
    );
    const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        stakePoolKey.toBuffer(),
        new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
        Buffer.from("stakeDepositReceipt", "utf-8"),
      ],
      program.programId
    );


    const [depositerReward1Account, stakeReceipt, stakePool] =
      await Promise.all([
        tokenProgram.account.account.fetch(depositerReward1AccKey),
        program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
        program.account.stakePool.fetch(stakePoolKey),
      ]);

    console.log("🚀 ~ infoReceipt ~ depositerReward1Account:", depositerReward1Account)
    console.log("🚀 ~ infoReceipt ~ stakeReceipt:", Number(stakeReceipt.depositAmount)) // amount stake
    console.log("🚀 ~ infoReceipt ~ effectiveStake:", Number(stakeReceipt.effectiveStake)) // amount after time stake

    console.log("🚀 ~ infoReceipt ~ stakeReceipt time lock:", Number(stakeReceipt.lockupDuration))//time lock
    console.log("🚀 ~ infoReceipt ~ stakeReceipt: time start lock", Number(stakeReceipt.depositTimestamp))//time start lock
    console.log("date Withdrawed", new Date((Number(stakeReceipt.lockupDuration) + Number(stakeReceipt.depositTimestamp)) * 1000)); //date claimed


    console.log("🚀 ~ infoReceipt ~ stakeReceipt:", (stakeReceipt))

    console.log("🚀 ~ infoReceipt ~ stakePool:", stakePool);
    console.log("claim amount");
    console.log(Number((stakePool as any).rewardPools[receiptNonce].rewardsPerEffectiveStake));

    (stakePool as any)?.rewardPools.forEach((item: any) => {
      console.log("----------------");

      console.log(Number(item.rewardsPerEffectiveStake));

    })

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
      const infoTokens: IInfoToken[] = [
      ]
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        console.log("🚀 ~ accounts.forEach ~ parsedAccountInfo:", parsedAccountInfo)
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
        infoTokens.push({
          mintAddress,
          tokenBalance
        })
      });

      setInfoTokens(infoTokens)
    } catch (err) {
      console.log("🚀 ~ getInfoTokenForWal ~ err:", err)
      return {
        mintAddress: "",
        tokenBalance: 0
      }
    }
  }

  const reward = async (amountEffDeposit:number) => {
    try{
    if (!program) return;

      await getInfoTokenForWallet("", new anchor.web3.PublicKey(listPoolStake[0].poolKey));
      const [stakePool] =
      await Promise.all([
        program.account.stakePool.fetch(new anchor.web3.PublicKey(listPoolStake[0].poolKey)),
      ]);
      console.log("🚀 ~ reward ~ stakePool:", Number(stakePool.totalWeightedStake))
      const totalWeightedStake = Number(stakePool.totalWeightedStake) / 10 ** 18;

      const rewards  = infoTokens.map(token=>{
        if(token.mintAddress != listPoolStake[0].mint){
          const rate = (amountEffDeposit / totalWeightedStake);
          return {
            addressTokenReward: token.mintAddress,
            receiveReward: Number(token.tokenBalance) * (rate)
          }
        }
      })
      console.log("🚀 ~ reward ~ infoTokens:", rewards)
    }catch (err) {
      console.log("🚀 ~ reward ~ err:", err)
    }
  }


  const calculateStakeWeight = (
    minDuration: anchor.BN,
    maxDuration: anchor.BN,
    baseWeight: anchor.BN,
    maxWeight: anchor.BN,
    duration: anchor.BN
  ) => {
    const SCALE_FACTOR_BASE = new anchor.BN(1_000_000_000);

    const durationSpan = maxDuration.sub(minDuration);
    if (durationSpan.eq(new anchor.BN(0))) {
      return baseWeight;
    }
    const durationExceedingMin = duration.sub(minDuration);
    const normalizedWeight = durationExceedingMin
      .mul(SCALE_FACTOR_BASE)
      .div(durationSpan);
    const weightDiff = maxWeight.sub(baseWeight);
  
    const result = anchor.BN.max(
      baseWeight.add(normalizedWeight.mul(weightDiff).div(SCALE_FACTOR_BASE)),
      baseWeight
    );
    console.log("🚀 ~ result %:", Number(result))

    return result
  };

  useEffect(() => {
    getInfoTokenForWallet("", new anchor.web3.PublicKey(listPoolStake[0].poolKey));
  }, [])
  return (
    <div style={{ minWidth: 240 }} className="mb-8   flex  flex-col gap-5">

      <div className="w-full border-b border-gray-500 pb-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 w-[70%]">
            <span>Max Duration</span>
            <input name="mintAddress" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "mintAddress"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Enter address token stake" className="mb-4 "></input>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <span>Max Duration</span>
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
            <input name="minDuration" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "minDuration"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Min Duration" className="mb-4"></input>
          </div>

          <div className="flex flex-col gap-2">
            <span>Max Duration</span>
            <input name="maxDuration" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "maxDuration"
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
            <input name="maxWeight" onChange={(e) => {
              const value = e.target.value;
              const nameKey = "maxWeight"
              setValueToPoolInfo(nameKey, value)
            }
            } placeholder="Max Weight" className="mb-4"></input>
          </div>

        </div>




        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => inittialPool(poolInfo)}
          style={{ minHeight: 0, height: 40 }}
        >
          Create pool stake
        </button>


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

        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => addRewardPool(tokenReward)}
          style={{ minHeight: 0, height: 40 }}
        >
          Add Pool Reward
        </button>
      </div>


      <div className="w-full  border-b border-gray-500 pb-4">
        <h1 className="mb-5 text-3xl text-center">
          Add Token To Pool Reward
        </h1>
        {listPoolStake[0].poolRewards.map((reward, index) => {
          return <div key={index} className="flex gap-3">
            <div className="flex gap-2">
              <img className="w-[40px] h-[40px] rounded-full" src="data:image/jpeg;base64,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" alt="" />
              <div className="flex flex-col gap-1">
                <span className="font-bold">USDC</span>
                <span className="font-bold">{infoTokens.find(token => token.mintAddress === reward.addressMint)?.tokenBalance.toFixed(2)}</span>
              </div>
            </div>
            <input name="amount" type="number" onChange={(e) => {
              setAmountReward(Number(e.target.value))
            }
            } placeholder="Amount Reward" className="mb-4 flex-1"></input>
            <button
              className="btn btn-primary rounded-full normal-case"
              onClick={() => addReward(reward.addressMint, amountReward)}
              style={{ minHeight: 0, height: 40 }}
            >
              Add
            </button>
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
        onClick={() => infoReceipt(0)}
        style={{ minHeight: 0, height: 40 }}
      >
        Get Info Reward
      </button>


      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => reward(1)}
        style={{ minHeight: 0, height: 40 }}
      >
         Rewards
      </button>

      <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() => 
    calculateStakeWeight(new anchor.BN(listPoolStake[0].minDuration),new anchor.BN(listPoolStake[0].maxDuration),new anchor.BN(listPoolStake[0].baseWeight),new anchor.BN(listPoolStake[0].maxWeight), new anchor.BN(31536000 * 2))
        
        }
        style={{ minHeight: 0, height: 40 }}
      >
         % weight
      </button>

    </div>
  );
};
