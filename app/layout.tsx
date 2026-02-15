import type { Metadata } from 'next';
import { Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CodeLiveProvider } from '@/contexts/CodeLiveContext';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CRAai — Minimum unit. Maximum value.',
  description:
    'We build the operations layer for going public. AI runs the company. One CEO, no borders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen antialiased">
        <LanguageProvider>
          <CodeLiveProvider>{children}</CodeLiveProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
