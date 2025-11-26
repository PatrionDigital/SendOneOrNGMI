'use client';

import { useState, useCallback } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import Confetti from 'react-confetti';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ENTRY_FEE_ETH } from '@/lib/contract';

/**
 * Main call-to-action section with the "Send $1" button
 * Uses OnchainKit Transaction component with paymaster for gasless transactions
 */
export function CTASection() {
  const { address, isConnected } = useAccount();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window size for confetti
  useState(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  });

  const contracts = [
    {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'sendOne' as const,
      args: [] as const,
      value: parseEther(ENTRY_FEE_ETH),
    },
  ];

  const handleSuccess = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const handleError = useCallback((error: { code: string; error: string; message: string }) => {
    console.error('Transaction error:', error.message);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
      {/* Confetti on success */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#10B981', '#059669', '#047857', '#34D399', '#6EE7B7']}
        />
      )}

      {/* Headline */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
        LAST 100 PEOPLE
        <br />
        <span className="text-green-400">WIN EVERYTHING</span>
      </h2>

      {/* Subheadline */}
      <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">
        Send exactly $1 (0.001 ETH). Every transaction resets the 42-minute countdown.
        <br className="hidden sm:block" />
        <span className="text-green-400 font-semibold">No gas fees. No downloads. Pure chaos.</span>
      </p>

      {/* CTA Button */}
      {!isConnected ? (
        <Wallet>
          <ConnectWallet className="!bg-green-500 !text-black hover:!bg-green-400 !text-xl sm:!text-2xl !py-5 sm:!py-6 !px-10 sm:!px-12 !font-black !rounded-xl transform hover:scale-105 transition-all shadow-xl shadow-green-500/30">
            <span className="flex items-center gap-2">
              🔗 CONNECT TO PLAY
            </span>
          </ConnectWallet>
        </Wallet>
      ) : (
        <Transaction
          chainId={8453} // Base mainnet
          contracts={contracts}
          capabilities={{
            paymasterService: {
              url: '/api/paymaster',
            },
          }}
          onSuccess={handleSuccess}
          onError={handleError}
        >
          <TransactionButton
            className="!bg-green-500 !text-black hover:!bg-green-400 !text-2xl sm:!text-3xl !py-6 sm:!py-8 !px-12 sm:!px-16 !font-black !rounded-xl transform hover:scale-105 transition-all shadow-2xl shadow-green-500/50"
            text="SEND $1 OR NGMI 🚀"
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}

      {/* Gas sponsorship notice */}
      <p className="mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Gas sponsored by Base Paymaster • No fees • Instant
      </p>

      {/* Connected address indicator */}
      {isConnected && address && (
        <p className="mt-4 text-gray-600 text-xs font-mono">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </div>
  );
}
