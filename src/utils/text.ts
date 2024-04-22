const TokenSwapLayout = struct([
  u8("version"),
  u8("isInitialized"),
  u8("bumpSeed"),
  publicKey("poolTokenProgramId"),
  publicKey("tokenAccountA"),
  publicKey("tokenAccountB"),
  publicKey("tokenPool"),
  publicKey("mintA"),
  publicKey("mintB"),
  publicKey("feeAccount"),
  u64("tradeFeeNumerator"),
  u64("tradeFeeDenominator"),
  u64("ownerTradeFeeNumerator"),
  u64("ownerTradeFeeDenominator"),
  u64("ownerWithdrawFeeNumerator"),
  u64("ownerWithdrawFeeDenominator"),
  u64("hostFeeNumerator"),
  u64("hostFeeDenominator"),
  u8("curveType"),
  blob(32, "curveParameters"),
]);
const SWAP_PROGRAM_ID = new PublicKey(
  "FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X"
);

async function getSwapPools(tokenA: PublicKey, tokenB: PublicKey) {
  const connection = new anchor.web3.Connection(
    "https://mainnet.helius-rpc.com/?api-key=09504665-044a-4169-978c-bcca7f758d02",
    "confirmed"
  );

  const resp = await connection.getProgramAccounts(SWAP_PROGRAM_ID, {
    commitment: "confirmed",
    filters: [
      {
        memcmp: {
          offset: 1 + 1 + 1 + 32 + 32 + 32 + 32,
          bytes: tokenA.toString(),
        },
      },
      {
        memcmp: {
          offset: 1 + 1 + 1 + 32 + 32 + 32 + 32 + 32,
          bytes: tokenB.toString(),
        },
      },
    ],
  });
  const respInverse = await connection.getProgramAccounts(SWAP_PROGRAM_ID, {
    commitment: "confirmed",
    filters: [
      {
        memcmp: {
          offset: 1 + 1 + 1 + 32 + 32 + 32 + 32,
          bytes: tokenB.toString(),
        },
      },
      {
        memcmp: {
          offset: 1 + 1 + 1 + 32 + 32 + 32 + 32 + 32,
          bytes: tokenA.toString(),
        },
      },
    ],
  });
  return resp.concat(respInverse).map((m) => {
    return {
      pubkey: m.pubkey,
      account: TokenSwapLayout.decode(m.account.data),
    };
  });
}
async function getPoolDetail(pool: any) {
  const connection = new anchor.web3.Connection(
    "https://mainnet.helius-rpc.com/?api-key=09504665-044a-4169-978c-bcca7f758d02",
    "confirmed"
  );

  const resp = await connection.getMultipleParsedAccounts([
    pool.account.tokenAccountA,
    pool.account.tokenAccountB,
  ]);
  // console.log("LP Mint:", pool.tokenPool.toString())

  return {
    tokenAccountA: (resp?.value[0]?.data as any).parsed?.info,
    tokenAccountB: (resp?.value[1]?.data as any).parsed?.info,
  };
}
