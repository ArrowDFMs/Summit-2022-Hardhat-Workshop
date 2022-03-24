import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { Contract } from 'ethers'

const SECONDS_PER_DAY = 60 * 60 * 24

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
        const oldBlockTimestamp = (await blockTime.getBlockTime()).toNumber()

        const oneDayFromNow = oldBlockTimestamp + SECONDS_PER_DAY // Add one day
        // await network.provider.send("evm_setNextBlockTimestamp", [oneDayFromNow])
        await network.provider.send("evm_mine", [oneDayFromNow])

        const newBlockTimestamp = (await blockTime.getBlockTime()).toNumber()

        expect(oldBlockTimestamp).to.equal(newBlockTimestamp - SECONDS_PER_DAY)
        expect(newBlockTimestamp).to.equal(oneDayFromNow)
    })
    it('tests increaseTime on hardhat', async () => {
        const oldBlockTimestamp = (await blockTime.getBlockTime()).toNumber()

        await network.provider.send("evm_increaseTime", [SECONDS_PER_DAY])
        await network.provider.send("evm_mine")

        const newBlockTimestamp = (await blockTime.getBlockTime()).toNumber()

        expect(newBlockTimestamp).to.equal(oldBlockTimestamp + SECONDS_PER_DAY)
    })
})