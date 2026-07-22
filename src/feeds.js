const dotenv = require('dotenv');
const path = require('path');

// Navigating 1 directory up from the current folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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