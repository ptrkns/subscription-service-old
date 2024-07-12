import { ethers } from 'ethers';
import contractABI from '../assets/abi.json';

const SubscriptionContract = () => {

    const contractAddress = "0x961448236955569b932738450Efb057c8a0E65bA";
                                
    async function getContract(agent) {
        switch(agent){
            case "provider": {
                if (typeof window.ethereum !== 'undefined') {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const contract = new ethers.Contract(contractAddress, contractABI, provider);
                    return contract;
                }
            }
            case "signer": {
                if (typeof window.ethereum !== 'undefined') {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    return contract;
                }
            }
            default: { return; }
        }
    };

    return { getContract };
};

export default SubscriptionContract;