const HTTPProviderRateLimitRetry = require("./lib/http-provider-rate-limit-retry");

module.exports = {
  contracts_build_directory: "./client/src/contracts",

  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545
    },
    kale: {
      provider: () => {
        const appCred = "yourappcred"; // from application credential widget
        const connectionURL = "nodeConnectionURL"; // without protocol (https://)
        return new HTTPProviderRateLimitRetry(
          `https://${appCred}@${connectionURL}`,
          100000
        );
      },
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000
      /* type: 'quorum' // Use this property for Quorum environments */
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
