import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
    Signer,
    ContractFactory,
    Contract,
    BigNumber
} from 'ethers'

describe('Testing PercentOfPrice Contract', async () => {
    let signers: Signer[]
    let signerAddresses: String[]
    let percentOfPrice: Contract
    let WAVAXDecimals: number
    let priceFeed: Contract
    let priceFeedDecimals: number
    let spotPrice: BigNumber
    let formattedSpotPrice: string
    beforeEach(async () => {
        signers = await ethers.getSigners()
        signerAddresses = await Promise.all(signers.map((signer) => signer.getAddress()))

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
        const TEN = ethers.BigNumber.from('10')
        const ratePrecisionDecimals = await percentOfPrice.ratePrecisionDecimals()
        const percentage = ethers.utils.parseUnits('0.10', ratePrecisionDecimals)
        const pricePercent = await percentOfPrice.callStatic.getPercentOfSpotPrice(percentage)
        
        expect(pricePercent).to.equal(
            spotPrice.mul(percentage)
                     .div(TEN.pow(ratePrecisionDecimals))
                     .mul(TEN.pow(WAVAXDecimals - priceFeedDecimals))
        )

        console.log("Spot price:", formattedSpotPrice)
        console.log("10% of spot price:", ethers.utils.formatUnits(pricePercent, WAVAXDecimals))
    })
})