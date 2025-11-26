'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useReadContract } from 'wagmi';
import {
  CountdownTimer,
  PotStats,
  CTASection,
  LiveQueue,
  BatchPayoutButton,
  EndGameButton,
  GameEndedBanner,
} from '@/components';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

/**
 * Main page component for Send $1 or NGMI Mini-App
 * Handles game state, countdown, and user interactions
 */
export default function HomePage() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const { address } = useAccount();

  // Platform detection for UX customization
  const isBaseApp = context?.client?.clientFid === 309857;
  const isFarcaster =
    context?.client?.clientFid === 1 || context?.client?.clientFid === 9152;

  // Signal frame is ready (CRITICAL for Mini-Apps)
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  // Read contract data with polling
  const { data: timeRemaining } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTimeRemaining',
    query: { refetchInterval: 1000 },
  });

  const { data: queue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCurrentQueuePositions',
    query: { refetchInterval: 5000 },
  });

  const { data: potValue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalPotValue',
    query: { refetchInterval: 5000 },
  });

  const { data: totalEntries } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalEntries',
    query: { refetchInterval: 5000 },
  });

  const { data: estimatedPayout } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEstimatedPayout',
    query: { refetchInterval: 5000 },
  });

  const { data: canEndGame } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'canEndGame',
    query: { refetchInterval: 5000 },
  });

  const { data: gameEnded } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'gameEnded',
    query: { refetchInterval: 5000 },
  });

  const { data: gameActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'gameActive',
    query: { refetchInterval: 5000 },
  });

  // Safe defaults for contract data
  const safeTimeRemaining = Number(timeRemaining ?? 0);
  const safePotValue = potValue ?? BigInt(0);
  const safeTotalEntries = totalEntries ?? BigInt(0);
  const safeEstimatedPayout = estimatedPayout ?? BigInt(0);
  const safeQueue: readonly `0x${string}`[] = Array.isArray(queue) ? queue : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Platform indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 bg-purple-600 px-3 py-1 text-xs z-50 rounded-br-lg">
          {isBaseApp ? '🟦 Base App' : isFarcaster ? '🟪 Farcaster' : '🌐 Web'}
        </div>
      )}

      {/* Header */}
      <header className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-green-400 tracking-tight">
          SEND $1 OR NGMI
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          42 minutes to chaos • The fastest ponzi on Base
        </p>
      </header>

      {/* Main content */}
      {!gameEnded ? (
        <>
          {/* Active game UI */}
          <CountdownTimer timeRemaining={safeTimeRemaining} />

          <PotStats
            potValue={safePotValue}
            totalEntries={safeTotalEntries}
            estimatedPayout={safeEstimatedPayout}
          />

          <CTASection />

          <LiveQueue queue={safeQueue} />

          {/* Show end game button when timer expires */}
          {canEndGame && <EndGameButton />}
        </>
      ) : (
        <>
          {/* Game ended UI */}
          <GameEndedBanner
            potValue={safePotValue}
            estimatedPayout={safeEstimatedPayout}
          />

          <LiveQueue queue={safeQueue} />

          {/* Batch payout button */}
          <BatchPayoutButton />
        </>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-gray-800 mt-12">
        <p className="text-gray-600 text-sm">
          Built for Base App & Farcaster • Gasless transactions powered by Base Paymaster
        </p>
        <p className="text-gray-700 text-xs mt-2">
          {address ? (
            <>
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </>
          ) : (
            'Connect wallet to play'
          )}
        </p>
      </footer>
    </div>
  );
}
