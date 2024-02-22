import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { IDL } from "./spl_token_staking-2";

// import { IDL } from "./spl_token_staking";


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
    console.log(program)
  }, [connection, wallet]);

  const updateProgram = () => {
    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });
    console.log("provider", provider);

    //   const idl = await anchor.Program.fetchIdl(programID, provider);
    //   console.log("idl", idl);

    // const programID = new PublicKey(idl.metadata.address);
    // const program = new anchor.Program(idl as any, programID, provider);
    // setProgram(program);
    // const programId = new anchor.web3.PublicKey(
    //   "9TemRuwmBFsgkss4HiqvpKugVHpRR7vVc7aufiPGn9qA"
    // );
    const programId = new anchor.web3.PublicKey(
      "6JN3LnpcgnFAZ7TjGkY5FUA2L8nNez5AigtsAuvs5Wwz"
    );

    // const programId = new anchor.web3.PublicKey(
    //   "7XzqcW4VPEzCzrhbgoDEbXtSTNVQ87Vh6m1byK2zjWYD"
    // );

    const program = new anchor.Program(IDL as any, programId, provider);
    setProgram(program);
  };

  return {
    program,
  };
};
