import { useState } from "react"
import { Modal, Input } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal isVisible={isVisible}>
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
                onChange={(e) => setPriceToUpdateListingWith(e.target.value)}
                onOk={() => updateListing()}
            />
        </Modal>
    )
}
