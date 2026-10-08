import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Waste Collection Admin',
  description: 'Operational feed of completed waste collections',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
