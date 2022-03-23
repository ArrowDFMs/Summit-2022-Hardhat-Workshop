import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { Contract } from 'ethers'

describe('Testing BlockTime Contract', async () => {
    let blockTime: Contract
    beforeEach(async () => {
        const BlockTimeFactory = await ethers.getContractFactory('BlockTime')
        blockTime = await BlockTimeFactory.deploy()
    })

    it('deploys', async () => {
        expect(blockTime.address).to.not.equal(ethers.constants.AddressZero)
    })
    it('tests setNextBlockTimestamp on hardhat', async () => {
        const latestBlockTime = (await blockTime.getBlockTime()).toNumber()

        const oneDayFromNow = latestBlockTime + (60 * 60 * 24) // Add one day
        // await network.provider.send("evm_setNextBlockTimestamp", [oneDayFromNow])
        await network.provider.send("evm_mine", [oneDayFromNow])

        expect((await blockTime.getBlockTime()).toNumber()).to.equal(oneDayFromNow)
    })
    it('tests increaseTime on hardhat', async () => {
        const latestBlockTime = (await blockTime.getBlockTime()).toNumber()

        const oneDayFromNow = 60 * 60 * 24 // Add one day
        await network.provider.send("evm_increaseTime", [oneDayFromNow])
        await network.provider.send("evm_mine")

        expect((await blockTime.getBlockTime()).toNumber()).to.equal(latestBlockTime + oneDayFromNow)
    })
})