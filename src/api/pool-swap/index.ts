import axiosInterceptorInstanceFaas from "config/axiosFaas";
import { IFeeCreatePoolSwap, IInitPoolSwap } from "./interface";


class PoolSwaping {

   async initPoolSwap(data:IInitPoolSwap){
        const result = await axiosInterceptorInstanceFaas({
            method:"POST",
            url:"/solana-create-lp-pool",
            data,
        })
        return result;
    }

    async getFeeCreatePoolSwap(data: IFeeCreatePoolSwap){
        const result = await axiosInterceptorInstanceFaas({
            method:"POST",
            url:"https://sol-est-fee-create-lp.default.teknix.dev",
            data,
        })
        return result;
    }

}

export const apiPoolSwaping =  new PoolSwaping();