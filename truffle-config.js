const HTTPProviderRateLimitRetry = require("./lib/http-provider-rate-limit-retry");
const fs = require("fs");
require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const pp = [process.env.PICARDP];
const connectionURL = process.env.KALE_URI;
module.exports = {
  contracts_build_directory: "./client/src/contracts",
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    pKale: {
      provider: () => {
        return new HDWalletProvider(
          pp,
          `https://${process.env.PICARD}@${connectionURL}`
        );
      },
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000
      /* type: 'quorum' // Use this property for Quorum environments */
    },
    gKale: {
      provider: () => {
        return new HTTPProviderRateLimitRetry(
          `https://${process.env.GEORDI}@${connectionURL}`,
          100000
        );
      },
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000
      /* type: 'quorum' // Use this property for Quorum environments */
    },
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545
    }
  },

  mocha: {
    enableTimeouts: false,
    before_timeout: 600000
  },
  compilers: {
    solc: {
      version: "0.5.8",
      settings: {
        evmVersion: "byzantium"
      }
    }
  }
};
