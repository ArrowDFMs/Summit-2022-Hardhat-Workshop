import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
    Contract
} from 'ethers'

describe('Testing Gas Guzzler Functions', async () => {
    let gasGuzzler: Contract
    beforeEach(async () => {
        const GasGuzzlerFactory = await ethers.getContractFactory('GasGuzzler')
        gasGuzzler = await GasGuzzlerFactory.deploy()
    })

    it('deploys', async () => {
        expect(gasGuzzler.address).to.not.equal(ethers.constants.AddressZero)
    })
    it('guzzles gas', async () => {
        await gasGuzzler.guzzleGas()
    })
})