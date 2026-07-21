const { ethers } = require("ethers");
require("dotenv").config();

const feeds = require("./feed")

async function main() {
    const abi = [
        "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
        "function decimals() view returns (uint8)"
    ];

    const provider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_RPC);

    /* 
       process.argv[0] ==> it points to the node path
       process.argv[1] ==> it point to the script path or file path
       process.argv[2] ==> first argument
       process.argv[3] ==> second argument
    
    */
    const symbol = process.argv[2]?.toUpperCase(); // used to get the argument from the user 
    const selectedFeed = feeds[symbol]; // change BNB or USDT here

    if (!selectedFeed) {
        console.log("\n");
        console.log("Unknown feed.");
        console.log("\nAvailable feeds:");

        Object.keys(feeds).forEach(feed => {
            console.log("-", feed);
        });

        return;
    }
    const feed = new ethers.Contract(
        selectedFeed.address,
        abi,
        provider
    )

    const decimals = await feed.decimals();

    const {
        roundId,
        answer,
        startedAt,
        updatedAt,
        answeredInRound
    } = await feed.latestRoundData();

    // const feedName =
    //     feedAddress === process.env.BSC_FEED_ADDRESS
    //         ? "BNB/USD"
    //         : "USDT/USD";
    console.log("\n");
    console.log(`========== Chainlink ${selectedFeed.name} ==========`);
    console.log("Round ID          :", roundId.toString());
    console.log("Price             :", ethers.formatUnits(answer, decimals), "USD");
    console.log("Started At        :", new Date(Number(startedAt) * 1000).toLocaleString());
    console.log("Updated At        :", new Date(Number(updatedAt) * 1000).toLocaleString());
    console.log("Answered In Round :", answeredInRound.toString());
    console.log("\n");

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});