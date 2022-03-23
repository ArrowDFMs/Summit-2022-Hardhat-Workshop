import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import {
    Contract
} from 'ethers'

describe('Testing Fork Functions', async () => {
    let USDC: Contract
    let usdcDecimals: number
    beforeEach(async () => {
        // mainnet: 0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664
        USDC = await ethers.getContractAt('IERC20Metadata', '0x45ea5d57BA80B5e3b0Ed502e9a08d568c96278F9')
        usdcDecimals = await USDC.decimals()
    })

    it('impersonates account', async () => {
        // Pick out address with a lot of funds to impersonate
        const accountToImpersonate = ethers.utils.getAddress('0x72E3b2BFa7CD38E080f2594BA668019a91F3a8f1')

        // Make hardhat node request
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [accountToImpersonate],
        })

        // Set balance of AVAX for impersonated account (if needed)
        let balanceString = ethers.utils.parseEther('2').toHexString() // 2 AVAX
        const indexOfX = balanceString.indexOf('x')
        if (balanceString.charAt(indexOfX+1) === '0') {
            balanceString = '0x' + balanceString.substring(indexOfX+2)
        }
        await network.provider.send("hardhat_setBalance", [
            accountToImpersonate,
            balanceString
        ])

        // Extract signer from impersonated account
        const signer = await ethers.getSigner(accountToImpersonate)

        // Transfer from impersonated account to other account and check balances
        const amountToTransfer = ethers.utils.parseUnits('10000', usdcDecimals)
        const usdcBalanceBefore = await USDC.balanceOf('0x2B522cABE9950D1153c26C1b399B293CaA99FcF9')
        await USDC.connect(signer).transfer(
            '0x2B522cABE9950D1153c26C1b399B293CaA99FcF9',
            amountToTransfer
        )
        const usdcBalanceAfter = await USDC.balanceOf('0x2B522cABE9950D1153c26C1b399B293CaA99FcF9')
        expect(usdcBalanceAfter).to.equal(usdcBalanceBefore.add(amountToTransfer))
    })
})