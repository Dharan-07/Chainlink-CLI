require("dotenv").config();

module.exports = {
    BNB: {
        name: "BNB/USD",
        address: process.env.BSC_FEED_ADDRESS,
    },

    USDT: {
        name: "USDT/USD",
        address: process.env.USDT_FEED_ADDRESS,
    },
};