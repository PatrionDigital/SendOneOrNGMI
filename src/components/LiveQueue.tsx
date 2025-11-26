'use client';

import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { QUEUE_SIZE } from '@/lib/contract';

interface LiveQueueProps {
  queue: readonly `0x${string}`[];
}

/**
 * Displays the live queue of the last 100 entries (potential winners)
 * Highlights the current user&apos;s position if they are in the queue
 * @param queue - Array of 100 addresses in the winner queue
 */
export function LiveQueue({ queue }: LiveQueueProps) {
  const { address } = useAccount();

  // Filter out zero addresses and reverse to show most recent first
  const activeQueue = queue
    .map((addr, index) => ({ addr, originalIndex: index }))
    .filter((item) => item.addr !== '0x0000000000000000000000000000000000000000')
    .reverse();

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">
        🏆 CURRENT WINNERS
      </h3>
      <p className="text-gray-400 text-center mb-8">
        Last {QUEUE_SIZE} entries split the pot
      </p>

      <div className="bg-black/50 border border-green-500/30 rounded-xl p-4 sm:p-6 max-h-[500px] overflow-y-auto">
        {activeQueue.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No entries yet</p>
            <p className="text-gray-600 text-sm mt-2">Be the first to enter!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeQueue.map((item, displayIndex) => {
              const isCurrentUser =
                address && item.addr.toLowerCase() === address.toLowerCase();
              const position = activeQueue.length - displayIndex;

              return (
                <motion.div
                  key={`${item.addr}-${item.originalIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: displayIndex * 0.02, duration: 0.3 }}
                  className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all ${
                    isCurrentUser
                      ? 'bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/20'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Position number */}
                    <span
                      className={`font-mono font-bold text-base sm:text-lg min-w-[3rem] ${
                        isCurrentUser ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      #{position}
                    </span>

                    {/* Identity with avatar and name */}
                    <Identity
                      address={item.addr}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                      <div className="flex flex-col">
                        <Name className="text-white font-medium text-sm sm:text-base" />
                        <Address className="text-gray-500 text-xs font-mono" />
                      </div>
                    </Identity>
                  </div>

                  {/* Current user indicator */}
                  {isCurrentUser && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 font-bold text-sm sm:text-base animate-pulse flex items-center gap-1"
                    >
                      ← YOU
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Queue stats */}
      <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
        <span>
          <span className="text-green-400 font-bold">{activeQueue.length}</span> / {QUEUE_SIZE} spots filled
        </span>
        {address && (
          <span>
            {activeQueue.some(
              (item) => item.addr.toLowerCase() === address.toLowerCase()
            ) ? (
              <span className="text-green-400">✓ You&apos;re in the queue!</span>
            ) : (
              <span className="text-gray-400">You&apos;re not in the queue yet</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
