

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
}

export interface IUpdateInfoPoolStake {
  poolKey: string;
  authority: string;
  pool_rewards: any[]
}