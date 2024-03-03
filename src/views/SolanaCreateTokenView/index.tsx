import Link from "next/link";
import { FC, Key, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";
import styles from "./index.module.css";

import { Loader, SelectAndConnectWalletButton, SolanaLogo } from "components";
import * as anchor from "@project-serum/anchor";
import { useRouter } from "next/router";
import { apiPoolSwaping } from "api/pool-swap";
import { IInitPoolSwap } from "api/pool-swap/interface";
import { Metaplex } from '@metaplex-foundation/js';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createTransferInstruction, getAssociatedTokenAddress, getAssociatedTokenAddressSync, getMint, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Client, Token, UtlConfig } from '@solflare-wallet/utl-sdk';
import Navbar from "components/Navbar";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { apiCreateToken } from "api/create-token";
import { ISaveContract } from "api/create-token/interface";



const steps = [
    'Create and deploy',
    'Verify',
    'Info Token',
];

const stepsSolana = [
    'Deploy and Verify',
    'Info Token',
];
const base_icon = "https://sale-token.teknix.dev/assets/"

const endpoint = "https://explorer-api.devnet.solana.com";


const connection = new anchor.web3.Connection(endpoint);


export const SolanaCreataTokenView: FC = ({ }) => {
    const wallet = useAnchorWallet();

    return (
        <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
            <div className={styles.container}>
                <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box justify-between">
                    <div className="flex gap-3">

                        <div className="flex-none">
                            <button className="btn btn-square btn-ghost">
                                <span className="text-4xl">🌔</span>
                            </button>
                        </div>
                        <div className="flex-1 px-2 mx-2">
                            <div className="text-sm breadcrumbs">
                                <ul className="text-xl">

                                    <li>
                                        <span className="opacity-40">minh352623</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Navbar></Navbar>


                    <div className="flex-none">
                        <WalletMultiButton className="btn btn-ghost" />
                    </div>
                </div>

                <div className="text-center pt-2">
                    <div className="hero min-h-16 pt-4">
                        <div className="text-center hero-content">
                            <div className="max-w-lg">
                                <h1 className="mb-5 text-5xl">
                                    SPL Token <SolanaLogo />
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="flex justify-center ">
                    {!wallet ? (
                        <SelectAndConnectWalletButton onUseWalletClick={() => { }} />
                    ) : (
                        <CreateTokenScreen />
                    )}
                </div>
            </div>
        </div>
    );
};
const CreateTokenScreen = () => {
    return (
        <div className="rounded-lg flex-1 flex justify-center">

            <div className="flex  flex-col items-center justify-center">
                <div className="text-xs">
                    <NetCreateToken />

                </div>

            </div>
        </div>
    );
};
const NetCreateToken: FC<any> = ({ }) => {
    const wallet: any = useAnchorWallet();
    const wallet2 = useWallet();
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenInfo, setTokenInfo] = useState<ISaveContract>({
        name_token: "",
        symbol_token: "",
        address_receive: "",
        project_network: "",
        amount_token: "",
        image: "https://res.cloudinary.com/dnfe9k4jv/image/upload/v1694316657/dgxf7tbnctlktz6coyzp.jpg",
        decimals: "",
        description: "",
        project_id: ""
    })
    const [icon, setIcon] = useState<string>("")
    const [currentStep, setCurrentStep] = useState<number>(0)

    const [networks, setNetworks] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([{
        id: 4,
        name_project: "Test"
    }])

    const [networkSelect, setNetwork] = useState<any>(null)
    const [projectSelect, setProject] = useState<any>({
        id: 4,
        name_project: "Test"
    })

    const changeIcon = (e: any) => {
        const { files } = e.target;
        console.log("🚀 ~ changeIcon ~ files:", files);
        let url = "";
        if (files.length > 0) {
            url = URL.createObjectURL(files[0]);
        }
        return url;
    }

    const setValueToTokenInfo = (inputName: string, value: any) => {
        setTokenInfo((poolInfo: any) => {
            return {
                ...poolInfo,
                [inputName]: value
            }
        })
    }

    const fetchNetworks = async () => {
        try {
            const result = await apiCreateToken.getAllNetwork();
            console.log("🚀 ~ fetchNetworks ~ result:", result)
            setNetworks(result?.data?.data);
        } catch (err) {
            console.log("🚀 ~ fetchNetworks ~ err:", err)
        }
    }
    const selectNetWork = (network: any) => {
        setNetwork(network)
    }
    const selectProject = (project: any) => {
        setProject(project)
    }

    const initSPLTokenSolana = async (tokenInfo: ISaveContract) => {
        try {
            const  data = {
                ...tokenInfo,
                project_network: networkSelect.id,
                project_id: projectSelect.id,
            }
            console.log("🚀 ~ initSPLTokenSolana ~ data:", data)
            const contract = await apiCreateToken.saveNewContract({
                ...data
            })
            const token = await apiCreateToken.createToken({
                tokenName: data.name_token,
                tokenSymbol:data.symbol_token,
                decimal:data.decimals,
                description: data.description,
                image: data.image,
                idContract: contract.data.id,
                network: networkSelect.slug,
                networkType: networkSelect.slug == "sol" ?"devnet" : "testnet",
                status: "DEPLOY",
                supplyOwner:data.address_receive,
                tokenDescription:data.description,
                totalSupply:data.amount_token,
                userCreated: "c213e294-72bf-4a3a-ba1c-8fddf924eb4a"

            })
            console.log("🚀 ~ initSPLTokenSolana ~ token:", token)
        } catch (err) {
            console.log("🚀 ~ initSPLTokenSolana ~ err:", err)
        }
    }

    useEffect(() => {
        fetchNetworks()
    }, [])
    return (
        <div style={{ minWidth: 240 }} className="mb-8 w-[600px]  flex  flex-col gap-5">
            <div className="w-full border-b border-gray-500 pb-4 ">
                <p>
                    <span className="text-2xl mb-6 block">Network</span>

                </p>
                <div className="flex gap-5 flex-wrap mb-3" >
                    {networks.length > 0 && networks.map((network, index) => {

                        return <div key={index} onClick={() => selectNetWork(network)} className=" relative flex gap-3 items-center rounded-lg bg-purple-600 px-3  py-2 cursor-pointer hover:scale-110 transition-all">
                            {networkSelect?.id == (network.id) &&

                                <div className="p-1 absolute bg-yellow-400 top-[-8px] right-0 text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>

                                </div>
                            }
                            <img src={network?.icon ? base_icon + network?.icon : "question.webp"} className="w-[30px] h-[30px] rounded-full" alt="" />
                            <div className="flex flex-col gap-1 ">
                                <span className="font-bold">{network?.network_name ? network.network_name : "Unrecognized Network"}</span>
                            </div>
                        </div>

                    })}

                </div>
                <p>
                    <span className="text-2xl mb-6 block">Project</span>

                </p>

                <div className="flex gap-5 flex-wrap mb-3" >
                    {projects.length > 0 && projects.map((project, index) => {

                        return <div key={index} onClick={() => selectProject(project)} className=" relative flex gap-3 items-center rounded-lg bg-purple-600 px-6  py-3 cursor-pointer hover:scale-110 transition-all">
                            {projectSelect?.id == (project.id) &&
                                <div className="p-1 absolute bg-yellow-400 top-[-12px] right-0 text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                            }

                            <div className="flex flex-col gap-1 ">
                                <span className="font-bold">{project?.name_project ? project.name_project : "Unrecognized Network"}</span>
                            </div>
                        </div>

                    })}

                </div>
                <div className="my-8   bg-white p-2 rounded-lg ">

                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={currentStep} alternativeLabel>
                            {networkSelect?.slug == "sol" ? stepsSolana.map((label) => (
                                <Step key={label}>
                                    <StepLabel  >{label}</StepLabel>
                                </Step>
                            )) : steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel  >{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </div>
                <div className="flex gap-3 my-8">
                    <span>Token Icon</span>


                    <div className="flex gap-3 flex-1">
                        <input type="file" onChange={(e)=>{
                            const url = changeIcon(e);
                            setIcon(url);
                        }} className="w-[90%]" />
                        <img src={icon ? icon : "./question.webp"} alt=""  className="w-[10%] rounded-full h-[50px]" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1 w-[50%]">
                        <span>Token Name</span>
                        <input name="name_token" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "name_token"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Token Name" className="mb-4 "></input>
                    </div>
                    <div className="flex flex-col gap-2 flex-1 w-[50%]">
                        <span>Supply</span>
                        <input name="amount_token" type="number" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "amount_token"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Supply" className="mb-4 "></input>
                    </div>

                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Token Symbol</span>
                        <input name="symbol_token" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "symbol_token"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Token Symbol" className="mb-4"></input>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <span>Address Receive</span>
                        <input name="address_receive" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "address_receive"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Address Receive" className="mb-4"></input>
                    </div>


                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1 flex-1">
                        <span>Decimals</span>


                        <input name="decimals" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "decimals"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Decimals" className="mb-4 flex-1"></input>
                    </div>
                    <div className="flex flex-col gap-2 flex-1 flex-1">
                        <span>Description</span>


                        <input name="description" onChange={(e) => {
                            const value = e.target.value;
                            const nameKey = "description"
                            setValueToTokenInfo(nameKey, value)
                        }
                        } placeholder="Description" className="mb-4 flex-1"></input>
                    </div>
                </div>


                {loading ?
                    <Loader></Loader>
                    : <button
                        className="btn btn-primary rounded-full normal-case	w-full"
                        onClick={() => initSPLTokenSolana(tokenInfo)}
                        style={{ minHeight: 0, height: 40 }}
                    >
                        Create Token
                    </button>
                }





            </div>
        </div>
    );
};