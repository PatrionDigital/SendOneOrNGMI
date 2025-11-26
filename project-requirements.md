# Send $1 or NGMI - Project Requirements

## 🎯 Project Mission

Build a viral, gasless Mini-App for Base App and Farcaster that runs "Send $1 or NGMI" - a game-theoretic experiment where the last 100 people to send $1 (0.001 ETH) split the entire pot when a 42-minute countdown expires. Every transaction resets the timer.

## 🔑 Key Features

### Core Gameplay

- **Entry Fee**: 0.001 ETH (~$1)
- **Countdown**: 42 minutes (resets on each entry)
- **Winners**: Last 100 entries when timer expires
- **Payout**: Batch transaction to all 100 winners

### Technical Requirements

- **Platform**: Mini-App for Base App & Farcaster
- **Framework**: Next.js 14 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: OnchainKit MiniKit + Smart Wallet
- **Gas**: Sponsored via Base Paymaster

## 📋 Smart Contract Specifications

### Constants

- `ENTRY_FEE`: 0.001 ETH
- `QUEUE_SIZE`: 100 addresses
- `COUNTDOWN_DURATION`: 42 minutes (2520 seconds)

### Functions

- `sendOne()`: Enter the game (payable, 0.001 ETH)
- `endGame()`: End game when timer expires
- `batchPayout()`: Pay all 100 winners in one transaction
- `getTimeRemaining()`: Get seconds until game ends
- `getCurrentQueuePositions()`: Get all 100 queue addresses
- `getUserStats(address)`: Get user's entry count and position

### Events

- `EntryAdded`: New entry added to queue
- `CountdownReset`: Timer reset to 42 minutes
- `GameEnded`: Game ended, winners recorded
- `BatchPayoutExecuted`: All winners paid

## 🎨 UI/UX Requirements

### Main Components

1. **Countdown Timer**: MM:SS format, urgent states at <10min and <2min
2. **Pot Stats**: Total pot, entries, estimated payout per winner
3. **CTA Button**: "SEND $1 OR NGMI" with confetti on success
4. **Live Queue**: Last 100 entries with Identity display
5. **End Game Button**: Appears when timer expires
6. **Batch Payout Button**: Appears after game ends

### Design System

- **Theme**: Dark mode (black background, green accents)
- **Colors**: Green (#10B981), Red (#EF4444), Black (#000000)
- **Typography**: Bold headlines, monospace for numbers
- **Animations**: Pulse on urgent, confetti on success

## 🔒 Security Requirements

- ReentrancyGuard on all state-changing functions
- Batch payout pattern (no individual withdrawals)
- Paymaster proxy to hide URL
- Contract allowlist in CDP
- Per-user and global spending limits
- Pause mechanism for emergencies

## 📱 Platform Requirements

### Mini-App Integration

- Call `setFrameReady()` on load
- Platform detection (Base App vs Farcaster)
- Farcaster manifest at `/.well-known/farcaster.json`
- Webhook endpoint for frame events

### Wallet Integration

- Smart Wallet only (no EOA)
- Gasless transactions via Paymaster
- OnchainKit Transaction component

## 🚀 Deployment Checklist

### Smart Contract

- [ ] Deploy to Base Sepolia (testnet)
- [ ] Verify on Basescan
- [ ] Test all functions
- [ ] Deploy to Base Mainnet
- [ ] Verify mainnet contract

### Coinbase Developer Platform

- [ ] Create CDP account
- [ ] Get API key
- [ ] Configure Paymaster
- [ ] Add contract to allowlist
- [ ] Set spending limits

### Frontend

- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Generate Farcaster manifest
- [ ] Test in Warpcast dev tools
- [ ] Test in Base App

## 📊 Success Metrics

- Time remaining (real-time updates)
- Total pot value
- Total lifetime entries
- User's current position
- Number in queue (always 100)
- Payout per winner
