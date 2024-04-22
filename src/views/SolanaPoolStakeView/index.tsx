import { FC, Key, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";
import { Metaplex, PublicKey } from "@metaplex-foundation/js";
import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { useProgram } from "./useProgram";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { SPL_TOKEN_PROGRAM_ID, splTokenProgram } from "@coral-xyz/spl-token";
import { getNextUnusedStakeReceiptNonce } from "@mithraic-labs/token-staking";
import { apiPoolStaking } from "api/pool-staking";
import { IInfoPoolStake } from "api/pool-staking/Interface";
import { useRouter } from "next/router";
import { Client, Token, UtlConfig } from "@solflare-wallet/utl-sdk";
import Navbar from "components/Navbar";
import Swal from "sweetalert2";
const endpoint = process.env.NEXT_PUBLIC_RPC;

const connection = new anchor.web3.Connection(endpoint as string);
const rewards = [
  {
    mint_address: "Avop6BWTdg2zfrdr7Pwk1tWbhpMJvcP3Zu1DtqUqeBEG",
  },
  {
    mint_address: "HxJyGSBmcscHLWysxMdVNZwY9yjYJBETy3T4EGw69mKP",
  },
];
export const SolanaPoolStakeView: FC = ({}) => {
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
            <SelectAndConnectWalletButton onUseWalletClick={() => {}} />
          ) : (
            <StakingScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const StakingScreen = () => {
  return (
    <div className="rounded-lg flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs">
          <NetStaking />
        </div>
      </div>
    </div>
  );
};

type NetStaking = {
  // onSwapSent: (t: any) => void;
};

interface IPoolInit {
  mintAddress: string;
  none: number;
  min_duration: number;
  max_duration: number;
  max_weight: number;
  block_time: number;
  token_on_block_time: number;
  block_time_withdraw_origin: number;
  range_time_withdraw_profits: number;
  percent_commission_for_admin: number;
  wallet_admin_receive_commission: string;
}

interface IInfoToken {
  mintAddress: string;
  tokenBalance: number;
}

export const GlobalState = {
  SEED: "global_state",
};

const NetStaking: FC<NetStaking> = ({}) => {
  const wallet: any = useAnchorWallet();
  const wallet2 = useWallet();
  const { program } = useProgram({ connection, wallet });
  console.log("🚀 ~ program:", program);
  const [amountReward, setAmountReward] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [poolInfo, setPoolInfo] = useState<IPoolInit>({
    mintAddress: "",
    none: 0,
    min_duration: 0,
    max_duration: 31536000 * 4,
    max_weight: 4,
    block_time: 1,
    token_on_block_time: 10,
    block_time_withdraw_origin: 0,
    range_time_withdraw_profits: 0,
    percent_commission_for_admin: 1,
    wallet_admin_receive_commission: "",
  });
  const [tokenReward, setTokenReward] = useState<string>("");
  const [infoTokens, setInfoTokens] = useState<any[]>([]);
  const [historyAddReward, setHistoryAddreward] = useState<any[]>([
    {
      mint_address: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm",
      date_time: 1708503662366,
      amount: 5,
    },
    {
      mint_address: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd",
      date_time: 1708503662366,
      amount: 10,
    },
  ]);
  const setValueToPoolInfo = (inputName: string, value: any) => {
    setPoolInfo((poolInfo) => {
      return {
        ...poolInfo,
        [inputName]: value,
      };
    });
  };

  const [listPoolStake, setListPoolStake] = useState<any[]>([
    {
      authority: "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
      mint: "HswdwZUEAavy8G48qSQEFDpQBqDrpzEUxEm2JMDjANKB",
      stakeMint: "9RyrszWsFZww6N8tyrBy8QixLN6S72KgzYU62M4hwshR",
      vault: "8ArWpdPbgBtWmt8dmq4UWS1AfNToGMzrJMww3yp5SKSi",
      creator: "7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG",
      totalWeightedStake: "0",
      base_weight: "1000000000",
      max_weight: "5000000000",
      min_duration: "1000",
      max_duration: "31536000",
      pool_key: "7bJNmcFagSsaybag8AAeM63EY8b8vXvssZuL8ASvP3Gk",
      pool_rewards: [],
    },
    {
      authority: "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
      mint: "AsNGZoLtMHxFJux4tzkFjqJa2yq9iYmYhPkGNTK1FmTN",
      stakeMint: "9UbcfdHahVGPQgYRBBjRx1CKttafXNvT6BxtrmseCS48",
      vault: "F1ujYqD3WZUC1mXVXhKuJvs8tp7HKR4iQfhuUUzC2KQm",
      creator: "5QPgJLMcF6v1dBCouNTsoJrCjoQ8DCPH2PPZCZNNYKP6",
      totalWeightedStake: 0,
      base_weight: 1000000000,
      max_weight: 4000000000,
      min_duration: 1000,
      max_duration: 63072000,
      pool_key: "2CsCkuDJqr3oZ2HiCKf7EPcC1YYUg321krFR9L1ugjtR",
      pool_rewards: [
        {
          mint_address: "9Hq2LbrRkZxa5pzuTVK5M4XmMFebb5ugJBaxhXDtCGf6",
        },
      ],
    },
    {
      authority: "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
      mint: "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn",
      stakeMint: "HkX3vYzxZDZ94JYbY3AVsKpzpqjUiEFFSDJgp76akLUi",
      vault: "9sp1gKnudui5jJ9BSnk8c7jo2hz22yY1KjYUbqj3u2UF",
      creator: "3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT",
      totalWeightedStake: "00",
      base_weight: "3b9aca00",
      max_weight: "ee6b2800",
      min_duration: "00",
      max_duration: "01e13380",
      pool_key: "D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp",
      pool_rewards: [
        {
          mint_address: "7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm",
        },
        { mint_address: "Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd" },
      ],
    },
  ]);
  const [poolStakeSelect, setPoolStakeSelect] = useState<IInfoPoolStake>({
    authority: "7SAEjxiMG8u7Wsh4yCVN3hRCBc7zEXSvDxeH8QwMBFf7",
    mint: "GzZ6QSc889rw4j2kTcAbF1ps2nVngepn45AaSwrQxBEp",
    stakeMint: "yQM8tmnrX23QmE9mcVNVXkp7pCuQ6H3tVTgwKx7u8fq",
    vault: "5M7er8TCyRHZacsxuk6vMc5yG3edxUFuciUwLSfaPNrM",
    creator: "7SAEjxiMG8u7Wsh4yCVN3hRCBc7zEXSvDxeH8QwMBFf7",
    pool_key: "FUS5B3Ek9BhFjZx4ARnRWeUFrNSaP1EYfGKYV7dti8Wr",
    block_time_withdraw_origin: "300",
    range_withdraw_profit: "300",
    percent_commission: 0.1,
    wallet_receive_commission: "2uNc7Agb7VWE6b374KhRNsKBYBJ1DX5k5osoL5EJw7iA",
    global_state: "1",
    total_weighted_stake: "0",
    block_time: "600",
    percent_token_on_block_time: "0.01",
  });
  //popup
  const showPopup = (
    title: string,
    html: string,
    icon: "error" | "info",
    width = 600,
    textButton = "Great"
  ) => {
    Swal.fire({
      width: width,
      title: `<strong>${title}</strong>`,
      icon: icon,
      html: `
        ${html}
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> ${textButton}!
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
    });
  };
  // end popup

  // admin
  const inittialPool = async (data: IPoolInit) => {
    console.log("🚀 ~ inittialPool ~ data:", data);
    // return;

    try {
      if (!program) return;

      setLoading(true);

      const nonce = Number(data.none);
      const blockTime = new anchor.BN(data.block_time);
      const tokenOnBlockTime = new anchor.BN(data.token_on_block_time);
      const block_time_withdraw_origin = new anchor.BN(
        data.block_time_withdraw_origin
      );
      const range_time_withdraw_profits = new anchor.BN(
        data.range_time_withdraw_profits
      );

      const percent_commission_for_admin = new anchor.BN(
        data.percent_commission_for_admin
      );

      const mintToBeStaked = new anchor.web3.PublicKey(data.mintAddress);
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
      console.log(
        "🚀 ~ inittialPool ~ stakepool_key:",
        stakepool_key.toString()
      );
      const [stakeMintKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );

      const stakeMintAccountKey = await getAssociatedTokenAddress(
        mintToBeStaked,
        new anchor.web3.PublicKey(data.wallet_admin_receive_commission)
      );
      const accountStakeMintAccountKey = await connection.getAccountInfo(
        stakeMintAccountKey
      );
      let craeteAccountIntruction;
      if (accountStakeMintAccountKey == null) {
        craeteAccountIntruction = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          stakeMintAccountKey,
          new anchor.web3.PublicKey(data.wallet_admin_receive_commission),
          mintToBeStaked
        );
      }
      //
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );

      //
      let signature: string;
      if (craeteAccountIntruction) {
        signature = await program.methods
          .initializeStakePool(
            nonce,
            blockTime,
            tokenOnBlockTime,
            block_time_withdraw_origin,
            range_time_withdraw_profits,
            percent_commission_for_admin
          )
          .accounts({
            payer: wallet.publicKey,
            authority: authority,
            stakePool: stakepool_key,
            stakeMint: stakeMintKey,
            mint: mintToBeStaked,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
            walletReceiveCommission: stakeMintAccountKey,
          })
          .preInstructions([craeteAccountIntruction])
          .postInstructions([
            await program.methods
              .setVault()
              .accounts({
                payer: wallet.publicKey,
                authority: authority,
                stakePool: stakepool_key,
                mint: mintToBeStaked,
                vault: vaultKey,
                tokenProgram: SPL_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .instruction(),
          ])
          .rpc({
            commitment: "finalized",
          });
      } else {
        signature = await program.methods
          .initializeStakePool(
            nonce,
            blockTime,
            tokenOnBlockTime,
            block_time_withdraw_origin,
            range_time_withdraw_profits,
            percent_commission_for_admin
          )
          .accounts({
            payer: wallet.publicKey,
            authority: authority,
            stakePool: stakepool_key,
            stakeMint: stakeMintKey,
            mint: mintToBeStaked,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
            walletReceiveCommission: stakeMintAccountKey,
          })
          .postInstructions([
            await program.methods
              .setVault()
              .accounts({
                payer: wallet.publicKey,
                authority: authority,
                stakePool: stakepool_key,
                mint: mintToBeStaked,
                vault: vaultKey,
                tokenProgram: SPL_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .instruction(),
          ])
          .rpc({
            commitment: "finalized",
          });
      }

      console.log("🚀 ~ inittialPool ~ signature:", signature);

      const [stakePool] = await Promise.all([
        program.account.stakePool.fetch(stakepool_key),
      ]);
      showPopup(
        "Info Pool",
        ` <div style="display:flex;gap:8px; flex-direction: column;">
        <div style="display:flex; justify-content: space-between;">
          <span>Signature:</span>
          <span>${signature}</span>
        </div>
        <div style="display:flex; justify-content: space-between;">
          <span>Pool key:</span>
          <span>${stakepool_key.toString()}</span>
        </div>
        <div style="display:flex; justify-content: space-between;">
        <span>Authority:</span>
        <span>${(stakePool as any).authority.toString()}</span>
      </div>
      <div style="display:flex; justify-content: space-between;">
      <span>Mint:</span>
      <span>${(stakePool as any).mint.toString()}</span>
    </div>
    <div style="display:flex; justify-content: space-between;">
    <span>Stake Mint</span>
    <span>${(stakePool as any).stakeMint.toString()}</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Vault:</span>
  <span>${(stakePool as any).vault.toString()}</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Creator:</span>
  <span>${(stakePool as any).creator.toString()}</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Block Time Withdraw Origin:</span>
  <span>${(
    stakePool as any
  )?.blockTimeWithdrawOrigin?.toString()} seconds</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Range Withdraw Profit:</span>
  <span>${Number((stakePool as any)?.rangeWithdrawProfit)} seconds</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Block Time:</span>
  <span>${(stakePool as any).blockTime.toString()} seconds</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Percent Token On Block Time:</span>
  <span>${Number((stakePool as any).percentTokenOnBlockTime) * 100}% </span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Percent Commission:</span>
  <span>${
    Number((stakePool as any)?.percentCommission?.toString()) * 100
  }%</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Wallet Receive Commission:</span>
  <span>${(stakePool as any)?.walletReceiveCommission?.toString()}</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Status Pool:</span>
  <span>${
    Number((stakePool as any)?.globalState) == 1 ? "Unlocked" : "Locked"
  }</span>
  </div>
      </div>`,
        "info",
        1100
      );
      console.log("🚀 ~ it ~ stakePool:", stakePool);
      console.log({
        authority: (stakePool as any).authority.toString(),
        mint: (stakePool as any).mint.toString(),
        stakeMint: (stakePool as any).stakeMint.toString(),
        vault: (stakePool as any).vault.toString(),
        creator: (stakePool as any).creator.toString(),
        totalWeightedStake: Number(
          (stakePool as any).totalWeightedStake
        ).toString(),
        poolKey: stakepool_key.toString(),
        poolRewards: [],
        blockTimeWithdrawOrigin: (
          stakePool as any
        )?.blockTimeWithdrawOrigin?.toString(),
        rangeWithdrawProfit: Number((stakePool as any)?.rangeWithdrawProfit),
        percentCommission: Number(
          (stakePool as any)?.percentCommission?.toString()
        ),
        walletReceiveCommission: (
          stakePool as any
        )?.walletReceiveCommission?.toString(),
        statusPool: (stakePool as any)?.globalState?.toString(),
        blockTime: Number((stakePool as any).blockTime).toString(),
        tokenOnBlockTime: Number(
          (stakePool as any).tokenOnBlockTime
        ).toString(),
        originPayer: wallet.publicKey,
      });

      setPoolStakeSelect({
        authority: (stakePool as any).authority.toString(),
        mint: (stakePool as any).mint.toString(),
        stakeMint: (stakePool as any).stakeMint.toString(),
        vault: (stakePool as any).vault.toString(),
        creator: (stakePool as any).creator.toString(),
        total_weighted_stake: Number(
          (stakePool as any).totalWeightedStake
        ).toString(),
        pool_key: stakepool_key.toString(),
        block_time_withdraw_origin: (
          stakePool as any
        )?.blockTimeWithdrawOrigin?.toString(),
        range_withdraw_profit: (stakePool as any)?.rangeWithdrawProfit,
        percent_commission: Number(
          (stakePool as any)?.percentCommission?.toString()
        ),
        wallet_receive_commission: (
          stakePool as any
        )?.walletReceiveCommission?.toString(),
        global_state: (stakePool as any)?.globalState?.toString(),
        block_time: Number((stakePool as any).blockTime).toString(),
        percent_token_on_block_time: Number(
          (stakePool as any).tokenOnBlockTime
        ).toString(),
        originPayer: wallet.publicKey,
      });

      apiPoolStaking.saveInfoPoolStaking({
        authority: (stakePool as any).authority.toString(),
        mint: (stakePool as any).mint.toString(),
        stakeMint: (stakePool as any).stakeMint.toString(),
        vault: (stakePool as any).vault.toString(),
        creator: (stakePool as any).creator.toString(),
        totalWeightedStake: Number(
          (stakePool as any).totalWeightedStake
        ).toString(),
        poolKey: stakepool_key.toString(),
        poolRewards: [],
        blockTimeWithdrawOrigin: (
          stakePool as any
        )?.blockTimeWithdrawOrigin?.toString(),
        rangeWithdrawProfit: Number((stakePool as any)?.rangeWithdrawProfit),
        percentCommission: Number(
          (stakePool as any)?.percentCommission?.toString()
        ),
        walletReceiveCommission: (
          stakePool as any
        )?.walletReceiveCommission?.toString(),
        statusPool: (stakePool as any)?.globalState?.toString(),
        blockTime: Number((stakePool as any).blockTime).toString(),
        tokenOnBlockTime: Number(
          (stakePool as any).tokenOnBlockTime
        ).toString(),
        originPayer: wallet.publicKey,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log("🚀 ~ inittialPool ~ err:", err);
      showPopup(
        "Error",
        ` <div style="display:flex;gap:8px; flex-direction: column;">
        <div style="display:flex;justify-content: center">
          <span>${err}</span>
        </div>
      
  </div>
      </div>`,
        "error",
        600,
        "Close"
      );
    }
  };

  const getInfoPool = async (poolKey: string) => {
    if (!program) return;

    const stakepool_key = new anchor.web3.PublicKey(poolKey);
    const [stakePool] = await Promise.all([
      program.account.stakePool.fetch(stakepool_key),
    ]);
    setPoolStakeSelect({
      authority: (stakePool as any).authority.toString(),
      mint: (stakePool as any).mint.toString(),
      stakeMint: (stakePool as any).stakeMint.toString(),
      vault: (stakePool as any).vault.toString(),
      creator: (stakePool as any).creator.toString(),
      total_weighted_stake: Number(
        (stakePool as any).totalWeightedStake
      ).toString(),
      pool_key: stakepool_key.toString(),
      block_time_withdraw_origin: (
        stakePool as any
      )?.blockTimeWithdrawOrigin?.toString(),
      range_withdraw_profit: (stakePool as any)?.rangeWithdrawProfit,
      percent_commission: Number(
        (stakePool as any)?.percentCommission?.toString()
      ),
      wallet_receive_commission: (
        stakePool as any
      )?.walletReceiveCommission?.toString(),
      global_state: (stakePool as any)?.globalState?.toString(),
      block_time: Number((stakePool as any).blockTime).toString(),
      percent_token_on_block_time: Number(
        (stakePool as any).tokenOnBlockTime
      ).toString(),
      originPayer: wallet.publicKey,
    });
    showPopup(
      "Info Pool",
      ` <div style="display:flex;gap:8px; flex-direction: column;">
      <div style="display:flex; justify-content: space-between;">
        <span>Pool key:</span>
        <span>${stakepool_key.toString()}</span>
      </div>
      <div style="display:flex; justify-content: space-between;">
      <span>Authority:</span>
      <span>${(stakePool as any).authority.toString()}</span>
    </div>
    <div style="display:flex; justify-content: space-between;">
    <span>Mint:</span>
    <span>${(stakePool as any).mint.toString()}</span>
  </div>
  <div style="display:flex; justify-content: space-between;">
  <span>Stake Mint</span>
  <span>${(stakePool as any).stakeMint.toString()}</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Vault:</span>
<span>${(stakePool as any).vault.toString()}</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Creator:</span>
<span>${(stakePool as any).creator.toString()}</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Block Time Withdraw Origin:</span>
<span>${(stakePool as any)?.blockTimeWithdrawOrigin?.toString()} seconds</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Range Withdraw Profit:</span>
<span>${Number((stakePool as any)?.rangeWithdrawProfit)} seconds</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Block Time:</span>
<span>${(stakePool as any).blockTime.toString()} seconds</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Percent Token On Block Time:</span>
<span>${Number((stakePool as any).percentTokenOnBlockTime) * 100}% </span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Percent Commission:</span>
<span>${Number((stakePool as any)?.percentCommission?.toString()) * 100}%</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Wallet Receive Commission:</span>
<span>${(stakePool as any)?.walletReceiveCommission?.toString()}</span>
</div>
<div style="display:flex; justify-content: space-between;">
<span>Status Pool:</span>
<span>${
        Number((stakePool as any)?.globalState) == 1 ? "Unlocked" : "Locked"
      }</span>
</div>
    </div>`,
      "info",
      900
    );

    console.log("🚀 ~ it ~ stakePool:", stakePool);
    console.log({
      authority: (stakePool as any).authority.toString(),
      mint: (stakePool as any).mint.toString(),
      stakeMint: (stakePool as any).stakeMint.toString(),
      vault: (stakePool as any).vault.toString(),
      creator: (stakePool as any).creator.toString(),
      totalWeightedStake: Number(
        (stakePool as any).totalWeightedStake
      ).toString(),
      poolKey: stakepool_key.toString(),
      poolRewards: [],
      blockTimeWithdrawOrigin: (
        stakePool as any
      )?.blockTimeWithdrawOrigin?.toString(),
      rangeWithdrawProfit: Number((stakePool as any)?.rangeWithdrawProfit),
      percentCommission: Number(
        (stakePool as any)?.percentCommission?.toString()
      ),
      walletReceiveCommission: (
        stakePool as any
      )?.walletReceiveCommission?.toString(),
      statusPool: (stakePool as any)?.globalState?.toString(),
      blockTime: Number((stakePool as any).blockTime).toString(),
      percentTokenOnBlockTime: Number(
        (stakePool as any).percentTokenOnBlockTime
      ),
      originPayer: wallet.publicKey.toString(),
    });
  };

  const addRewardPool = async (mintTokenNew: string) => {
    try {
      // if (!program) return;
      // setLoading(true);
      // const rewardPoolIndex = poolStakeSelect.pool_rewards.length;
      // const _authority = wallet.publicKey;
      // // const _authority = new anchor.web3.PublicKey("DzguMtFxZkKGhpmrteBLhM6kDBadctp2nyjNY5nRhHfY")
      // const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      // const rewardMint2 = new anchor.web3.PublicKey(mintTokenNew);
      // const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //   [
      //     stakepool_key.toBuffer(),
      //     rewardMint2.toBuffer(),
      //     Buffer.from("rewardVault", "utf-8"),
      //   ],
      //   program.programId
      // );
      // console.log(
      //   "🚀 ~ addRewardPool ~ rewardVaultKey:",
      //   rewardVaultKey.toString()
      // );
      // //  new anchor.web3.PublicKey("7KFPvRysgywysfXYKhGdfec4FKy1uD5j94yHT7suLznG")
      // const signature = await program.methods
      //   .addRewardPool(rewardPoolIndex)
      //   .accounts({
      //     payer: wallet.publicKey,
      //     authority: _authority,
      //     rewardMint: rewardMint2,
      //     stakePool: stakepool_key,
      //     rewardVault: rewardVaultKey,
      //     tokenProgram: SPL_TOKEN_PROGRAM_ID,
      //     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .rpc({
      //     commitment: "finalized",
      //   });
      // console.log("🚀 ~ addRewardPool ~ signature:", signature);
      // await updatePoolStake(mintTokenNew);
      // await getListPoolStake();
      // setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("🚀 ~ addRewardPool ~ err:", err);
    }
  };
  const addReward = async (tokenAddress: string, amount: number) => {
    console.log("🚀 ~ addReward ~ amount:", amount);
    if (!program) return;
    try {
      setLoading(true);
      const pr0_pub = wallet.publicKey;

      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const rewardMint = new anchor.web3.PublicKey(tokenAddress);
      const mint = await getMint(connection, rewardMint);
      console.log("🚀 ~ addReward ~ mint:", mint);
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakepool_key.toBuffer(),
          rewardMint.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      const totalReward = amount * 10 ** mint.decimals;
      const transferIx = createTransferInstruction(
        getAssociatedTokenAddressSync(rewardMint, pr0_pub),
        rewardVaultKey,
        pr0_pub,
        totalReward
      );

      // transfer 1 reward token to RewardPool at index 0
      const signature = await wallet2.sendTransaction(
        new anchor.web3.Transaction().add(transferIx),
        connection,
        { preflightCommitment: "finalized" }
      );
      await connection.confirmTransaction(signature, "finalized");
      console.log("🚀 ~ addReward ~ signature:", signature);
      await updatePoolStake(tokenAddress, amount);
      await getListPoolStake();

      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log("🚀 ~ addReward ~ err:", err);
    }
  };

  // client
  const depositStakingSplToken = async () => {
    try {
      if (!program) return;
      console.log("🚀 ~ depositStakingSplToken ~ program:", program);

      const mintToBeStaked = new anchor.web3.PublicKey(poolStakeSelect.mint);
      console.log(
        "🚀 ~ depositStakingSplToken ~ mintToBeStaked:",
        mintToBeStaked.toString()
      );
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ vaultKey:",
        vaultKey.toString()
      );
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ stakeMint:",
        stakeMint.toString()
      );

      // await importToken(stakeMint.toString());
      // const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   wallet,
      //   stakeMint,
      //   wallet.publicKey,
      //   false,
      // );

      const stakeMintAccountKey = await getAssociatedTokenAddress(
        stakeMint,
        wallet.publicKey
      );
      const accountStakeMintAccountKey = await connection.getAccountInfo(
        stakeMintAccountKey
      );
      let craeteAccountIntruction;
      if (accountStakeMintAccountKey == null) {
        craeteAccountIntruction = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          stakeMintAccountKey,
          wallet.publicKey,
          stakeMint
        );
      }
      console.log(
        "🚀 ~ depositStakingSplToken ~ stakeMintAccountKey:",
        stakeMintAccountKey.toString()
      );
      // console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey2:", stakeMintAccountKey2.address.toString())

      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ mintToBeStakedAccount:",
        mintToBeStakedAccount.toString()
      );

      const deposit1Amount = new anchor.BN(10_000_000_000);
      const min_duration = new anchor.BN(500);

      // deposit

      const nextNonce = await getNextUnusedStakeReceiptNonce(
        program.provider.connection,
        program.programId,
        wallet.publicKey,
        stakepool_key
      );
      // const nextNonce = 0;
      console.log("🚀 ~ depositStakingSplToken ~ nextNonce:", nextNonce);

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakepool_key.toBuffer(),
          new anchor.BN(nextNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      console.log(
        "🚀 ~ depositStakingSplToken ~ stakeReceiptKey:",
        stakeReceiptKey.toString()
      );

      // console.log("🚀 ~ depositStakingSplToken ~ rewardVaultKey:", rewardVaultKey.toString())
      // const arr = poolStakeSelect.pool_rewards.map((reward: any) => {
      //   const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //     [
      //       stakepool_key.toBuffer(),
      //       new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
      //       Buffer.from("rewardVault", "utf-8"),
      //     ],
      //     program.programId
      //   );
      //   return {
      //     pubkey: rewardVaultKey,
      //     isWritable: false,
      //     isSigner: false,
      //   };
      // });
      // console.log("🚀 ~ arr ~ arr:", arr);
      // console.log("🚀 ~ depositStakingSplToken ~ data_receipts:", data_receipts)

      // const instructions_receipt: anchor.web3.TransactionInstruction[] = [];

      // const wait = await Promise.all(data_receipts.map(async (rec) => {
      // console.log("🚀 ~ wait ~ rec:", rec)

      //   const instruc = await program.methods
      //     .updateReceipts()
      //     .accounts({
      //       payer: wallet.publicKey,
      //       stakeMint,
      //       stakePool: stakepool_key,
      //       vault: vaultKey,
      //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      //       systemProgram: anchor.web3.SystemProgram.programId,
      //       globalState: globalStateAddress
      //     })
      //     .remainingAccounts([...rec])
      //     .instruction();
      //   instructions_receipt.push(instruc);
      // }))
      // console.log("🚀 ~ depositStakingSplToken ~ instructions_receipt:", instructions_receipt)

      console.log(
        "🚀 ~ depositStakingSplToken ~ craeteAccountIntruction:",
        craeteAccountIntruction
      );
      let tx: string;
      if (craeteAccountIntruction) {
        tx = await program.methods
          .deposit(nextNonce, deposit1Amount, min_duration)
          .accounts({
            payer: wallet.publicKey,
            owner: wallet.publicKey,
            from: mintToBeStakedAccount,
            stakeMint,
            stakePool: stakepool_key,
            vault: vaultKey,
            destination: stakeMintAccountKey,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .preInstructions([craeteAccountIntruction])
          .rpc();
      } else {
        tx = await program.methods
          .deposit(nextNonce, deposit1Amount, min_duration)
          .accounts({
            payer: wallet.publicKey,
            owner: wallet.publicKey,
            from: mintToBeStakedAccount,
            stakeMint,
            stakePool: stakepool_key,
            vault: vaultKey,
            destination: stakeMintAccountKey,
            stakeDepositReceipt: stakeReceiptKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc({ skipPreflight: true });
      }
    } catch (e) {
      console.log("🚀 ~ depositStakingSplToken ~ e:", e);
    }
  };

  const withfraw = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(poolStakeSelect.mint);
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ vaultKey:",
        vaultKey.toString()
      );
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
        false
      );
      const receiptNonce = receiptNonceNumber;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce);
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
      console.log(
        "🚀 ~ withfraw ~ stakeReceiptKey  withdraw:",
        stakeReceiptKey.toString()
      );

      // const remainingAccounts = poolStakeSelect.pool_rewards.map(reward => {

      //   const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //     [
      //       stakepool_key.toBuffer(),
      //       new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
      //       Buffer.from("rewardVault", "utf-8"),
      //     ],
      //     program.programId
      //   );

      //   const depositorReward1AccountKey = getAssociatedTokenAddressSync(
      //     new anchor.web3.PublicKey(reward.mint_address),
      //     wallet.publicKey
      //   );

      //   return [
      //     {
      //       pubkey: rewardVaultKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //     {
      //       pubkey: depositorReward1AccountKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //   ]
      // })

      const list_deposit = await fetchAllReceipt();
      // const receipts = list_deposit.map((deposit) => {
      //   return {
      //     pubkey: new anchor.web3.PublicKey(deposit.publicKey.toString()),
      //     isWritable: true,
      //     isSigner: false,
      //   }
      // });
      // const data_receipts = chunkArray(receipts, 15);
      // console.log("🚀 ~ depositStakingSplToken ~ data_receipts:", data_receipts)

      // const instructions_receipt: anchor.web3.TransactionInstruction[] = [];

      // const wait = await Promise.all(data_receipts.map(async (rec) => {
      // console.log("🚀 ~ wait ~ rec:", rec)

      //   const instruc = await program.methods
      //     .updateReceipts()
      //     .accounts({
      //       payer: wallet.publicKey,
      //       stakeMint,
      //       stakePool: stakepool_key,
      //       vault: vaultKey,
      //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      //       systemProgram: anchor.web3.SystemProgram.programId,
      //       globalState: globalStateAddress
      //     })
      //     .remainingAccounts([...rec])
      //     .instruction();
      //   instructions_receipt.push(instruc);
      // }))
      // console.log("🚀 ~ withfraw ~ receipts_fater_filter:", receipts_fater_filter[0]?.pubkey.toString())

      const [globalStateAddress, globalStateBump] =
        anchor.web3.PublicKey.findProgramAddressSync(
          [stakepool_key.toBuffer(), Buffer.from("globalState")],
          program.programId
        );
      // const wallet_admin = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   wallet,
      //   mintToBeStaked,
      //   new anchor.web3.PublicKey("4oKM6h3eyzd9A6Bzds3eaYYYfKRUqLkLMUejVnpiqBiN"),
      //   false,
      // );
      const tx = await program.methods
        .withdrawOrigin()
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
          globalState: globalStateAddress,
          walletAdminCommission: new anchor.web3.PublicKey(
            poolStakeSelect.wallet_receive_commission as string
          ),
        })
        // .postInstructions([...instructions_receipt])
        // .remainingAccounts([...remainingAccounts.flat(), ...receipts_fater_filter])
        .rpc({ skipPreflight: true });

      console.log("🚀 ~ withfraw ~ tx:", tx);
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err);
    }
  };
  const withfraw_profit = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(poolStakeSelect.mint);
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ vaultKey:",
        vaultKey.toString()
      );
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
        false
      );
      const receiptNonce = receiptNonceNumber;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce);
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
      console.log(
        "🚀 ~ withfraw ~ stakeReceiptKey  withdraw:",
        stakeReceiptKey.toString()
      );

      // const remainingAccounts = poolStakeSelect.pool_rewards.map(reward => {

      //   const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //     [
      //       stakepool_key.toBuffer(),
      //       new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
      //       Buffer.from("rewardVault", "utf-8"),
      //     ],
      //     program.programId
      //   );

      //   const depositorReward1AccountKey = getAssociatedTokenAddressSync(
      //     new anchor.web3.PublicKey(reward.mint_address),
      //     wallet.publicKey
      //   );

      //   return [
      //     {
      //       pubkey: rewardVaultKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //     {
      //       pubkey: depositorReward1AccountKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //   ]
      // })

      const list_deposit = await fetchAllReceipt();
      // const receipts = list_deposit.map((deposit) => {
      //   if (deposit.publicKey.toString() != stakeReceiptKey.toString()) {

      //     return {
      //       pubkey: new anchor.web3.PublicKey(deposit.publicKey.toString()),
      //       isWritable: true,
      //       isSigner: false,
      //     }
      //   }

      // })
      // const receipts_fater_filter: any[] = receipts.filter(item => item != undefined)
      // console.log("🚀 ~ withfraw ~ receipts_fater_filter:", receipts_fater_filter[0]?.pubkey.toString())

      const [globalStateAddress, globalStateBump] =
        anchor.web3.PublicKey.findProgramAddressSync(
          [stakepool_key.toBuffer(), Buffer.from("globalState")],
          program.programId
        );

      // const wallet_admin = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   wallet,
      //   mintToBeStaked,
      //   new anchor.web3.PublicKey("4oKM6h3eyzd9A6Bzds3eaYYYfKRUqLkLMUejVnpiqBiN"),
      //   false,
      // );
      const tx = await program.methods
        .withdrawProfits()
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
          globalState: globalStateAddress,
          walletAdminCommission: new anchor.web3.PublicKey(
            poolStakeSelect.wallet_receive_commission as string
          ),
        })
        // .remainingAccounts([...remainingAccounts.flat(), ...receipts_fater_filter])
        .rpc({ skipPreflight: true });

      console.log("🚀 ~ constwithfraw_profit= ~ tx:", tx);
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err);
    }
  };

  const claimReward = async (receiptNonceNumber: number) => {
    try {
      if (!program) return;
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);

      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ vaultKey:",
        vaultKey.toString()
      );
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
      // const remainingAccounts = poolStakeSelect.pool_rewards.map((reward) => {
      //   const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      //     [
      //       stakepool_key.toBuffer(),
      //       new anchor.web3.PublicKey(reward.mint_address).toBuffer(),
      //       Buffer.from("rewardVault", "utf-8"),
      //     ],
      //     program.programId
      //   );

      //   const depositorReward1AccountKey = getAssociatedTokenAddressSync(
      //     new anchor.web3.PublicKey(reward.mint_address),
      //     wallet.publicKey
      //   );

      //   return [
      //     {
      //       pubkey: rewardVaultKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //     {
      //       pubkey: depositorReward1AccountKey,
      //       isWritable: true,
      //       isSigner: false,
      //     },
      //   ];
      // });

      // console.log(remainingAccounts.flat());

      // await program.methods
      //   .claimAll()
      //   .accounts({
      //     claimBase: {
      //       owner: wallet.publicKey,
      //       stakePool: stakepool_key,
      //       stakeDepositReceipt: stakeReceiptKey,
      //       tokenProgram: TOKEN_PROGRAM_ID,
      //     },
      //   })
      //   .remainingAccounts(remainingAccounts.flat())
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
      // .rpc({ skipPreflight: true });
    } catch (err) {
      console.log("🚀 ~ claimReward ~ err:", err);
    }
  };

  const infoReceipt = async (receiptNonce: number) => {
    if (!program) return;
    console.log("🚀 ~ infoReceipt ~ poolStakeSelect:", poolStakeSelect);

    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const tokenProgram = splTokenProgram({
      programId: TOKEN_PROGRAM_ID,
      provider: provider as any,
    });
    console.log("🚀 ~ infoReceipt ~ tokenProgram:", tokenProgram);

    const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
    // const rewardMint1 = new anchor.web3.PublicKey(
    //   poolStakeSelect.pool_rewards[0].mint_address
    // );
    // const rewardMint2 = new anchor.web3.PublicKey(
    //   poolStakeSelect.pool_rewards[1].mint_address
    // );

    // const depositerReward1AccKey = getAssociatedTokenAddressSync(
    //   rewardMint1,
    //   wallet.publicKey
    // );
    // const depositerReward2AccKey = getAssociatedTokenAddressSync(
    //   rewardMint2,
    //   wallet.publicKey
    // );
    const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        stakepool_key.toBuffer(),
        new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
        Buffer.from("stakeDepositReceipt", "utf-8"),
      ],
      program.programId
    );

    const [stakeReceipt, stakePool] = await Promise.all([
      // tokenProgram.account.account.fetch(depositerReward1AccKey),
      // tokenProgram.account.account.fetch(depositerReward2AccKey),
      program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
      program.account.stakePool.fetch(stakepool_key),
    ]);
    // console.log("🚀 ~ infoReceipt ~ stakeReceipt:", stakeReceipt)

    (stakeReceipt as any).claimedAmounts.forEach((item: any) => {
      console.log(Number(item));
    });
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
    infoReceipt.dateExpires = new Date(
      (Number(stakeReceipt.lockupDuration) +
        Number(stakeReceipt.depositTimestamp)) *
        1000
    );
    infoReceipt.rewards = await rewards(
      Number(stakeReceipt.effectiveStake) / 10 ** 18
    );
    console.log("🚀 ~ infoReceipt ~ infoReceipt:", infoReceipt);
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
      let infoTokens: any[] = [];
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        console.log(
          "🚀 ~ accounts.forEach ~ parsedAccountInfo:",
          parsedAccountInfo
        );
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        infoTokens.push({
          mintAddress,
          tokenBalance,
        });
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
  async function updateInfoTokens(infoTokens: any[]) {
    try {
      const updatedTokens = await Promise.all(
        infoTokens.map(async (token) => {
          const metadata: any = await getMetadataNew(token.mintAddress);
          return {
            ...token,
            ...metadata, // Assuming metadata has a `.json` property that you want to merge
          };
        })
      );

      console.log(updatedTokens); // This should now log the resolved values
      return updatedTokens; // Return or otherwise use the updated tokens
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
  const rewards = async (amountEffDeposit: number, dateStartStaking = "0") => {
    console.log("🚀 ~ rewards ~ amountEffDeposit:", amountEffDeposit);
    try {
      if (!program) return;

      await getInfoTokenForWallet(
        "",
        new anchor.web3.PublicKey(poolStakeSelect.pool_key)
      );
      const [stakePool] = await Promise.all([
        program.account.stakePool.fetch(
          new anchor.web3.PublicKey(poolStakeSelect.pool_key)
        ),
      ]);
      console.log(
        "🚀 ~ reward ~ stakePool:",
        Number(stakePool.totalWeightedStake)
      );
      const totalWeightedStake =
        Number(stakePool.totalWeightedStake) / 10 ** 18;
      console.log("🚀 ~ rewards ~ totalWeightedStake:", totalWeightedStake);
      // const data = poolStakeSelect.pool_rewards.map((reward) => {
      //   let totalToken = 0;
      //   historyAddReward.forEach((history) => {
      //     if (
      //       history.mint_address == reward.mint_address &&
      //       history.date_time > Number(dateStartStaking)
      //     ) {
      //       totalToken += history.amount;
      //     }
      //   });
      //   return {
      //     mint_address: reward.mint_address,
      //     total: totalToken,
      //   };
      // });
      // const rewards = infoTokens.map((token) => {
      //   if (token.mintAddress != poolStakeSelect.mint) {
      //     const rate = amountEffDeposit / totalWeightedStake;
      //     console.log("🚀 ~ data ~ data:", data);

      //     const total = (
      //       data.find(
      //         (item: any) => item.mint_address == token.mintAddress
      //       ) as any
      //     ).total;
      //     console.log("🚀 ~ rewards ~ total:", total);
      //     return {
      //       addressTokenReward: token.mintAddress,
      //       receiveReward: Number(total) * rate,
      //     };
      //   }
      // });
      console.log("🚀 ~ reward ~ infoTokens:", rewards);
      return rewards;
    } catch (err) {
      console.log("🚀 ~ reward ~ err:", err);
    }
  };

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
    console.log("🚀 ~ result %:", Number(result));

    return result;
  };

  const getTokenMetadata = async (addressToken: string) => {
    const MINT_TO_SEARCH = addressToken;
    try {
      const metaplex = Metaplex.make(connection);

      const tokenAddress = new anchor.web3.PublicKey(MINT_TO_SEARCH);

      // const data = await getMetadataNew(tokenAddress.toString())
      // console.log("🚀 ~ getTokenMetadata ~ data:", data)

      let nft = await metaplex.nfts().findByMint({ mintAddress: tokenAddress });

      return nft;
    } catch (err) {
      console.log("🚀 ~ getInfoTokenForWal ~ err:", err);
    }
  };

  const getMetadataNew = async (address: string) => {
    console.log("🚀 ~ getMetadataNew ~ address---------------------:", address);
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
    const tokenMint = new anchor.web3.PublicKey(address);
    const utl = new Client(config);
    const token: Token = await utl.fetchMint(tokenMint);
    console.log("🚀 ~ getMetadataNew ~ token:", token);
    return token;
  };

  // api
  const updatePoolStake = async (mint_address: string, amount = 0) => {
    try {
      // let rewardsNew: any[] = [];
      // if (
      //   poolStakeSelect.pool_rewards.find(
      //     (reward: any) => reward.mint_address == mint_address
      //   )
      // ) {
      //   poolStakeSelect.pool_rewards.forEach((reward: any) => {
      //     if (reward.mint_address == mint_address) {
      //       reward.amount += reward.amount ? reward.amount + amount : amount;
      //     }
      //     rewardsNew.push(reward);
      //   });
      // } else {
      //   rewardsNew = [...poolStakeSelect.pool_rewards];
      //   rewardsNew.push({
      //     mint_address,
      //     amount,
      //   });
      // }
      // const result = await apiPoolStaking.updateInfoPoolStaking({
      //   authority: wallet.publicKey.toString(),
      //   poolKey: poolStakeSelect.pool_key,
      //   pool_rewards: rewardsNew,
      // });
      // return result;
    } catch (err) {
      console.log("🚀 ~ updatePoolStake ~ err:", err);
    }
  };
  const getListPoolStake = async () => {
    try {
      const result = await apiPoolStaking.getAllPoolStakingByAuthority();
      console.log("🚀 ~ getListPoolStake ~ data:", result);
      // setListPoolStake(result.data);
      // setPoolStakeSelect(result.data[result.data.length - 1]);
    } catch (err) {
      console.log("🚀 ~ getListPoolStake ~ err:", err);
    }
  };

  useEffect(() => {
    getListPoolStake();
  }, []);
  useEffect(() => {
    if (poolStakeSelect && poolStakeSelect.pool_key) {
      getInfoTokenForWallet(
        "",
        new anchor.web3.PublicKey(poolStakeSelect.pool_key)
      );
    }
  }, [poolStakeSelect]);

  const fetchAllReceipt = async () => {
    if (!program) return [];
    console.log("🚀 ~ fetchAllReceipt ~ program:", program);
    const mintToBeStaked = new anchor.web3.PublicKey(poolStakeSelect.mint);
    const mintToBeStakedAccount = getAssociatedTokenAddressSync(
      mintToBeStaked,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    const allReceipts = await program.account.stakeDepositReceipt.all();

    console.log("🚀 ~ fetchAllReceipt ~ allReceipts:", allReceipts);
    allReceipts.forEach((item) => {
      console.log({
        publicKey: item.publicKey.toString(),
        percent: Number(item.account.percentCurrent),
        amount_claimed: Number(item.account.amountClaimed),
        lastUpdate: Number(item.account.lastTimeUpdate),
        timeDeposit: Number(item.account.depositTimestamp),
        effective_stake: Number(item.account.effectiveStake),

        depositAmount: Number(item.account.depositAmount),

        timeLimit: new Date(
          Number(item.account.depositTimestamp) * 1000 + 1000 * 1000
        ),
      });
    });

    return allReceipts;
  };
  useEffect(() => {
    console.log("useEffect sync address");

    if (!(window as any).Jupiter.syncProps) {
      console.log("useEffect no Jupiter");

      return;
    }
    console.log("useEffect have Jupiter");

    (window as any).Jupiter.syncProps({ wallet2 });
  }, [wallet2.connected]);

  (window as any).Jupiter.init({
    displayMode: "widget",
    // integratedTargetId: "integrated-terminal",
    endpoint:
      "https://mainnet.helius-rpc.com/?api-key=09504665-044a-4169-978c-bcca7f758d02",
  });

  //

  // begin transferAmountMintToAdmin

  const [amountToAdmin, setAmountToAdmin] = useState(0);
  const [addressAdmin, setAddressAdmin] = useState("");

  const transferAmountMintToAdmin = async () => {
    try {
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(poolStakeSelect.mint);
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakepool_key.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log(
        "🚀 ~ depositStakingSplToken ~ vaultKey:",
        vaultKey.toString()
      );

      const stakeMintAccountKey = await getAssociatedTokenAddress(
        mintToBeStaked,
        new anchor.web3.PublicKey(addressAdmin)
      );
      const accountStakeMintAccountKey = await connection.getAccountInfo(
        stakeMintAccountKey
      );
      let craeteAccountIntruction;
      if (accountStakeMintAccountKey == null) {
        craeteAccountIntruction = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          stakeMintAccountKey,
          new anchor.web3.PublicKey(addressAdmin),
          mintToBeStaked
        );
      }

      let tx: string;
      if (craeteAccountIntruction) {
        tx = await program.methods
          .transferToAdmin(new anchor.BN(amountToAdmin * 10 ** 9))
          .accounts({
            authority: wallet.publicKey,
            vault: vaultKey,
            stakePool: stakepool_key,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            destination: stakeMintAccountKey,
          })
          .preInstructions([craeteAccountIntruction])
          .rpc({ skipPreflight: true });
      } else {
        tx = await program.methods
          .transferToAdmin(new anchor.BN(amountToAdmin * 10 ** 9))
          .accounts({
            authority: wallet.publicKey,
            vault: vaultKey,
            stakePool: stakepool_key,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            destination: stakeMintAccountKey,
          })
          .rpc({ skipPreflight: true });
      }

      console.log("🚀 ~ transferAmountMintToAdmin ~ tx:", tx);
    } catch (err) {
      console.log("🚀 ~ withfraw ~ err:", err);
      showPopup(
        "Error",
        ` <div style="display:flex;gap:8px; flex-direction: column;">
        <div style="display:flex;justify-content: center">
          <span>${err}</span>
        </div>
      
  </div>
      </div>`,
        "error",
        600,
        "Close"
      );
    }
  };

  // end transferAmountMintToAdmin

  // begin lockPool
  const [statusPool, setStatusPool] = useState<number>(1);
  const lockPool = async () => {
    try {
      if (!program) return;
      console.log("🚀 ~ getStatusLocked ~ program:", program);
      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      console.log("🚀 ~ lockPool ~ stakepool_key:", stakepool_key);

      const tx = await program.methods
        .lockPool(new anchor.BN(statusPool))
        .accounts({
          authority: wallet.publicKey,
          newAuthority: wallet.publicKey,
          stakePool: stakepool_key,
        })
        .rpc({ skipPreflight: true });
      console.log("🚀 ~ lockPool ~ tx:", tx);
    } catch (err) {
      showPopup(
        "Error",
        ` <div style="display:flex;gap:8px; flex-direction: column;">
        <div style="display:flex;justify-content: center">
          <span>${err}</span>
        </div>
      
  </div>
      </div>`,
        "error",
        600,
        "Close"
      );
    }
  };
  // end lockPool

  // begin updateCommission
  const [percentCommission, setPercentCommission] = useState<number>(0);
  const [messagePercentCommission, setMessagePercentCommission] =
    useState<string>("");

  async function updateCommission() {
    try {
      if (percentCommission <= 0 || percentCommission > 100) {
        setMessagePercentCommission("Amount less then 100 and greather than 1");
        return;
      }
      if (!program) return;

      console.log(
        "🚀 ~ updateCommission ~ percentCommission:",
        Number(percentCommission) / 100
      );

      const stakepool_key = new anchor.web3.PublicKey(poolStakeSelect.pool_key);
      const tx = await program.methods
        .updatePercentComission(Number(percentCommission) / 100)
        .accounts({
          authority: wallet.publicKey,
          stakePool: stakepool_key,
        })
        .rpc({ skipPreflight: true });
      console.log("🚀 ~ transferAmountMintToAdmin ~ tx:", tx);
    } catch (err) {
      console.log("🚀 ~ updateCommission ~ err:", err);
      showPopup(
        "Error",
        ` <div style="display:flex;gap:8px; flex-direction: column;">
        <div style="display:flex;justify-content: center">
          <span>${err}</span>
        </div>
      
  </div>
      </div>`,
        "error",
        600,
        "Close"
      );
    }
  }
  // end updateCommission

  return (
    <div
      style={{ minWidth: 240 }}
      className="mb-8   flex  w-[600px] flex-col gap-5"
    >
      <div className="w-full border-b border-gray-500 pb-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 w-[70%]">
            <span>Mint Address</span>
            <input
              name="mintAddress"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "mintAddress";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Enter address token stake"
              className="mb-4 "
            ></input>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <span>None</span>
            <input
              name="none"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "none";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="None"
              className="mb-4 "
            ></input>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Block Time</span>
            <input
              name="block_time"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "block_time";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Min Weight"
              className="mb-4"
            ></input>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span>Percent Token On Block Time</span>
            <input
              name="token_on_block_time"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "token_on_block_time";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Percent Token On Block Time"
              className="mb-4"
            ></input>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Block Time Withdraw Origin</span>
            <input
              name="block_time_withdraw_origin"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "block_time_withdraw_origin";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Block Time Withdraw Origin"
              className="mb-4"
            ></input>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span>Range Time Withdraw Profits</span>
            <input
              name="range_time_withdraw_profits"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "range_time_withdraw_profits";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Block Time Withdraw Origin"
              className="mb-4"
            ></input>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Percent Commission For Admin</span>
            <input
              name="percent_commission_for_admin"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "percent_commission_for_admin";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Percent Commission For Admin"
              className="mb-4"
            ></input>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span>Wallet Admin Receive Commission</span>
            <input
              name="wallet_admin_receive_commission"
              onChange={(e) => {
                const value = e.target.value;
                const nameKey = "wallet_admin_receive_commission";
                setValueToPoolInfo(nameKey, value);
              }}
              placeholder="Wallet Admin Receive Commission"
              className="mb-4"
            ></input>
          </div>
        </div>
        {loading ? (
          <Loader></Loader>
        ) : (
          <button
            className="btn btn-primary rounded-full normal-case	w-full"
            onClick={() => inittialPool(poolInfo)}
            style={{ minHeight: 0, height: 40 }}
          >
            Create pool stake
          </button>
        )}
      </div>
      {/* <div className="w-full border-b border-gray-500 pb-4">
        <h1 className="mb-5 text-3xl text-center">Add Pool Reward</h1>
        <div className="flex gap-3">
          <input
            name="tokenReward"
            onChange={(e) => {
              setTokenReward(e.target.value);
            }}
            placeholder="Address Token Reward"
            className="mb-4 "
          ></input>
        </div>

        {loading ? (
          <Loader></Loader>
        ) : (
          <button
            className="btn btn-primary rounded-full normal-case	w-full"
            onClick={() => addRewardPool(tokenReward)}
            style={{ minHeight: 0, height: 40 }}
          >
            Add Pool Reward
          </button>
        )}
      </div> */}

      {/* <div className="w-full  border-b border-gray-500 pb-4">
        <h1 className="mb-5 text-3xl text-center">Add Token To Pool Reward</h1>
        {poolStakeSelect?.pool_rewards?.length > 0 &&
          poolStakeSelect?.pool_rewards?.map(
            (
              reward: { mint_address: string },
              index: Key | null | undefined
            ) => {
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex gap-2">
                    <img
                      src={
                        infoTokens.find(
                          (token) => token.mintAddress === reward.mint_address
                        )?.logoURI
                      }
                      className="w-[40px] h-[40px] rounded-full"
                      alt=""
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">
                        {
                          infoTokens.find(
                            (token) => token.mintAddress === reward.mint_address
                          )?.name
                        }
                      </span>
                      <span className="font-bold">
                        {infoTokens
                          .find(
                            (token) => token.mintAddress === reward.mint_address
                          )
                          ?.tokenBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <input
                    name="amount"
                    type="number"
                    onChange={(e) => {
                      setAmountReward(Number(e.target.value));
                    }}
                    placeholder="Amount Reward"
                    className="mb-4 flex-1"
                  ></input>
                  {loading ? (
                    <Loader></Loader>
                  ) : (
                    <button
                      className="btn btn-primary rounded-full normal-case"
                      onClick={() =>
                        addReward(reward.mint_address, amountReward)
                      }
                      style={{ minHeight: 0, height: 40 }}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            }
          )}
      </div> */}

      {/* <button
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
      </button> */}

      {/* <button
        className="btn btn-primary rounded-full normal-case	w-full"
        onClick={() =>
          calculateStakeWeight(
            new anchor.BN(poolStakeSelect.min_duration),
            new anchor.BN(poolStakeSelect.max_duration),
            new anchor.BN(poolStakeSelect.base_weight),
            new anchor.BN(poolStakeSelect.max_weight),
            new anchor.BN(31536000)
          )
        }
        style={{ minHeight: 0, height: 40 }}
      >
        % weight
      </button> */}

      <div className="border-b border-gray-500 pb-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>Status</span>
            <select
              onChange={(e) => {
                setStatusPool(Number(e.target.value));
              }}
              name=""
              id=""
            >
              <option value="0">Lock</option>
              <option value="1">Unlock</option>
            </select>
          </div>
        </div>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => lockPool()}
          style={{ minHeight: 0, height: 40 }}
        >
          Update Status Pool
        </button>
      </div>
      <div className="border-b border-gray-500 pb-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <span>
              Percent{" "}
              <span className="text-yellow-500 font-bold">(1 - 100)%</span>
            </span>
            <input
              type="number"
              onChange={(e) => {
                const number = Number(e.target.value);
                if (number < 1 || number > 100) {
                  setMessagePercentCommission(
                    "Amount less then 100 and greather than 1"
                  );
                } else {
                  setMessagePercentCommission("");
                }
                setPercentCommission(number);
              }}
              placeholder="Amount to admin"
            />
          </div>
        </div>
        <span className="text-red-500">{messagePercentCommission}</span>
        <button
          disabled={percentCommission < 1 || percentCommission > 100}
          className={`btn btn-primary rounded-full normal-case	w-full `}
          onClick={() => updateCommission()}
          style={{ minHeight: 0, height: 40 }}
        >
          Update Percent Commission
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 w-[70%]">
            <span>Amount</span>
            <input
              type="number"
              onChange={(e) => {
                setAmountToAdmin(Number(e.target.value));
              }}
              placeholder="Amount to admin"
            />
          </div>
          <div className="flex flex-col gap-2 w-[70%]">
            <span>Adress Receive Token</span>
            <input
              type="text"
              onChange={(e) => {
                setAddressAdmin(e.target.value);
              }}
              placeholder="Adress to admin"
            />
          </div>
        </div>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => transferAmountMintToAdmin()}
          style={{ minHeight: 0, height: 40 }}
        >
          Transfer Token From Vault Pool
        </button>
      </div>

      {/* Client */}
      <div className="flex flex-col gap-3">
        <span className="text-2xl">Client</span>
        <span className="text-gray-500 font-bold text-lg">
          Pool key:
          <span className="text-yellow-500 font-bold text-lg">
            {poolStakeSelect.pool_key}
          </span>
        </span>
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
          Withdraw origin
        </button>

        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => withfraw_profit(0)}
          style={{ minHeight: 0, height: 40 }}
        >
          Withdraw profit
        </button>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={() => getInfoPool(poolStakeSelect.pool_key)}
          style={{ minHeight: 0, height: 40 }}
        >
          Get pool info
        </button>
      </div>
    </div>
  );
};
