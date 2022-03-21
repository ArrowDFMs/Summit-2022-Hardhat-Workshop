// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// Import OpenZeppelin contracts
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

// Import Chainlink price feed contract
import { AggregatorInterface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorInterface.sol";

contract PercentOfPrice {
    // Define decimals variable to be initialized in constructor
    uint256 immutable public WAVAXDecimals;

    // Set rate precision for percent
    uint256 constant public ratePrecisionDecimals = 8;

    // Set AVAX price feed contract variable
    address constant public priceFeedAddress = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD; // mainnet: 0x0A77230d17318075983913bC2145DB16C7366156;
    AggregatorInterface constant public priceFeed = AggregatorInterface(priceFeedAddress);

    constructor() {
        // mainnet: 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
        WAVAXDecimals = IERC20Metadata(0xd00ae08403B9bbb9124bB305C09058E32C39A48c).decimals(); // Address for WAVAX on C-Chain Fuji Testnet
    }

    /**
     * @notice Get a specified percentage of the spot price of AVAX (in decimals of WAVAX)
     * @param _percent The percentage of the spot price of AVAX that you wish to recieve
     * @return Percentage of spot price of AVAX indicated by input
     * @dev _percent must be multiplied by (10 ** ratePrecisionDecimals)
     */
    function getPercentOfSpotPrice(uint256 _percent) public view returns(uint256) {
        uint256 spotPrice = uint256(priceFeed.latestAnswer()); // In terms of price feed decimals
        uint256 priceFeedDecimals = IERC20Metadata(priceFeedAddress).decimals();
        uint256 percentage = (spotPrice * _percent) / (10 ** ratePrecisionDecimals); // In terms of price feed decimals
        
        // Make sure that we return a price in the correct underlying decimals instead of price feed decimals
        if (WAVAXDecimals > priceFeedDecimals) {
            percentage *= (10 ** (WAVAXDecimals - priceFeedDecimals));
        } else if (WAVAXDecimals < priceFeedDecimals) {
            percentage /= (10 ** (priceFeedDecimals - WAVAXDecimals));
        }

        return percentage;
    }
}