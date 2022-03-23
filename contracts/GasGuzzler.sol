// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract GasGuzzler {
    uint256[] private values;

    function guzzleGas() public returns(uint256) {
        for (uint256 i = 0; i < 309; i++) { // runs out of gas with > 309
            values.push(i);
        }

        return 0;
    }
}