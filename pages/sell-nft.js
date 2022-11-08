import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis"

export default function Home() {
    const dispatch = useNotification()
    const { chainId } = useMoralis
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: handleApproveSuccess(nftAddress, tokenId, price),
            onError: (e) => console.log(e),
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Time to list an item!")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess(),
            onError: (e) => console.log(e),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listed!",
            title: "NFT Listed",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                // When we click Submit, the data object will be passed to onSubmit
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
            Hi from sell!
        </div>
    )
}
