// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console } from "forge-std/Test.sol";
import { SendOneOrNGMI } from "../SendOneOrNGMI.sol";

contract SendOneOrNGMITest is Test {
    SendOneOrNGMI public game;

    address public owner = address(this);
    address public player1 = address(0x1);
    address public player2 = address(0x2);

    uint256 public constant ENTRY_FEE = 0.001 ether;
    uint256 public constant COUNTDOWN_DURATION = 42 minutes;

    function setUp() public {
        game = new SendOneOrNGMI();

        // Fund test accounts
        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
    }

    // ============ Constructor Tests ============

    function test_InitialState() public view {
        assertEq(game.ENTRY_FEE(), ENTRY_FEE);
        assertEq(game.COUNTDOWN_DURATION(), COUNTDOWN_DURATION);
        assertEq(game.QUEUE_SIZE(), 100);
        assertEq(game.gameActive(), false);
        assertEq(game.gameEnded(), false);
        assertEq(game.totalEntries(), 0);
        assertEq(game.totalPotValue(), 0);
    }

    // ============ sendOne Tests ============

    function test_SendOne_StartsGame() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        assertTrue(game.gameActive());
        assertEq(game.totalEntries(), 1);
        assertEq(game.totalPotValue(), ENTRY_FEE);
    }

    function test_SendOne_ResetsCountdown() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        uint256 initialTime = game.countdownEndTime();

        // Advance time by 10 minutes
        vm.warp(block.timestamp + 10 minutes);

        vm.prank(player2);
        game.sendOne{ value: ENTRY_FEE }();

        // Countdown should be reset
        assertGt(game.countdownEndTime(), initialTime);
    }

    function test_SendOne_RevertWrongAmount() public {
        vm.prank(player1);
        vm.expectRevert("Must send exactly 0.001 ETH");
        game.sendOne{ value: 0.002 ether }();
    }

    function test_SendOne_RevertGameEnded() public {
        // Start game
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        // Warp past countdown
        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);

        // End game
        game.endGame();

        // Try to send after game ended
        vm.prank(player2);
        vm.expectRevert("Game has ended");
        game.sendOne{ value: ENTRY_FEE }();
    }

    function test_SendOne_UpdatesQueue() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        address[] memory queue = game.getCurrentQueuePositions();
        assertEq(queue[0], player1);
    }

    function test_SendOne_EmitsEvents() public {
        vm.prank(player1);

        vm.expectEmit(true, true, true, true);
        emit SendOneOrNGMI.EntryAdded(player1, 0, block.timestamp);

        game.sendOne{ value: ENTRY_FEE }();
    }

    // ============ Queue Tests ============

    function test_Queue_CircularBuffer() public {
        // Fill queue with 100 entries
        for (uint256 i = 0; i < 100; i++) {
            address player = address(uint160(i + 100));
            vm.deal(player, 1 ether);
            vm.prank(player);
            game.sendOne{ value: ENTRY_FEE }();
        }

        // Add one more entry (should wrap around)
        address newPlayer = address(0x999);
        vm.deal(newPlayer, 1 ether);
        vm.prank(newPlayer);
        game.sendOne{ value: ENTRY_FEE }();

        // Check queue contains new player
        address[] memory queue = game.getCurrentQueuePositions();
        bool found = false;
        for (uint256 i = 0; i < queue.length; i++) {
            if (queue[i] == newPlayer) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }

    // ============ endGame Tests ============

    function test_EndGame_Success() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        // Warp past countdown
        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);

        game.endGame();

        assertTrue(game.gameEnded());
        assertFalse(game.gameActive());
    }

    function test_EndGame_RevertNotStarted() public {
        vm.expectRevert("Game not started");
        game.endGame();
    }

    function test_EndGame_RevertCountdownActive() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        vm.expectRevert("Countdown still active");
        game.endGame();
    }

    function test_EndGame_RevertAlreadyEnded() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);
        game.endGame();

        vm.expectRevert("Game already ended");
        game.endGame();
    }

    // ============ batchPayout Tests ============

    function test_BatchPayout_Success() public {
        // Add 100 entries
        for (uint256 i = 0; i < 100; i++) {
            address player = address(uint160(i + 100));
            vm.deal(player, 1 ether);
            vm.prank(player);
            game.sendOne{ value: ENTRY_FEE }();
        }

        uint256 totalPot = game.totalPotValue();
        uint256 expectedPayout = totalPot / 100;

        // End game
        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);
        game.endGame();

        // Record balances before payout
        address[] memory queue = game.getCurrentQueuePositions();
        uint256[] memory balancesBefore = new uint256[](100);
        for (uint256 i = 0; i < 100; i++) {
            balancesBefore[i] = queue[i].balance;
        }

        // Execute batch payout
        game.batchPayout();

        // Verify payouts
        for (uint256 i = 0; i < 100; i++) {
            assertEq(queue[i].balance, balancesBefore[i] + expectedPayout);
        }

        assertEq(game.totalPotValue(), 0);
    }

    function test_BatchPayout_RevertGameNotEnded() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        vm.expectRevert("Game not ended yet");
        game.batchPayout();
    }

    // ============ View Function Tests ============

    function test_GetTimeRemaining() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        uint256 remaining = game.getTimeRemaining();
        assertEq(remaining, COUNTDOWN_DURATION);

        // Advance time
        vm.warp(block.timestamp + 10 minutes);
        remaining = game.getTimeRemaining();
        assertEq(remaining, COUNTDOWN_DURATION - 10 minutes);
    }

    function test_GetTimeRemaining_ReturnsZeroAfterExpiry() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);

        assertEq(game.getTimeRemaining(), 0);
    }

    function test_CanEndGame() public {
        assertFalse(game.canEndGame());

        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        assertFalse(game.canEndGame());

        vm.warp(block.timestamp + COUNTDOWN_DURATION + 1);

        assertTrue(game.canEndGame());
    }

    function test_GetEstimatedPayout() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        uint256 payout = game.getEstimatedPayout();
        assertEq(payout, ENTRY_FEE / 100);

        // Add more entries
        for (uint256 i = 0; i < 9; i++) {
            address player = address(uint160(i + 100));
            vm.deal(player, 1 ether);
            vm.prank(player);
            game.sendOne{ value: ENTRY_FEE }();
        }

        payout = game.getEstimatedPayout();
        assertEq(payout, (ENTRY_FEE * 10) / 100);
    }

    function test_GetUserStats() public {
        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        (uint256 entries, bool inQueue, uint256 position) = game.getUserStats(player1);
        assertEq(entries, 1);
        assertTrue(inQueue);
        assertEq(position, 0);

        // Player not in queue
        (entries, inQueue, position) = game.getUserStats(player2);
        assertEq(entries, 0);
        assertFalse(inQueue);
    }

    // ============ Pause Tests ============

    function test_Pause() public {
        game.pause();

        vm.prank(player1);
        vm.expectRevert();
        game.sendOne{ value: ENTRY_FEE }();
    }

    function test_Unpause() public {
        game.pause();
        game.unpause();

        vm.prank(player1);
        game.sendOne{ value: ENTRY_FEE }();

        assertEq(game.totalEntries(), 1);
    }

    // ============ Receive/Fallback Tests ============

    function test_ReceiveEther() public {
        vm.prank(player1);
        (bool success,) = address(game).call{ value: ENTRY_FEE }("");
        assertTrue(success);
        assertEq(game.totalEntries(), 1);
    }
}
