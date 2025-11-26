// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SendOneOrNGMI
 * @notice A game-theoretic experiment where the last 100 people to send $1 (0.001 ETH)
 *         split the entire pot when a 42-minute countdown expires.
 * @dev Every transaction resets the timer. Batch payout distributes to all winners in one tx.
 */
contract SendOneOrNGMI is ReentrancyGuard, Ownable {
    // ============ Constants ============
    uint256 public constant ENTRY_FEE = 0.001 ether;
    uint256 public constant QUEUE_SIZE = 100;
    uint256 public constant COUNTDOWN_DURATION = 42 minutes;

    // ============ State Variables ============
    address[100] public winnerQueue;
    uint256 public queueIndex;
    uint256 public totalEntries;
    uint256 public gameEndTime;
    uint256 public totalPotValue;
    bool public gameActive;
    bool public gameEnded;

    mapping(address => uint256) public userEntries;
    mapping(address => uint256) public userPosition;

    // ============ Events ============
    event EntryAdded(address indexed user, uint256 position, uint256 newCountdown, uint256 potValue);
    event GameEnded(address[100] winners, uint256 payoutPerWinner, uint256 timestamp);
    event CountdownReset(uint256 newEndTime);
    event BatchPayoutExecuted(uint256 totalPaid, uint256 timestamp);

    // ============ Constructor ============
    constructor() Ownable(msg.sender) {
        gameActive = true;
        gameEnded = false;
        gameEndTime = block.timestamp + COUNTDOWN_DURATION;
    }

    // ============ External Functions ============

    /**
     * @notice Send exactly 0.001 ETH to enter the game
     * @dev Adds sender to circular queue and resets 42-minute countdown
     */
    function sendOne() external payable nonReentrant {
        require(gameActive, "Game not active");
        require(!gameEnded, "Game has ended");
        require(msg.value == ENTRY_FEE, "Must send exactly 0.001 ETH");
        require(block.timestamp < gameEndTime, "Game has ended");

        // Add to queue (circular buffer)
        winnerQueue[queueIndex] = msg.sender;

        // Update state
        queueIndex = (queueIndex + 1) % QUEUE_SIZE;
        totalEntries++;
        totalPotValue += msg.value;
        userEntries[msg.sender]++;
        userPosition[msg.sender] = totalEntries;

        // Reset countdown to 42 minutes
        gameEndTime = block.timestamp + COUNTDOWN_DURATION;

        emit EntryAdded(msg.sender, totalEntries, gameEndTime, totalPotValue);
        emit CountdownReset(gameEndTime);
    }

    /**
     * @notice End the game when timer expires
     * @dev Can be called by anyone after countdown reaches zero
     */
    function endGame() external nonReentrant {
        require(block.timestamp >= gameEndTime, "Game not ended yet");
        require(gameActive, "Game already ended");
        require(!gameEnded, "Game already ended");

        gameActive = false;
        gameEnded = true;

        emit GameEnded(winnerQueue, totalPotValue / QUEUE_SIZE, block.timestamp);
    }

    /**
     * @notice Batch payout to all 100 winners in a single transaction
     * @dev Distributes pot equally among all addresses in the queue
     */
    function batchPayout() external nonReentrant {
        require(gameEnded, "Game not ended yet");
        require(totalPotValue > 0, "No funds to distribute");

        uint256 amountPerWinner = totalPotValue / QUEUE_SIZE;
        uint256 totalPaid = 0;

        // Pay all 100 winners in a single transaction
        for (uint256 i = 0; i < QUEUE_SIZE; i++) {
            address winner = winnerQueue[i];
            if (winner != address(0)) {
                (bool success,) = winner.call{value: amountPerWinner}("");
                if (success) {
                    totalPaid += amountPerWinner;
                }
                // Continue even if one transfer fails to not block others
            }
        }

        // Clear pot after payout
        totalPotValue = 0;

        emit BatchPayoutExecuted(totalPaid, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @notice Get remaining time until game ends
     * @return Seconds remaining, or 0 if expired
     */
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= gameEndTime) return 0;
        return gameEndTime - block.timestamp;
    }

    /**
     * @notice Get all current queue positions
     * @return Array of 100 addresses in the winner queue
     */
    function getCurrentQueuePositions() external view returns (address[100] memory) {
        return winnerQueue;
    }

    /**
     * @notice Get statistics for a specific user
     * @param user Address to query
     * @return entries Number of times user has entered
     * @return position User&apos;s last entry position
     * @return inQueue Whether user is currently in the winner queue
     */
    function getUserStats(address user) external view returns (uint256 entries, uint256 position, bool inQueue) {
        entries = userEntries[user];
        position = userPosition[user];

        // Check if user is in current queue
        inQueue = false;
        for (uint256 i = 0; i < QUEUE_SIZE; i++) {
            if (winnerQueue[i] == user) {
                inQueue = true;
                break;
            }
        }
    }

    /**
     * @notice Check if game can be ended
     * @return True if timer expired and game is still active
     */
    function canEndGame() external view returns (bool) {
        return (block.timestamp >= gameEndTime) && gameActive && !gameEnded;
    }

    /**
     * @notice Get estimated payout per winner
     * @return Amount each winner would receive
     */
    function getEstimatedPayout() external view returns (uint256) {
        if (totalPotValue == 0) return 0;
        return totalPotValue / QUEUE_SIZE;
    }

    // ============ Admin Functions ============

    /**
     * @notice Pause the game (emergency only)
     */
    function pause() external onlyOwner {
        gameActive = false;
    }

    /**
     * @notice Unpause the game and reset timer
     */
    function unpause() external onlyOwner {
        require(!gameEnded, "Cannot unpause ended game");
        gameActive = true;
        gameEndTime = block.timestamp + COUNTDOWN_DURATION;
    }

    /**
     * @notice Allow contract to receive ETH directly
     */
    receive() external payable {}
}
