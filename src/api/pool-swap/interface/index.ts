export interface IInitPoolSwap{
    userCreated:string,
    tokenAMint: string,
    tokenBMint: string,
    amountA: number,
    amountB: number,
    curveType: number,
    networkType: string,
    ownerFeeAddress: string

}

export interface  IFeeCreatePoolSwap{
    walletConnect:string,
    networkType:string
}