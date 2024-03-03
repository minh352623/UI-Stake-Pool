import axiosInterceptorInstance from "config/axios";
import { ICreateToken, ISaveContract } from "./interface";

export class CreateToken {

    private BASE_URL = "https://sale-token.teknix.dev/items";
    private BASE_URL_2 = "http://localhost:3001";


    async getAllNetwork(){
        return axiosInterceptorInstance({
            method:"GET",
            url:`${this.BASE_URL}/network`
        })
    }

    async saveNewContract(data: ISaveContract ){
        const  {project_id, ...dataCreate} =data
        const contract = await axiosInterceptorInstance({
            method:"POST",
            url:`${this.BASE_URL}/contract`,
            data: dataCreate
        });
         await axiosInterceptorInstance({
            method:"POST",
            url:`${this.BASE_URL}/project_contract`,
            data:{
                project_id: data.project_id,
                contract_id: contract?.data.data.id,
            }
        });
        return contract;
    }

    async createToken(data: ICreateToken){
        const token = await axiosInterceptorInstance({
            method:"POST",
            url:`https://sol-build-token.default.teknix.dev`,
            data
        });
        return token;
    }

}

export const apiCreateToken  = new CreateToken()