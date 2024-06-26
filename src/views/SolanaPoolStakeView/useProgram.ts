import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { IDL } from "./spl_token_staking-version-2";

const program_id_staking = process.env.NEXT_PUBLIC_PROGRAM_STKING;
export interface Wallet {
  signTransaction(
    tx: anchor.web3.Transaction
  ): Promise<anchor.web3.Transaction>;
  signAllTransactions(
    txs: anchor.web3.Transaction[]
  ): Promise<anchor.web3.Transaction[]>;
  publicKey: anchor.web3.PublicKey;
}

type ProgramProps = {
  connection: Connection;
  wallet: Wallet;
};

export const useProgram = ({ connection, wallet }: ProgramProps) => {
  const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

  useEffect(() => {
    updateProgram();
    console.log(program);
  }, [connection, wallet]);

  const updateProgram = () => {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    //version 2

    const programId = new anchor.web3.PublicKey(program_id_staking as string);
    const program = new anchor.Program(IDL as any, programId, provider);
    setProgram(program);
  };

  return {
    program,
  };
};
