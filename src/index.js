const { ethers } = require("ethers");
const { getFeedData,getHistory } = require("./chainlink");


const feeds = require("./feeds")

async function main() {
    /* 
       process.argv[0] ==> it points to the node path
       process.argv[1] ==> it point to the script path or file path
       process.argv[2] ==> first argument
       process.argv[3] ==> second argument
    
    */

    const command = process.argv[2]?.toLowerCase();

    const symbol = process.argv[3]?.toUpperCase(); // used to get the argument from the user 
    const count = parseInt(process.argv[4], 10) || 5; 

    switch (command) {
        case "list":
            console.log("\n");
            console.log("List of Feeds :\n")
            Object.keys(feeds).forEach(feed => {
                console.log("-", feed);
            });
            console.log("\n");
            break;

        case "price":

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

            const data = await getFeedData(selectedFeed);

            // const feedName =
            //     feedAddress === process.env.BSC_FEED_ADDRESS
            //         ? "BNB/USD"
            //         : "USDT/USD";

            console.log(`\n========== ${data.name} ==========\n`);
            console.log("Price             :", data.price, "USD");
            console.log(`\n==============================\n`);
            break;

        case "get":
            const getSelectedFeed = feeds[symbol]; // change BNB or USDT here

            if (!getSelectedFeed) {
                console.log("\n");
                console.log("Unknown feed.");
                console.log("\nAvailable feeds:");

                Object.keys(feeds).forEach(feed => {
                    console.log("-", feed);
                });

                return;
            }

            const getData = await getFeedData(getSelectedFeed);


            // const feedName =
            //     feedAddress === process.env.BSC_FEED_ADDRESS
            //         ? "BNB/USD"
            //         : "USDT/USD";

            console.log(`\n========== ${getData.name} ==========\n`);

            console.log("Round ID           :", getData.roundId);
            console.log("Price              :", getData.price, "USD");
            console.log("Started At         :", getData.startedAt);
            console.log("Updated At         :", getData.updatedAt);
            console.log("Answered In Round  :", getData.answeredInRound);
            console.log("Feed Address       :", getSelectedFeed.address);
            console.log("Decimals           :", getData.decimals.toString());
            console.log("Aggregator Address :", getData.aggregatorAddress)

            console.log(`\n==============================\n`);
            break;

        // 3. Added the "history" case
        case "history":
            const historyFeed = feeds[symbol];

            if (!historyFeed) {
                console.log("\n");
                console.log("Unknown feed.");
                console.log("\nAvailable feeds:");

                Object.keys(feeds).forEach(feed => {
                    console.log("-", feed);
                });

                return;
            }

            console.log(`\nFetching last ${count} rounds for ${symbol}... Please wait.`);
            const historyData = await getHistory(historyFeed, count);

            console.log(`\n========== ${symbol} History (Last ${historyData.length} rounds) ==========\n`);
            
            if (historyData.length === 0) {
                console.log("No historical data retrieved.");
            } else {
                historyData.forEach((round, index) => {
                    console.log(`[Round ${index + 1}]`);
                    console.log("  Round ID   :", round.roundId);
                    console.log("  Price      :", round.price, "USD");
                    console.log("  Updated At :", round.updatedAt);
                    console.log("-----------------------------------------");
                });
            }
            break;

        default:
            console.log("\n");
            console.log("Unknown command \n\n Usage : \n node index.js list \n node index.js price <symbol>\n node index.js get <symbol>");
    }


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});