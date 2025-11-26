'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

interface GameEndedBannerProps {
  potValue: bigint;
  estimatedPayout: bigint;
}

/**
 * Banner displayed when the game has ended
 * Shows celebration and payout information
 */
export function GameEndedBanner({ potValue, estimatedPayout }: GameEndedBannerProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    // Stop confetti after 10 seconds
    const timer = setTimeout(() => setShowConfetti(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const potEth = potValue ? formatEther(potValue) : '0';
  const payoutEth = estimatedPayout ? formatEther(estimatedPayout) : '0';

  return (
    <div className="relative">
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={300}
          colors={['#10B981', '#059669', '#047857', '#34D399', '#FBBF24', '#F59E0B']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-12 sm:py-16 text-center"
      >
        {/* Main headline */}
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-400 mb-4 animate-pulse"
        >
          🎉 GAME ENDED! 🎉
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl text-white mb-8"
        >
          Time to distribute the pot to all 100 winners!
        </motion.p>

        {/* Payout stats */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8"
        >
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Total Pot
            </p>
            <p className="text-3xl sm:text-4xl font-black text-green-400 font-mono">
              {parseFloat(potEth).toFixed(4)} ETH
            </p>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Each Winner Gets
            </p>
            <p className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono">
              {parseFloat(payoutEth).toFixed(4)} ETH
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-lg"
        >
          Click the button below to execute the batch payout
        </motion.p>
      </motion.div>
    </div>
  );
}
