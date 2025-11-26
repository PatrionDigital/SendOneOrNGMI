'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

/**
 * Button to execute batch payout to all 100 winners in a single transaction
 * Only visible after the game has ended
 */
export function BatchPayoutButton() {
  const [isPaying, setIsPaying] = useState(false);

  const { data: hash, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeBatchPayout = async () => {
    setIsPaying(true);

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'batchPayout',
      });
    } catch (err) {
      console.error('Batch payout failed:', err);
      setIsPaying(false);
    }
  };

  // Reset paying state when transaction completes or fails
  if ((isSuccess || error) && isPaying) {
    setIsPaying(false);
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {!isSuccess ? (
        <motion.button
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={executeBatchPayout}
          disabled={isPaying || isConfirming}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 sm:gap-4"
        >
          {isPaying || isConfirming ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-black" />
              <span>EXECUTING PAYOUT...</span>
            </>
          ) : (
            <>
              <span>💰</span>
              <span>PAY ALL 100 WINNERS</span>
              <span>💰</span>
            </>
          )}
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-500 text-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl flex items-center gap-3 sm:gap-4"
        >
          <span>✅</span>
          <span>ALL WINNERS PAID!</span>
          <span>🎉</span>
        </motion.div>
      )}

      {/* Transaction link */}
      {hash && (
        <a
          href={`https://basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-green-400 text-sm mt-3 hover:underline"
        >
          View transaction on Basescan →
        </a>
      )}

      {/* Error message */}
      {error && (
        <p className="text-center text-red-400 text-sm mt-3">
          Error: {error.message.slice(0, 50)}...
        </p>
      )}
    </div>
  );
}
