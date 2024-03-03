

export interface IInfoPoolStake {
  authority: string;
  mint: string;
  stakeMint: string;
  vault: string;
  creator: string;
  totalWeightedStake: string;
  base_weight: string;
  max_weight: string;
  min_duration: string;
  max_duration: string;
  pool_key: string;
  pool_rewards: any[];
  block_time:string;
  token_on_block_time:string;
  originPayer: string;
}

export interface IInfoPoolStakeCreate {
  authority: string;
  mint: string;
  stakeMint: string;
  vault: string;
  creator: string;
  totalWeightedStake: string;
  baseWeight: string;
  maxWeight: string;
  minDuration: string;
  maxDuration: string;
  poolKey: string;
  poolRewards: any[];
  blockTime:string;
  tokenOnBlockTime:string;
  originPayer: string;
}

export interface IUpdateInfoPoolStake {
  poolKey: string;
  authority: string;
  pool_rewards: any[]
}