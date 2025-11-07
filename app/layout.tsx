import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'A simple dashboard with a table',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="container py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
