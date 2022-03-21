import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-abi-exporter';

import { task } from 'hardhat/config'

const AVALANCHE_C_CHAIN_MAINNET_RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
const AVALANCHE_C_CHAIN_FUJI_TESTNET_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"

// Below is a sample Hardhat task.
// To learn how to create your own go to https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

export default {
    solidity: "0.8.9",
    networks: {
        testnet: {
            url: AVALANCHE_C_CHAIN_FUJI_TESTNET_RPC_URL,
            accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] // private key for public test account
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        hardhat: {
            forking: {
                url: AVALANCHE_C_CHAIN_FUJI_TESTNET_RPC_URL,
                blockNumber: 7566305 // Fork network from this block number
            },
            accounts: {
                count: 5
            }
        }
    },
    abiExporter: {
        path: "./abis",
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 4
    }
}