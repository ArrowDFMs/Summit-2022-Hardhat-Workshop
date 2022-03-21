import { ethers } from 'hardhat'

async function main() {
    const percentOfPriceAddress = '0xef2fEa1e2231c85416d09Dc74ca57eD79884C3A6'
    const percentOfPrice = await ethers.getContractAt('PercentOfPrice', percentOfPriceAddress)
    console.log("Connected to PercentOfPrice contract at", percentOfPrice.address)

    // mainnet: 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
    const WAVAXDecimals = await (await ethers.getContractAt('IERC20Metadata', '0xd00ae08403B9bbb9124bB305C09058E32C39A48c')).decimals()

    const priceFeedAddress = '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD' // mainnet: '0x0A77230d17318075983913bC2145DB16C7366156'
    const priceFeed = await ethers.getContractAt('AggregatorInterface', priceFeedAddress)
    const priceFeedDecimals = await (await ethers.getContractAt('IERC20Metadata', priceFeedAddress)).decimals()
    const spotPrice = await priceFeed.latestAnswer()
    const formattedSpotPrice = ethers.utils.formatUnits(spotPrice, priceFeedDecimals)

    const ratePrecisionDecimals = await percentOfPrice.ratePrecisionDecimals()
    const percentage = ethers.utils.parseUnits('0.10', ratePrecisionDecimals)
    const pricePercent = await percentOfPrice.callStatic.getPercentOfSpotPrice(percentage)
    
    console.log("Spot price:", formattedSpotPrice)
    console.log("10% of spot price:", ethers.utils.formatUnits(pricePercent, WAVAXDecimals))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })