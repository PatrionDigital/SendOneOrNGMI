# Send $1 or NGMI - Project Tasks

## ✅ Completed Tasks

### 2024-11-25 - Initial Setup

- [x] Create project structure with Next.js 14
- [x] Set up TypeScript configuration
- [x] Configure Tailwind CSS
- [x] Create Solidity smart contract with:
  - 42-minute countdown (changed from 24 hours)
  - Batch payout for all 100 winners
  - ReentrancyGuard protection
  - Pausable functionality
- [x] Set up MiniKit provider
- [x] Create main UI components:
  - CountdownTimer (MM:SS format)
  - PotStats (pot value, entries, payout)
  - CTASection (Send $1 button)
  - LiveQueue (last 100 entries)
  - BatchPayoutButton
  - EndGameButton
  - GameEndedBanner
- [x] Create API routes:
  - Paymaster proxy (/api/paymaster)
  - Farcaster manifest (/.well-known/farcaster.json)
  - Webhook endpoint (/api/webhook)
- [x] Add environment configuration
- [x] Create documentation (README.md)

## 📋 Pending Tasks

### Smart Contract Deployment

- [ ] Install Foundry for contract deployment
- [ ] Deploy to Base Sepolia testnet
- [ ] Verify contract on Basescan
- [ ] Test all contract functions
- [ ] Deploy to Base Mainnet
- [ ] Verify mainnet contract

### Coinbase Developer Platform Setup

- [ ] Create CDP account
- [ ] Get OnchainKit API key
- [ ] Configure Paymaster:
  - Add contract address to allowlist
  - Add sendOne() function
  - Set per-user limit: $0.10/day
  - Set global limit: $500/week
- [ ] Get Paymaster URL

### Frontend Deployment

- [ ] Deploy to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Generate Farcaster manifest signatures
- [ ] Test manifest validation

### Testing

- [ ] Test in local development
- [ ] Test in Warpcast dev tools
- [ ] Test in Base App
- [ ] Test wallet connection
- [ ] Test gasless transactions
- [ ] Test batch payout

### Assets

- [ ] Create icon.png (512x512)
- [ ] Create splash.png
- [ ] Create og-image.png
- [ ] Create screenshots for manifest

## 🔄 Discovered During Work

- Need to add unit tests for components
- Consider adding transaction history view
- May want to add share button for Farcaster
- Consider adding sound effects for urgency
