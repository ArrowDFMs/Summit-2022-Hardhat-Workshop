import { ethers } from 'hardhat'

async function main() {
    const PriceOfPercentFactory = await ethers.getContractFactory('PercentOfPrice')
    const priceOfPercent = await PriceOfPercentFactory.deploy()

    await priceOfPercent.deployed()

    console.log("PriceOfPercent contract deployed to:", priceOfPercent.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })