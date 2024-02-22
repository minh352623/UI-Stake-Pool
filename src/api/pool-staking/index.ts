import axiosInterceptorInstance from "config/axios";
import { IInfoPoolStake, IUpdateInfoPoolStake } from "./Interface";


class PoolStaking {

   async saveInfoPoolStaking(data:IInfoPoolStake){
        const result = await axiosInterceptorInstance({
            method:"POST",
            url:"/liquidity-pool/save-data",
            data,
        })
        return result;
    }

    async updateInfoPoolStaking(data: IUpdateInfoPoolStake){
        const result = await axiosInterceptorInstance({
            method:"PATCH",
            url:"/liquidity-pool/stake-info",
            data,
        })
        return result;
    }

    async getAllPoolStakingByAuthority(authority?:string){
        //?authority=${authority}
        const result = await axiosInterceptorInstance({
            method:"GET",
            url:`/liquidity-pool/stake-info`,
        })
        return result;
    }

    async getOnePoolStakingByAuthority(authority:string,poolKey:string, ){
        const result = await axiosInterceptorInstance({
            method:"GET",
            url:`/liquidity-pool/stake-info?poolKey=${poolKey}&authority=${authority}`,
        })
        return result;
    }
}

export const apiPoolStaking =  new PoolStaking();