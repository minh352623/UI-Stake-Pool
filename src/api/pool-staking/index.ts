import axiosInterceptorInstanceFaas from "config/axiosFaas";
import {  IInfoPoolStakeCreate, IUpdateInfoPoolStake } from "./Interface";


class PoolStaking {

   async saveInfoPoolStaking(data:IInfoPoolStakeCreate){
        const result = await axiosInterceptorInstanceFaas({
            method:"POST",
            url:"/stake-save-data",
            data,
        })
        return result;
    }

    async updateInfoPoolStaking(data: IUpdateInfoPoolStake){
        const result = await axiosInterceptorInstanceFaas({
            method:"PATCH",
            url:"/solana-stake-info",
            data,
        })
        return result;
    }

    async getAllPoolStakingByAuthority(authority?:string){
        //?authority=${authority}
        const result = await axiosInterceptorInstanceFaas({
            method:"GET",
            url:`/solana-stake-info`,
        })
        return result;
    }

    async getOnePoolStakingByAuthority(authority:string,poolKey:string, ){
        const result = await axiosInterceptorInstanceFaas({
            method:"GET",
            url:`/solana-stake-info?poolKey=${poolKey}&authority=${authority}`,
        })
        return result;
    }
}

export const apiPoolStaking =  new PoolStaking();