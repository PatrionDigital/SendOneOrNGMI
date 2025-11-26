import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/providers/MiniKitProvider';
import './globals.css';
import '@coinbase/onchainkit/styles.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Send $1 or NGMI',
  description:
    'Last 100 people to send $1 split the pot when timer expires. Every transaction resets the countdown. Pure chaos.',
  openGraph: {
    title: 'Send $1 or NGMI',
    description:
      'Last 100 people to send $1 split the pot when timer expires. Every transaction resets the countdown. Pure chaos.',
    images: [`${appUrl}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send $1 or NGMI',
    description:
      'Last 100 people to send $1 split the pot when timer expires. Every transaction resets the countdown. Pure chaos.',
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${appUrl}/og-image.png`,
  },
};

/**
 * Root layout component wrapping the entire application
 * @param children - Page content
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
