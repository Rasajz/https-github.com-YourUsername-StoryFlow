import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoryProvider } from "../context/StoryContext";
import { ToastNotification } from "../components/modals/ToastNotification";
import { CommandPalette } from "../components/modals/CommandPalette";
import { GoogleAccountModal } from "../components/modals/GoogleAccountModal";
import { ProjectSwitcherModal } from "../components/modals/ProjectSwitcherModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryFlow - Visual Workspace for Filmmakers & Storytellers",
  description: "Go from random ideas to visual story planning to professional screenplay writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0D11] text-gray-100 font-sans selection:bg-amber-500/30 selection:text-white">
        <StoryProvider>
          {children}
          <ToastNotification />
          <CommandPalette />
          <GoogleAccountModal />
          <ProjectSwitcherModal />
        </StoryProvider>
      </body>
    </html>
  );
}
