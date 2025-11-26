'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

/**
 * Wagmi configuration for Base chain
 */
const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Send $1 or NGMI',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

/**
 * Props for the providers wrapper
 */
interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers for MiniKit, OnchainKit, Wagmi, and React Query
 * @param children - Child components to wrap
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'default',
              name: 'Send $1 or NGMI',
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
        >
          <MiniKitProvider>{children}</MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
