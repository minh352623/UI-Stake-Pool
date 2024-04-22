export type SplTokenStaking = {
  version: "1.3.1";
  name: "spl_token_staking";
  instructions: [
    {
      name: "initializeStakePool";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
          docs: ["Payer of rent"];
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
          docs: ["Authority that can add rewards pools"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
          docs: [
            "SPL Token Mint of the underlying token to be deposited for staking"
          ];
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeMint";
          isMut: true;
          isSigner: false;
          docs: ["An SPL token Mint for the effective stake weight token"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "walletReceiveCommission";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "nonce";
          type: "u8";
        },
        {
          name: "blockTime";
          type: "u64";
        },
        {
          name: "tokenOnBlockTime";
          type: "u64";
        },
        {
          name: "blockTimeWithdrawOrigin";
          type: "u64";
        },
        {
          name: "rangeWithdrawProfit";
          type: "u64";
        },
        {
          name: "percentCommission";
          type: "u64";
        }
      ];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
          docs: [
            "Owner of the StakeDepositReceipt, which may differ",
            "from the account staking."
          ];
        },
        {
          name: "from";
          isMut: true;
          isSigner: false;
          docs: [
            "Token Account to transfer stake_mint from, to be deposited into the vault"
          ];
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
          docs: ["Vault of the StakePool token will be transfer to"];
        },
        {
          name: "stakeMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
          docs: ["Token account the StakePool token will be transfered to"];
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
          docs: ["StakePool owning the vault that will receive the deposit"];
        },
        {
          name: "stakeDepositReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "nonce";
          type: "u32";
        },
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "lockupDuration";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawOrigin";
      accounts: [
        {
          name: "claimBase";
          accounts: [
            {
              name: "owner";
              isMut: true;
              isSigner: true;
              docs: ["Owner of the StakeDepositReceipt"];
            },
            {
              name: "stakePool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "stakeDepositReceipt";
              isMut: true;
              isSigner: false;
              docs: [
                "StakeDepositReceipt of the owner that will be used to claim respective rewards"
              ];
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            }
          ];
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
          docs: ["Vault of the StakePool token will be transferred from"];
        },
        {
          name: "stakeMint";
          isMut: true;
          isSigner: false;
          docs: ["stake_mint of StakePool that will be burned"];
        },
        {
          name: "from";
          isMut: true;
          isSigner: false;
          docs: [
            "Token Account holding weighted stake representation token to burn"
          ];
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
          docs: ["Token account to transfer the previously staked token to"];
        },
        {
          name: "walletAdminCommission";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "withdrawProfits";
      accounts: [
        {
          name: "claimBase";
          accounts: [
            {
              name: "owner";
              isMut: true;
              isSigner: true;
              docs: ["Owner of the StakeDepositReceipt"];
            },
            {
              name: "stakePool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "stakeDepositReceipt";
              isMut: true;
              isSigner: false;
              docs: [
                "StakeDepositReceipt of the owner that will be used to claim respective rewards"
              ];
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            }
          ];
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
          docs: ["Vault of the StakePool token will be transferred from"];
        },
        {
          name: "stakeMint";
          isMut: true;
          isSigner: false;
          docs: ["stake_mint of StakePool that will be burned"];
        },
        {
          name: "from";
          isMut: true;
          isSigner: false;
          docs: [
            "Token Account holding weighted stake representation token to burn"
          ];
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
          docs: ["Token account to transfer the previously staked token to"];
        },
        {
          name: "walletAdminCommission";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "transferToAdmin";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
          docs: ["Authority of the StakePool"];
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
          docs: ["Vault of the StakePool token will be transferred from"];
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
          docs: ["Token account to transfer the previously staked token to"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "transferAuthority";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
          docs: ["Current authority of the StakePool"];
        },
        {
          name: "newAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
          docs: ["StakePool that will have it's authority updated"];
        }
      ];
      args: [];
    },
    {
      name: "lockPool";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
          docs: ["Current authority of the StakePool"];
        },
        {
          name: "newAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
          docs: ["StakePool that will have it's authority updated"];
        }
      ];
      args: [
        {
          name: "status";
          type: "u64";
        }
      ];
    },
    {
      name: "setVault";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
          docs: ["Payer of rent"];
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
          docs: ["Current authority of the StakePool"];
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
          docs: ["StakePool that will have it's authority updated"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
          docs: [
            "SPL Token Mint of the underlying token to be deposited for staking"
          ];
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
          docs: ["An SPL token Account for staging A tokens"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "updatePercentComission";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
          docs: ["Current authority of the StakePool"];
        },
        {
          name: "stakePool";
          isMut: true;
          isSigner: false;
          docs: ["StakePool that will have it's authority updated"];
        }
      ];
      args: [
        {
          name: "percentCommission";
          type: "f64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "stakePool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            docs: [
              "The original creator of the StakePool. Necessary for signer seeds"
            ];
            type: "publicKey";
          },
          {
            name: "authority";
            docs: ["Pubkey that can make updates to StakePool"];
            type: "publicKey";
          },
          {
            name: "totalWeightedStake";
            docs: [
              "Total amount staked that accounts for the lock up period weighting.\n    Note, this is not equal to the amount of SPL Tokens staked."
            ];
            type: "u64";
          },
          {
            name: "vault";
            docs: ["Token Account to store the staked SPL Token"];
            type: "publicKey";
          },
          {
            name: "mint";
            docs: ["Mint of the token being staked"];
            type: "publicKey";
          },
          {
            name: "stakeMint";
            docs: ["Mint of the token representing effective stake"];
            type: "publicKey";
          },
          {
            name: "nonce";
            docs: ["Nonce to derive multiple stake pools from same mint"];
            type: "u8";
          },
          {
            name: "bumpSeed";
            docs: ["Bump seed for stake_mint"];
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 6];
            };
          },
          {
            name: "reserved0";
            type: {
              array: ["u8", 256];
            };
          },
          {
            name: "blockTime";
            type: "u64";
          },
          {
            name: "percentTokenOnBlockTime";
            type: "f64";
          },
          {
            name: "blockTimeWithdrawOrigin";
            type: "u64";
          },
          {
            name: "rangeWithdrawProfit";
            type: "i64";
          },
          {
            name: "percentCommission";
            type: "f64";
          },
          {
            name: "walletReceiveCommission";
            type: "publicKey";
          },
          {
            name: "globalState";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "stakeDepositReceipt";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            docs: ["Pubkey that owns the staked assets"];
            type: "publicKey";
          },
          {
            name: "payer";
            docs: ["Pubkey that paid for the deposit"];
            type: "publicKey";
          },
          {
            name: "stakePool";
            docs: ["StakePool the deposit is for"];
            type: "publicKey";
          },
          {
            name: "lockupDuration";
            docs: ["Duration of the lockup period in seconds"];
            type: "u64";
          },
          {
            name: "depositTimestamp";
            docs: ["Timestamp in seconds of when the stake lockup began"];
            type: "i64";
          },
          {
            name: "depositAmount";
            docs: ["Amount of SPL token deposited"];
            type: "u64";
          },
          {
            name: "effectiveStake";
            docs: ["Amount of stake weighted by lockup duration."];
            type: "u64";
          },
          {
            name: "lastTimeUpdate";
            type: "i64";
          },
          {
            name: "percentCurrent";
            type: "f64";
          },
          {
            name: "amountClaimed";
            type: "u64";
          },
          {
            name: "nonAmountClaimed";
            type: "u64";
          },
          {
            name: "amountClaimedAdmin";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidAuthority";
      msg: "Invalid StakePool authority";
    },
    {
      code: 6001;
      name: "RewardPoolIndexOccupied";
      msg: "RewardPool index is already occupied";
    },
    {
      code: 6002;
      name: "InvalidStakePoolVault";
      msg: "StakePool vault is invalid";
    },
    {
      code: 6003;
      name: "InvalidStakePoolAdminCommission";
      msg: "Stake admin commission is invalid";
    },
    {
      code: 6004;
      name: "InvalidRewardPoolVault";
      msg: "RewardPool vault is invalid";
    },
    {
      code: 6005;
      name: "InvalidRewardPoolVaultIndex";
      msg: "Invalid RewardPool vault remaining account index";
    },
    {
      code: 6006;
      name: "InvalidOwner";
      msg: "Invalid StakeDepositReceiptOwner";
    },
    {
      code: 6007;
      name: "InvalidStakePool";
      msg: "Invalid StakePool";
    },
    {
      code: 6008;
      name: "PrecisionMath";
      msg: "Math precision error";
    },
    {
      code: 6009;
      name: "InvalidStakeMint";
      msg: "Invalid stake mint";
    },
    {
      code: 6010;
      name: "StakeStillLocked";
      msg: "Stake is still locked";
    },
    {
      code: 6011;
      name: "InvalidStakePoolDuration";
      msg: "Max duration must be great than min";
    },
    {
      code: 6012;
      name: "InvalidStakePoolWeight";
      msg: "Max weight must be great than min";
    },
    {
      code: 6013;
      name: "DurationTooShort";
      msg: "Duration too short";
    },
    {
      code: 6014;
      name: "Unauthorized";
      msg: "The caller is not authorized to perform this action.";
    },
    {
      code: 6015;
      name: "ResourceLocked";
      msg: "The resource is currently locked.";
    },
    {
      code: 6016;
      name: "TimeCalculationError";
      msg: "The resource is TimeCalculationError.";
    },
    {
      code: 6017;
      name: "CalculationOverflow";
      msg: "The resource is CalculationOverflow.";
    },
    {
      code: 6018;
      name: "BlockTimeWithdrawOrigin";
      msg: "Block Time Withraw Origin.";
    },
    {
      code: 6019;
      name: "WalletAdminError";
      msg: "Wallet Address Is Not Authorize.";
    },
    {
      code: 6020;
      name: "InvalidOwnerSign";
      msg: "The given owner is not part of this multisig.";
    },
    {
      code: 6021;
      name: "InvalidOwnersLen";
      msg: "Owners length must be non zero.";
    },
    {
      code: 6022;
      name: "NotEnoughSigners";
      msg: "Not enough owners signed this transaction.";
    },
    {
      code: 6023;
      name: "TransactionAlreadySigned";
      msg: "Cannot delete a transaction that has been signed by an owner.";
    },
    {
      code: 6024;
      name: "Overflow";
      msg: "Overflow when adding.";
    },
    {
      code: 6025;
      name: "UnableToDelete";
      msg: "Cannot delete a transaction the owner did not create.";
    },
    {
      code: 6026;
      name: "AlreadyExecuted";
      msg: "The given transaction has already been executed.";
    },
    {
      code: 6027;
      name: "InvalidThreshold";
      msg: "Threshold must be less than or equal to the number of owners.";
    },
    {
      code: 6028;
      name: "UniqueOwners";
      msg: "Owners must be unique";
    }
  ];
};

export const IDL: SplTokenStaking = {
  version: "1.3.1",
  name: "spl_token_staking",
  instructions: [
    {
      name: "initializeStakePool",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
          docs: ["Payer of rent"],
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
          docs: ["Authority that can add rewards pools"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
          docs: [
            "SPL Token Mint of the underlying token to be deposited for staking",
          ],
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeMint",
          isMut: true,
          isSigner: false,
          docs: ["An SPL token Mint for the effective stake weight token"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "walletReceiveCommission",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u8",
        },
        {
          name: "blockTime",
          type: "u64",
        },
        {
          name: "tokenOnBlockTime",
          type: "u64",
        },
        {
          name: "blockTimeWithdrawOrigin",
          type: "u64",
        },
        {
          name: "rangeWithdrawProfit",
          type: "u64",
        },
        {
          name: "percentCommission",
          type: "u64",
        },
      ],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
          docs: [
            "Owner of the StakeDepositReceipt, which may differ",
            "from the account staking.",
          ],
        },
        {
          name: "from",
          isMut: true,
          isSigner: false,
          docs: [
            "Token Account to transfer stake_mint from, to be deposited into the vault",
          ],
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
          docs: ["Vault of the StakePool token will be transfer to"],
        },
        {
          name: "stakeMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
          docs: ["Token account the StakePool token will be transfered to"],
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
          docs: ["StakePool owning the vault that will receive the deposit"],
        },
        {
          name: "stakeDepositReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u32",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "lockupDuration",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawOrigin",
      accounts: [
        {
          name: "claimBase",
          accounts: [
            {
              name: "owner",
              isMut: true,
              isSigner: true,
              docs: ["Owner of the StakeDepositReceipt"],
            },
            {
              name: "stakePool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "stakeDepositReceipt",
              isMut: true,
              isSigner: false,
              docs: [
                "StakeDepositReceipt of the owner that will be used to claim respective rewards",
              ],
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
          ],
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
          docs: ["Vault of the StakePool token will be transferred from"],
        },
        {
          name: "stakeMint",
          isMut: true,
          isSigner: false,
          docs: ["stake_mint of StakePool that will be burned"],
        },
        {
          name: "from",
          isMut: true,
          isSigner: false,
          docs: [
            "Token Account holding weighted stake representation token to burn",
          ],
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
          docs: ["Token account to transfer the previously staked token to"],
        },
        {
          name: "walletAdminCommission",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "withdrawProfits",
      accounts: [
        {
          name: "claimBase",
          accounts: [
            {
              name: "owner",
              isMut: true,
              isSigner: true,
              docs: ["Owner of the StakeDepositReceipt"],
            },
            {
              name: "stakePool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "stakeDepositReceipt",
              isMut: true,
              isSigner: false,
              docs: [
                "StakeDepositReceipt of the owner that will be used to claim respective rewards",
              ],
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
          ],
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
          docs: ["Vault of the StakePool token will be transferred from"],
        },
        {
          name: "stakeMint",
          isMut: true,
          isSigner: false,
          docs: ["stake_mint of StakePool that will be burned"],
        },
        {
          name: "from",
          isMut: true,
          isSigner: false,
          docs: [
            "Token Account holding weighted stake representation token to burn",
          ],
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
          docs: ["Token account to transfer the previously staked token to"],
        },
        {
          name: "walletAdminCommission",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "transferToAdmin",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
          docs: ["Authority of the StakePool"],
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
          docs: ["Vault of the StakePool token will be transferred from"],
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
          docs: ["Token account to transfer the previously staked token to"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "transferAuthority",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
          docs: ["Current authority of the StakePool"],
        },
        {
          name: "newAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
          docs: ["StakePool that will have it's authority updated"],
        },
      ],
      args: [],
    },
    {
      name: "lockPool",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
          docs: ["Current authority of the StakePool"],
        },
        {
          name: "newAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
          docs: ["StakePool that will have it's authority updated"],
        },
      ],
      args: [
        {
          name: "status",
          type: "u64",
        },
      ],
    },
    {
      name: "setVault",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
          docs: ["Payer of rent"],
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
          docs: ["Current authority of the StakePool"],
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
          docs: ["StakePool that will have it's authority updated"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
          docs: [
            "SPL Token Mint of the underlying token to be deposited for staking",
          ],
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
          docs: ["An SPL token Account for staging A tokens"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "updatePercentComission",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
          docs: ["Current authority of the StakePool"],
        },
        {
          name: "stakePool",
          isMut: true,
          isSigner: false,
          docs: ["StakePool that will have it's authority updated"],
        },
      ],
      args: [
        {
          name: "percentCommission",
          type: "f64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "stakePool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            docs: [
              "The original creator of the StakePool. Necessary for signer seeds",
            ],
            type: "publicKey",
          },
          {
            name: "authority",
            docs: ["Pubkey that can make updates to StakePool"],
            type: "publicKey",
          },
          {
            name: "totalWeightedStake",
            docs: [
              "Total amount staked that accounts for the lock up period weighting.\n    Note, this is not equal to the amount of SPL Tokens staked.",
            ],
            type: "u64",
          },
          {
            name: "vault",
            docs: ["Token Account to store the staked SPL Token"],
            type: "publicKey",
          },
          {
            name: "mint",
            docs: ["Mint of the token being staked"],
            type: "publicKey",
          },
          {
            name: "stakeMint",
            docs: ["Mint of the token representing effective stake"],
            type: "publicKey",
          },
          {
            name: "nonce",
            docs: ["Nonce to derive multiple stake pools from same mint"],
            type: "u8",
          },
          {
            name: "bumpSeed",
            docs: ["Bump seed for stake_mint"],
            type: "u8",
          },
          {
            name: "padding0",
            type: {
              array: ["u8", 6],
            },
          },
          {
            name: "reserved0",
            type: {
              array: ["u8", 256],
            },
          },
          {
            name: "blockTime",
            type: "u64",
          },
          {
            name: "percentTokenOnBlockTime",
            type: "f64",
          },
          {
            name: "blockTimeWithdrawOrigin",
            type: "u64",
          },
          {
            name: "rangeWithdrawProfit",
            type: "i64",
          },
          {
            name: "percentCommission",
            type: "f64",
          },
          {
            name: "walletReceiveCommission",
            type: "publicKey",
          },
          {
            name: "globalState",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "stakeDepositReceipt",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            docs: ["Pubkey that owns the staked assets"],
            type: "publicKey",
          },
          {
            name: "payer",
            docs: ["Pubkey that paid for the deposit"],
            type: "publicKey",
          },
          {
            name: "stakePool",
            docs: ["StakePool the deposit is for"],
            type: "publicKey",
          },
          {
            name: "lockupDuration",
            docs: ["Duration of the lockup period in seconds"],
            type: "u64",
          },
          {
            name: "depositTimestamp",
            docs: ["Timestamp in seconds of when the stake lockup began"],
            type: "i64",
          },
          {
            name: "depositAmount",
            docs: ["Amount of SPL token deposited"],
            type: "u64",
          },
          {
            name: "effectiveStake",
            docs: ["Amount of stake weighted by lockup duration."],
            type: "u64",
          },
          {
            name: "lastTimeUpdate",
            type: "i64",
          },
          {
            name: "percentCurrent",
            type: "f64",
          },
          {
            name: "amountClaimed",
            type: "u64",
          },
          {
            name: "nonAmountClaimed",
            type: "u64",
          },
          {
            name: "amountClaimedAdmin",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAuthority",
      msg: "Invalid StakePool authority",
    },
    {
      code: 6001,
      name: "RewardPoolIndexOccupied",
      msg: "RewardPool index is already occupied",
    },
    {
      code: 6002,
      name: "InvalidStakePoolVault",
      msg: "StakePool vault is invalid",
    },
    {
      code: 6003,
      name: "InvalidStakePoolAdminCommission",
      msg: "Stake admin commission is invalid",
    },
    {
      code: 6004,
      name: "InvalidRewardPoolVault",
      msg: "RewardPool vault is invalid",
    },
    {
      code: 6005,
      name: "InvalidRewardPoolVaultIndex",
      msg: "Invalid RewardPool vault remaining account index",
    },
    {
      code: 6006,
      name: "InvalidOwner",
      msg: "Invalid StakeDepositReceiptOwner",
    },
    {
      code: 6007,
      name: "InvalidStakePool",
      msg: "Invalid StakePool",
    },
    {
      code: 6008,
      name: "PrecisionMath",
      msg: "Math precision error",
    },
    {
      code: 6009,
      name: "InvalidStakeMint",
      msg: "Invalid stake mint",
    },
    {
      code: 6010,
      name: "StakeStillLocked",
      msg: "Stake is still locked",
    },
    {
      code: 6011,
      name: "InvalidStakePoolDuration",
      msg: "Max duration must be great than min",
    },
    {
      code: 6012,
      name: "InvalidStakePoolWeight",
      msg: "Max weight must be great than min",
    },
    {
      code: 6013,
      name: "DurationTooShort",
      msg: "Duration too short",
    },
    {
      code: 6014,
      name: "Unauthorized",
      msg: "The caller is not authorized to perform this action.",
    },
    {
      code: 6015,
      name: "ResourceLocked",
      msg: "The resource is currently locked.",
    },
    {
      code: 6016,
      name: "TimeCalculationError",
      msg: "The resource is TimeCalculationError.",
    },
    {
      code: 6017,
      name: "CalculationOverflow",
      msg: "The resource is CalculationOverflow.",
    },
    {
      code: 6018,
      name: "BlockTimeWithdrawOrigin",
      msg: "Block Time Withraw Origin.",
    },
    {
      code: 6019,
      name: "WalletAdminError",
      msg: "Wallet Address Is Not Authorize.",
    },
    {
      code: 6020,
      name: "InvalidOwnerSign",
      msg: "The given owner is not part of this multisig.",
    },
    {
      code: 6021,
      name: "InvalidOwnersLen",
      msg: "Owners length must be non zero.",
    },
    {
      code: 6022,
      name: "NotEnoughSigners",
      msg: "Not enough owners signed this transaction.",
    },
    {
      code: 6023,
      name: "TransactionAlreadySigned",
      msg: "Cannot delete a transaction that has been signed by an owner.",
    },
    {
      code: 6024,
      name: "Overflow",
      msg: "Overflow when adding.",
    },
    {
      code: 6025,
      name: "UnableToDelete",
      msg: "Cannot delete a transaction the owner did not create.",
    },
    {
      code: 6026,
      name: "AlreadyExecuted",
      msg: "The given transaction has already been executed.",
    },
    {
      code: 6027,
      name: "InvalidThreshold",
      msg: "Threshold must be less than or equal to the number of owners.",
    },
    {
      code: 6028,
      name: "UniqueOwners",
      msg: "Owners must be unique",
    },
  ],
};
