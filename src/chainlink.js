const { ethers } = require("ethers");
const dotenv = require('dotenv');
const path = require('path');

// Navigating 1 directory up from the current folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const abi = [
    "function getRoundData(uint80 _roundId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    "function decimals() view returns (uint8)",
    "function aggregator() external view returns (address)"
];

const provider = new ethers.JsonRpcProvider(
    process.env.BSC_TESTNET_RPC
);

function getContract(address) {
    return new ethers.Contract(address, abi, provider);
}

async function getFeedData(selectedFeed) {
    const contract = getContract(selectedFeed.address); // Reusable instance


    const [decimals, latestData, aggregator] = await Promise.all([
        contract.decimals(),
        contract.latestRoundData(),
        contract.aggregator()
    ]);

    const {
        roundId,
        answer,
        startedAt,
        updatedAt,
        answeredInRound,
    } = latestData;

    return {
        name: selectedFeed.name,
        roundId: roundId.toString(),
        price: ethers.formatUnits(answer, decimals),
        decimals,
        startedAt: new Date(Number(startedAt) * 1000).toLocaleString(),
        updatedAt: new Date(Number(updatedAt) * 1000).toLocaleString(),
        answeredInRound: answeredInRound.toString(),
        aggregatorAddress: aggregator.toString(),
    };
}

async function getHistory(selectedFeed,count){
    const contract = getContract(selectedFeed.address); // Reusable instance

    // 1. Get the latest round ID from the first function
    const currentData = await getFeedData(selectedFeed);
    let currentRoundId = BigInt(currentData.roundId); 
    const decimals = currentData.decimals;

    const history = [];

    for(let i = 0; i < count; i++){
        try{
            const targetRoundId = currentRoundId - BigInt(i);
            const roundData = await contract.getRoundData(targetRoundId);

             history.push({
                roundId: roundData.roundId.toString(),
                price: ethers.formatUnits(roundData.answer, decimals),
                updatedAt: new Date(Number(roundData.updatedAt) * 1000).toLocaleString(),
            });

        }catch(err){
            console.log(err);
            break;
        }
    }

    return history;
}

module.exports = {
    getFeedData,
    getHistory
};