export type AnchorLiquidityPool = {
    "version": "0.1.0",
    "name": "anchor_liquidity_pool",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForInitializer",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForFeeReceiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          }
        ]
      },
      {
        "name": "depositAll",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenAAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenBAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "depositSingle",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "sourceTokenAmount",
            "type": "u64"
          },
          {
            "name": "minimumPoolTokenAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawAll",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolTokenAmount",
            "type": "u64"
          },
          {
            "name": "minimumTokenAAmount",
            "type": "u64"
          },
          {
            "name": "minimumTokenBAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawSingle",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "destinationTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumPoolTokenAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "swap",
        "accounts": [
          {
            "name": "swapper",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForSwapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForSwapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "hostFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minimumAmountOut",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "swapPair",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tokenAAccount",
              "type": "publicKey"
            },
            {
              "name": "tokenBAccount",
              "type": "publicKey"
            },
            {
              "name": "poolMint",
              "type": "publicKey"
            },
            {
              "name": "tokenAMint",
              "type": "publicKey"
            },
            {
              "name": "tokenBMint",
              "type": "publicKey"
            },
            {
              "name": "poolFeeAccount",
              "type": "publicKey"
            },
            {
              "name": "fees",
              "type": {
                "defined": "Fees"
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Fees",
        "docs": [
          "Encapsulates all fee information and calculations for swap operations"
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tradeFeeNumerator",
              "docs": [
                "Trade fees are extra token amounts that are held inside the token",
                "accounts during a trade, making the value of liquidity tokens rise.",
                "Trade fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "tradeFeeDenominator",
              "docs": [
                "Trade fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerTradeFeeNumerator",
              "docs": [
                "Owner trading fees are extra token amounts that are held inside the token",
                "accounts during a trade, with the equivalent in pool tokens minted to",
                "the owner of the program.",
                "Owner trade fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerTradeFeeDenominator",
              "docs": [
                "Owner trade fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerWithdrawFeeNumerator",
              "docs": [
                "Owner withdraw fees are extra liquidity pool token amounts that are",
                "sent to the owner on every withdrawal.",
                "Owner withdraw fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerWithdrawFeeDenominator",
              "docs": [
                "Owner withdraw fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "hostFeeNumerator",
              "docs": [
                "Host fees are a proportion of the owner trading fees, sent to an",
                "extra account provided during the trade.",
                "Host trading fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "hostFeeDenominator",
              "docs": [
                "Host trading fee denominator"
              ],
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "TradeDirection",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "AtoB"
            },
            {
              "name": "BtoA"
            }
          ]
        }
      },
      {
        "name": "RoundDirection",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Ceiling"
            },
            {
              "name": "Floor"
            }
          ]
        }
      },
      {
        "name": "Error",
        "docs": [
          "Errors that may be returned by the TokenSwap program."
        ],
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "AlreadyInUse"
            },
            {
              "name": "InvalidProgramAddress"
            },
            {
              "name": "InvalidOwner"
            },
            {
              "name": "InvalidOutputOwner"
            },
            {
              "name": "ExpectedMint"
            },
            {
              "name": "ExpectedAccount"
            },
            {
              "name": "EmptySupply"
            },
            {
              "name": "InvalidSupply"
            },
            {
              "name": "InvalidDelegate"
            },
            {
              "name": "InvalidInput"
            },
            {
              "name": "IncorrectSwapAccount"
            },
            {
              "name": "IncorrectPoolMint"
            },
            {
              "name": "InvalidOutput"
            },
            {
              "name": "CalculationFailure"
            },
            {
              "name": "InvalidInstruction"
            },
            {
              "name": "RepeatedMint"
            },
            {
              "name": "ExceededSlippage"
            },
            {
              "name": "InvalidCloseAuthority"
            },
            {
              "name": "InvalidFreezeAuthority"
            },
            {
              "name": "IncorrectFeeAccount"
            },
            {
              "name": "ZeroTradingTokens"
            },
            {
              "name": "FeeCalculationFailure"
            },
            {
              "name": "ConversionFailure"
            },
            {
              "name": "InvalidFee"
            },
            {
              "name": "IncorrectTokenProgramId"
            },
            {
              "name": "UnsupportedCurveType"
            },
            {
              "name": "InvalidCurve"
            },
            {
              "name": "UnsupportedCurveOperation"
            }
          ]
        }
      }
    ]
  };
  
  export const IDL: AnchorLiquidityPool = {
    "version": "0.1.0",
    "name": "anchor_liquidity_pool",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForInitializer",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForFeeReceiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          }
        ]
      },
      {
        "name": "depositAll",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenAAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenBAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "depositSingle",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "sourceTokenAmount",
            "type": "u64"
          },
          {
            "name": "minimumPoolTokenAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawAll",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolTokenAmount",
            "type": "u64"
          },
          {
            "name": "minimumTokenAAmount",
            "type": "u64"
          },
          {
            "name": "minimumTokenBAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawSingle",
        "accounts": [
          {
            "name": "depositor",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPoolForDepositor",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenAForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "destinationTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumPoolTokenAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "swap",
        "accounts": [
          {
            "name": "swapper",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "pda",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pair",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForSwapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForSwapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenSourceForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenDestinationForPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "hostFeeAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minimumAmountOut",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "swapPair",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tokenAAccount",
              "type": "publicKey"
            },
            {
              "name": "tokenBAccount",
              "type": "publicKey"
            },
            {
              "name": "poolMint",
              "type": "publicKey"
            },
            {
              "name": "tokenAMint",
              "type": "publicKey"
            },
            {
              "name": "tokenBMint",
              "type": "publicKey"
            },
            {
              "name": "poolFeeAccount",
              "type": "publicKey"
            },
            {
              "name": "fees",
              "type": {
                "defined": "Fees"
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Fees",
        "docs": [
          "Encapsulates all fee information and calculations for swap operations"
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tradeFeeNumerator",
              "docs": [
                "Trade fees are extra token amounts that are held inside the token",
                "accounts during a trade, making the value of liquidity tokens rise.",
                "Trade fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "tradeFeeDenominator",
              "docs": [
                "Trade fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerTradeFeeNumerator",
              "docs": [
                "Owner trading fees are extra token amounts that are held inside the token",
                "accounts during a trade, with the equivalent in pool tokens minted to",
                "the owner of the program.",
                "Owner trade fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerTradeFeeDenominator",
              "docs": [
                "Owner trade fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerWithdrawFeeNumerator",
              "docs": [
                "Owner withdraw fees are extra liquidity pool token amounts that are",
                "sent to the owner on every withdrawal.",
                "Owner withdraw fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "ownerWithdrawFeeDenominator",
              "docs": [
                "Owner withdraw fee denominator"
              ],
              "type": "u64"
            },
            {
              "name": "hostFeeNumerator",
              "docs": [
                "Host fees are a proportion of the owner trading fees, sent to an",
                "extra account provided during the trade.",
                "Host trading fee numerator"
              ],
              "type": "u64"
            },
            {
              "name": "hostFeeDenominator",
              "docs": [
                "Host trading fee denominator"
              ],
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "TradeDirection",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "AtoB"
            },
            {
              "name": "BtoA"
            }
          ]
        }
      },
      {
        "name": "RoundDirection",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Ceiling"
            },
            {
              "name": "Floor"
            }
          ]
        }
      },
      {
        "name": "Error",
        "docs": [
          "Errors that may be returned by the TokenSwap program."
        ],
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "AlreadyInUse"
            },
            {
              "name": "InvalidProgramAddress"
            },
            {
              "name": "InvalidOwner"
            },
            {
              "name": "InvalidOutputOwner"
            },
            {
              "name": "ExpectedMint"
            },
            {
              "name": "ExpectedAccount"
            },
            {
              "name": "EmptySupply"
            },
            {
              "name": "InvalidSupply"
            },
            {
              "name": "InvalidDelegate"
            },
            {
              "name": "InvalidInput"
            },
            {
              "name": "IncorrectSwapAccount"
            },
            {
              "name": "IncorrectPoolMint"
            },
            {
              "name": "InvalidOutput"
            },
            {
              "name": "CalculationFailure"
            },
            {
              "name": "InvalidInstruction"
            },
            {
              "name": "RepeatedMint"
            },
            {
              "name": "ExceededSlippage"
            },
            {
              "name": "InvalidCloseAuthority"
            },
            {
              "name": "InvalidFreezeAuthority"
            },
            {
              "name": "IncorrectFeeAccount"
            },
            {
              "name": "ZeroTradingTokens"
            },
            {
              "name": "FeeCalculationFailure"
            },
            {
              "name": "ConversionFailure"
            },
            {
              "name": "InvalidFee"
            },
            {
              "name": "IncorrectTokenProgramId"
            },
            {
              "name": "UnsupportedCurveType"
            },
            {
              "name": "InvalidCurve"
            },
            {
              "name": "UnsupportedCurveOperation"
            }
          ]
        }
      }
    ]
  };
  