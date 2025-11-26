// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { SendOneOrNGMI } from "../SendOneOrNGMI.sol";

/**
 * @title Deploy Script for SendOneOrNGMI
 * @notice Deploys the SendOneOrNGMI contract to Base
 *
 * Usage:
 *   # Deploy to Base Sepolia (testnet)
 *   forge script contracts/script/Deploy.s.sol:DeploySendOneOrNGMI \
 *     --rpc-url $BASE_SEPOLIA_RPC_URL \
 *     --private-key $PRIVATE_KEY \
 *     --broadcast \
 *     --verify
 *
 *   # Deploy to Base Mainnet
 *   forge script contracts/script/Deploy.s.sol:DeploySendOneOrNGMI \
 *     --rpc-url $BASE_RPC_URL \
 *     --private-key $PRIVATE_KEY \
 *     --broadcast \
 *     --verify
 */
contract DeploySendOneOrNGMI is Script {
    function setUp() public { }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        SendOneOrNGMI game = new SendOneOrNGMI();

        console.log("SendOneOrNGMI deployed to:", address(game));
        console.log("Entry Fee:", game.ENTRY_FEE());
        console.log("Countdown Duration:", game.COUNTDOWN_DURATION(), "seconds");
        console.log("Queue Size:", game.QUEUE_SIZE());

        vm.stopBroadcast();
    }
}
