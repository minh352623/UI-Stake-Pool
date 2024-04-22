export interface IInfoPoolStake {
  authority: string;
  mint: string;
  stakeMint: string;
  vault: string;
  creator: string;
  total_weighted_stake: string;
  base_weight?: string;
  max_weight?: string;
  min_duration?: string;
  max_duration?: string;
  pool_key: string;
  pool_rewards?: any[];
  block_time?: string;
  percent_token_on_block_time?: string;
  originPayer?: string;
  block_time_withdraw_origin?: string;
  range_withdraw_profit?: string;
  percent_commission?: number;
  wallet_receive_commission?: string;
  global_state?: string;
}

export interface IInfoPoolStakeCreate {
  authority: string;
  mint: string;
  stakeMint: string;
  vault: string;
  creator: string;
  totalWeightedStake: string;
  baseWeight?: string;
  maxWeight?: string;
  minDuration?: string;
  maxDuration?: string;
  poolKey: string;
  poolRewards: any[];
  blockTime: string;
  tokenOnBlockTime: string;
  originPayer: string;
  blockTimeWithdrawOrigin: string;
  rangeWithdrawProfit: number;
  percentCommission: number;
  walletReceiveCommission: string;
  statusPool: number | string;
}

export interface IUpdateInfoPoolStake {
  poolKey: string;
  authority: string;
  pool_rewards: any[];
}
