'use client';

import { motion } from 'framer-motion';

interface CountdownTimerProps {
  timeRemaining: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
  urgent: boolean;
  critical: boolean;
}

/**
 * Individual time unit display (minutes or seconds)
 */
function TimeUnit({ value, label, urgent, critical }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-7xl sm:text-8xl lg:text-9xl font-black font-mono tabular-nums transition-colors ${
          critical
            ? 'text-red-400 animate-bounce'
            : urgent
              ? 'text-orange-400 animate-pulse'
              : 'text-green-400'
        }`}
      >
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm text-gray-500 uppercase mt-2 tracking-wider">
        {label}
      </span>
    </div>
  );
}

/**
 * Main countdown timer component displaying MM:SS format
 * Shows urgent state at < 10 minutes, critical at < 2 minutes
 * @param timeRemaining - Seconds remaining until game ends
 */
export function CountdownTimer({ timeRemaining }: CountdownTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Urgent if less than 10 minutes
  const isUrgent = timeRemaining < 600;
  // Critical if less than 2 minutes
  const isCritical = timeRemaining < 120;

  return (
    <div className="relative py-16 sm:py-20 bg-gradient-to-b from-black via-green-950/20 to-black overflow-hidden">
      {/* Animated background glow */}
      <div
        className={`absolute inset-0 blur-3xl transition-colors duration-500 ${
          isCritical
            ? 'animate-pulse bg-red-500/20'
            : isUrgent
              ? 'bg-orange-500/15'
              : 'bg-green-500/10'
        }`}
      />

      <div className="relative z-10 text-center px-4">
        <p className="text-gray-400 text-lg sm:text-xl mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Game Ends In
        </p>

        <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-8">
          <TimeUnit
            value={minutes}
            label="Minutes"
            urgent={isUrgent}
            critical={isCritical}
          />

          <span
            className={`text-7xl sm:text-8xl lg:text-9xl font-black transition-colors ${
              isCritical ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-green-500'
            }`}
          >
            :
          </span>

          <TimeUnit
            value={seconds}
            label="Seconds"
            urgent={isUrgent}
            critical={isCritical}
          />
        </div>

        {/* Warning messages */}
        {isCritical && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-red-400 text-2xl sm:text-3xl font-black animate-pulse"
          >
            🚨 LESS THAN 2 MINUTES! 🚨
          </motion.p>
        )}

        {isUrgent && !isCritical && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-orange-400 text-xl sm:text-2xl font-bold animate-pulse"
          >
            ⚠️ LESS THAN 10 MINUTES LEFT ⚠️
          </motion.p>
        )}

        {!isUrgent && (
          <p className="mt-8 text-gray-500 text-sm sm:text-base">
            Every transaction resets the 42-minute countdown
          </p>
        )}
      </div>
    </div>
  );
}
