# Send $1 or NGMI 🚀

A viral, gasless Mini-App for Base App and Farcaster that runs a game-theoretic experiment where the **last 100 people to send $1 (0.001 ETH) split the entire pot** when a 42-minute countdown expires. Every transaction resets the timer. Pure chaos, maximum virality.

## 🎯 How It Works

1. **Send $1** (0.001 ETH) to enter the game
2. **Every entry resets** the 42-minute countdown
3. **Last 100 entries** when timer expires split the entire pot
4. **Batch payout** - all winners paid in a single transaction
5. **No gas fees** - transactions sponsored by Base Paymaster

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Base (Ethereum L2)
- **Smart Contract**: Solidity 0.8.20 + OpenZeppelin
- **Wallet**: OnchainKit MiniKit + Smart Wallet
- **Gas Sponsorship**: Coinbase Developer Platform Paymaster

## 📁 Project Structure

\`\`\`
SendOneOrNGMI/
├── contracts/
│ └── SendOneOrNGMI.sol # Main game contract
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── paymaster/ # Paymaster proxy
│ │ │ └── webhook/ # Farcaster webhooks
│ │ ├── .well-known/ # Farcaster manifest
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Main game page
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── CountdownTimer.tsx # MM:SS countdown
│ │ ├── PotStats.tsx # Pot value display
│ │ ├── CTASection.tsx # Send $1 button
│ │ ├── LiveQueue.tsx # Winner queue
│ │ ├── BatchPayoutButton.tsx
│ │ ├── EndGameButton.tsx
│ │ └── GameEndedBanner.tsx
│ ├── lib/
│ │ └── contract.ts # Contract ABI & config
│ └── providers/
│ └── MiniKitProvider.tsx
├── public/ # Static assets
├── .env.example # Environment template
└── package.json
\`\`\`

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your values:

- \`NEXT_PUBLIC_ONCHAINKIT_API_KEY\` - Get from [Coinbase Developer Platform](https://developer.coinbase.com)
- \`CDP_PAYMASTER_URL\` - Paymaster endpoint from CDP
- \`NEXT_PUBLIC_CONTRACT_ADDRESS\` - Your deployed contract address

### 3. Generate Farcaster Manifest

\`\`\`bash
npx create-onchain --manifest
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 📜 Smart Contract (Foundry)

### Key Features

- **42-minute countdown** (resets on each entry)
- **Circular queue** of 100 addresses
- **Batch payout** - all winners paid in one transaction
- **ReentrancyGuard** protection
- **Pausable** for emergencies

### Setup Foundry

\`\`\`bash

# Install Foundry (if not already installed)

curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies

forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts

# Build contracts

forge build

# Run tests

forge test -vvv
\`\`\`

### Deploy Contract

\`\`\`bash

# Copy environment template

cp .env.foundry.example .env

# Edit .env with your values:

# - PRIVATE_KEY

# - BASE_SEPOLIA_RPC_URL

# - BASESCAN_API_KEY

# Load environment variables

source .env

# Deploy to Base Sepolia (testnet)

forge script contracts/script/Deploy.s.sol:DeploySendOneOrNGMI \\
--rpc-url $BASE_SEPOLIA_RPC_URL \\
--private-key $PRIVATE_KEY \\
--broadcast \\
--verify

# Deploy to Base Mainnet

forge script contracts/script/Deploy.s.sol:DeploySendOneOrNGMI \\
--rpc-url $BASE_RPC_URL \\
--private-key $PRIVATE_KEY \\
--broadcast \\
--verify
\`\`\`

### Run Tests

\`\`\`bash

# Run all tests

forge test

# Run with verbosity

forge test -vvv

# Run specific test

forge test --match-test test_SendOne_StartsGame

# Gas report

forge test --gas-report
\`\`\`

### Verify Contract (if not auto-verified)

\`\`\`bash
forge verify-contract YOUR_CONTRACT_ADDRESS \\
contracts/SendOneOrNGMI.sol:SendOneOrNGMI \\
--chain base \\
--etherscan-api-key $BASESCAN_API_KEY
\`\`\`

## ⛽ Paymaster Setup

1. Go to [Coinbase Developer Platform](https://developer.coinbase.com)
2. Create a new project
3. Enable Paymaster
4. Add your contract address to the allowlist
5. Add \`sendOne()\` function to allowed functions
6. Set spending limits:
   - Per-user: $0.10/day
   - Global: $500/week

## 🧪 Testing

### Local Testing

\`\`\`bash
npm run dev

# Visit http://localhost:3000

\`\`\`

### Farcaster Dev Tools

Test your Mini-App at:
https://warpcast.com/~/developers/mini-apps

### Run Tests

\`\`\`bash
npm run test
\`\`\`

## 🚀 Deployment

### Deploy to Vercel

\`\`\`bash
vercel
\`\`\`

### Environment Variables in Vercel

Add all variables from \`.env.example\` to your Vercel project settings.

## 📊 Key Metrics

| Metric    | Value              |
| --------- | ------------------ |
| Entry Fee | 0.001 ETH (~$2.50) |
| Countdown | 42 minutes         |
| Winners   | Last 100 entries   |
| Payout    | Batch (single tx)  |
| Gas       | Sponsored (free)   |

## 🔐 Security

- ✅ ReentrancyGuard on all state-changing functions
- ✅ Batch payout pattern (no individual withdrawals)
- ✅ Paymaster proxy to hide URL
- ✅ Contract allowlist in CDP
- ✅ Per-user and global spending limits
- ✅ Pause mechanism for emergencies

## 📱 Platform Support

- **Base App** (clientFid: 309857)
- **Warpcast** (clientFid: 9152)
- **Farcaster** (clientFid: 1)
- **Web** (standalone)

## 🎨 Design System

| Element    | Value               |
| ---------- | ------------------- |
| Background | #000000 (black)     |
| Primary    | #10B981 (green-500) |
| Accent     | #059669 (green-600) |
| Warning    | #EF4444 (red-500)   |
| Text       | #FFFFFF, #9CA3AF    |

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with 💚 for Base App & Farcaster

**LFG! 🚀**
