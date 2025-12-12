"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";


import { FloatingPaths } from "@/components/ui/floating-paths";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Share2,
  Play,
  Wallet,
  Users,
  Trophy,
  Clock,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
const MOCK_PLAYERS = [
  {
    address: "8KXTG...vRFy",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
    balance: "145.2 SOL",
    isCreator: true,
    status: "Ready"
  },
  {
    address: "9irBy...KvAw",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100",
    balance: "12.5 SOL",
    isCreator: false,
    status: "Ready"
  },
  {
    address: "DzX7...mK9s",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&h=100",
    balance: "8.4 SOL",
    isCreator: false,
    status: "Joining..."
  }
];

export default function WaitingRoomPage() {
  const params = useParams();
  const gameId = params?.id as string || "Unknown Game";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-primary/30 flex justify-center overflow-x-hidden">


      <div className="fixed inset-0 z-0">
       
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1480px] flex flex-col items-center pt-24 pb-12 px-4">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wide uppercase mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Waiting for Players
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-heading mb-6 tracking-tight">
            Game Room <span className="text-red-500">#{gameId.slice(0, 4)}</span>
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-mono text-sm">
              <span className="truncate max-w-[200px]">{gameId}</span>
              <button onClick={handleCopy} className="hover:text-white transition-colors">
                {copied ? <ShieldCheck className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 hover:bg-white/5">
              <Share2 className="w-4 h-4 mr-2" /> Share Link
            </Button>
          </div>
        </motion.div>

        {/* Game Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12"
        >
          <StatCard icon={<Wallet className="text-secondary" />} label="Entry Fee" value="0.5 SOL" />
          <StatCard icon={<Trophy className="text-primary" />} label="Pot Size" value="1.5 SOL" />
          <StatCard icon={<Users className="text-blue-400" />} label="Players" value="3 / 4" />
          <StatCard icon={<Clock className="text-orange-400" />} label="Est. Duration" value="15 Min" />
        </motion.div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl">

          {/* Player List Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-heading">Lobby</h3>
                <span className="text-sm text-gray-500">Waiting for 1 more player...</span>
              </div>

              <div className="space-y-3">
                {MOCK_PLAYERS.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={player.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white/10" />
                        {player.isCreator && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-full border border-black">HOST</div>
                        )}
                      </div>
                      <div>
                        <div className="font-mono text-sm text-white font-bold">{player.address}</div>
                        <div className="text-xs text-gray-500">Balance: {player.balance}</div>
                      </div>
                    </div>

                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${player.status === 'Ready'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                      {player.status}
                    </div>
                  </div>
                ))}

                {/* Empty Slot Placeholder */}
                <div className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/5 h-[80px] text-gray-600">
                  <span className="animate-pulse">Waiting for player to join...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action / Loader Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Status Card */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
             
              <h3 className="text-2xl font-bold font-heading mb-2">Game Starting Soon</h3>
              <p className="text-gray-400 text-sm mb-8">
                The game will begin automatically once the lobby is full or the host starts it manually.
              </p>

              {/* Creator Controls (Mock) */}
              <div className="w-full space-y-3">
                <Button className="w-full h-12 text-lg font-bold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,157,0.3)]">
                  <Play className="w-5 h-5 mr-2" /> Start Game Now
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Only the host can start early.
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> VRF Secured
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dice rolls in this room are generated using Magic Blocks VRF on Solana, ensuring 100% provable fairness.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5">
    <div className="mb-2 opacity-80">{icon}</div>
    <div className="text-xl font-bold font-heading">{value}</div>
    <div className="text-xs text-gray-500 uppercase tracking-widest">{label}</div>
  </div>
);