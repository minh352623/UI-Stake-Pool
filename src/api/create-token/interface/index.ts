export interface ISaveContract {
    name_token: string,
    symbol_token: string,
    address_receive: string,
    project_network: string,
    amount_token: string,
    image: string,
    decimals: string,
    description: string,
    project_id: string
}


export interface ICreateToken {
    tokenName: string,
    tokenSymbol: string,
    tokenDescription: string,
    network: string,
    totalSupply: string,
    supplyOwner: string,
    image: string,
    description: string,
    decimal: string,
    userCreated: string,
    status: string,
    idContract: number,
    networkType: string,
}