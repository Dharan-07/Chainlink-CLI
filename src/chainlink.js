const { ethers } = require("ethers");
const dotenv = require('dotenv');
const path = require('path');

// Navigating 1 directory up from the current folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const abi = [
    "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    "function decimals() view returns (uint8)",
    "function aggregator() external view returns (address)"
];

const provider = new ethers.JsonRpcProvider(
    process.env.BSC_TESTNET_RPC
);

async function getFeedData(selectedFeed) {
    const contract = new ethers.Contract(
        selectedFeed.address,
        abi,
        provider
    );

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

module.exports = {
    getFeedData,
};