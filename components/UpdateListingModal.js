import { Modal, Input } from "web3uikit"

export default function UpdateListingModal({ nftAddress, tokenId, isVisible }) {
    return (
        <Modal isVisible={isVisible}>
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
            />
        </Modal>
    )
}
