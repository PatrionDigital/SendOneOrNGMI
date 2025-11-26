'use client';

import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { QUEUE_SIZE } from '@/lib/contract';

interface PotStatsProps {
  potValue: bigint;
  totalEntries: bigint;
  estimatedPayout: bigint;
}

/**
 * Displays pot statistics including total value, entries, and estimated payout
 * @param potValue - Total pot value in wei
 * @param totalEntries - Total number of entries
 * @param estimatedPayout - Estimated payout per winner in wei
 */
export function PotStats({ potValue, totalEntries, estimatedPayout }: PotStatsProps) {
  const potEth = potValue ? formatEther(potValue) : '0';
  const payoutEth = estimatedPayout ? formatEther(estimatedPayout) : '0';
  const entriesNum = totalEntries ? Number(totalEntries) : 0;

  // Calculate approximate USD value (assuming ~$2500/ETH for display)
  const ethPrice = 2500;
  const potUsd = (parseFloat(potEth) * ethPrice).toFixed(2);
  const payoutUsd = (parseFloat(payoutEth) * ethPrice).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Pot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/30 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            💰 Total Pot
          </p>
          <p className="text-3xl sm:text-4xl font-black text-green-400 font-mono">
            {parseFloat(potEth).toFixed(4)} ETH
          </p>
          <p className="text-gray-500 text-sm mt-1">≈ ${potUsd}</p>
        </motion.div>

        {/* Total Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-700/50 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            📈 Total Entries
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono">
            {entriesNum.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Last {QUEUE_SIZE} win
          </p>
        </motion.div>

        {/* Payout Per Winner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/30 border border-yellow-500/30 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            🏆 Payout Per Winner
          </p>
          <p className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono">
            {parseFloat(payoutEth).toFixed(4)} ETH
          </p>
          <p className="text-gray-500 text-sm mt-1">≈ ${payoutUsd} each</p>
        </motion.div>
      </div>
    </div>
  );
}
