const { ethers } = require("ethers");
const { getFeedData } = require("./chainlink");


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

    switch (command) {
        case "list":
            console.log("\n");
            Object.keys(feeds).forEach(feed => {
                console.log("-", feed);
            });
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

            console.log("Round ID          :", data.roundId);
            console.log("Price             :", data.price, "USD");
            console.log("Started At        :", data.startedAt);
            console.log("Updated At        :", data.updatedAt);
            console.log("Answered In Round :", data.answeredInRound);

            console.log(`\n==============================\n`);
            break;

        default:
            console.log("\n");
            console.log("Unknown command");
    }


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});