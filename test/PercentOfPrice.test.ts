import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
    Signer,
    Contract,
    BigNumber
} from 'ethers'

const TEN = ethers.BigNumber.from('10')

describe('Testing PercentOfPrice Contract', async () => {
    let percentOfPrice: Contract
    let WAVAXDecimals: number
    let priceFeed: Contract
    let priceFeedDecimals: number
    let spotPrice: BigNumber
    let formattedSpotPrice: string
    beforeEach(async () => {
        const PercentOfPriceFactory = await ethers.getContractFactory('PercentOfPrice')
        percentOfPrice = await PercentOfPriceFactory.deploy()

        // mainnet: 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
        WAVAXDecimals = await (await ethers.getContractAt('IERC20Metadata', '0xd00ae08403B9bbb9124bB305C09058E32C39A48c')).decimals()

        const priceFeedAddress = '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD' // mainnet: '0x0A77230d17318075983913bC2145DB16C7366156'
        priceFeed = await ethers.getContractAt('AggregatorInterface', priceFeedAddress)
        priceFeedDecimals = await (await ethers.getContractAt('IERC20Metadata', priceFeedAddress)).decimals()
        spotPrice = await priceFeed.latestAnswer()
        formattedSpotPrice = ethers.utils.formatUnits(spotPrice, priceFeedDecimals)
    })

    it('deploys', async () => {
        expect(percentOfPrice.address).to.not.equal(ethers.constants.AddressZero)
    })
    it('gets expected percent of spot price', async () => {
        const ratePrecisionDecimals = await percentOfPrice.ratePrecisionDecimals()
        const percentage = ethers.utils.parseUnits('0.10', ratePrecisionDecimals)
        const pricePercent = await percentOfPrice.callStatic.getPercentOfSpotPrice(percentage)
        
        /*
            Steps to get from spotPrice in terms of priceFeedDecimals to percentage of spotPrice in terms of WAVAXDecimals:

            WAVAXDecimals = 18
            priceFeedDecimals = 8

            spotPrice * 10^8 * percent * 10^8
            spotPrice * percent * 10^16
            spotPrice * percent * 10^16 / 10^8
            spotPrice * percent * 10^8
            spotPrice * percent * 10^8 * 10^(18-8)
            spotPrice * percent * 10^8 * 10^10
            spotPrice * percent * 10^18
        */

        expect(pricePercent).to.equal(
            spotPrice.mul(percentage)
                     .div(TEN.pow(ratePrecisionDecimals))
                     .mul(TEN.pow(WAVAXDecimals - priceFeedDecimals))
        )

        console.log("Spot price:", formattedSpotPrice)
        console.log("10% of spot price:", ethers.utils.formatUnits(pricePercent, WAVAXDecimals))
    })
})