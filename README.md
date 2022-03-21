# Hardhat Workshop

GitHub repository for the Hardhat workshop at the 2022 Avalanche Summit. More detail about each of the components of this repository will be covered by the in-person workshop.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install the packages.

```bash
yarn install
```

## Usage

Compile contracts with hardhat
```bash
npx hardhat compile
```

Run all tests in test folder on local hardhat network
```bash
npx hardhat test --network hardhat
```

Deploy contract on testnet
```bash
npx hardhat run .\scripts\deploy.ts --network testnet
```

Check that the contract was deployed on testnet
```bash
npx hardhat run .\scripts\get-price.ts --network testnet
```

## License
[MIT](https://choosealicense.com/licenses/mit/)