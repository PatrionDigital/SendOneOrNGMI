'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

/**
 * Button to end the game when the timer has expired
 * Can be called by anyone after countdown reaches zero
 */
export function EndGameButton() {
  const { data: hash, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleEndGame = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'endGame',
    });
  };

  return (
    <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-50">
      <motion.button
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEndGame}
        disabled={isConfirming || isSuccess}
        className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isConfirming ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span>ENDING...</span>
          </>
        ) : isSuccess ? (
          <>
            <span>✅</span>
            <span>ENDED!</span>
          </>
        ) : (
          <>
            <span>🏁</span>
            <span>END GAME</span>
          </>
        )}
      </motion.button>

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-xs mt-2 max-w-[200px] text-right">
          {error.message.slice(0, 50)}...
        </p>
      )}
    </div>
  );
}
