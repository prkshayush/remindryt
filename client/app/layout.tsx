import type { Metadata } from "next";
import { Geist, Geist_Mono, Oregano } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/store/provider";
import { GroupAnalyticsProvider } from "@/context/AnalyticsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oreganoSans = Oregano({
  variable: "--font-oregano-sans",
  weight: '400',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RemindRyt",
  description: "We're here to help you avoid procrastination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oreganoSans.variable} antialiased`}
      >
        <ReduxProvider>
          <GroupAnalyticsProvider>
            {children}
          </GroupAnalyticsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
