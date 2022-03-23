// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract BlockTime {
    function getBlockTime() public view returns(uint256) {
        return block.timestamp;
    }
}