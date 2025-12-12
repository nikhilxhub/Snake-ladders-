"use client"
import { useState } from "react";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { ContactCard } from "@/components/ui/contact-card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Coins, ShieldCheck, Trophy, Zap, XIcon } from "lucide-react";

import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export default function GamePage() {
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const { connected } = useWallet();

  const handleCreateGame = () => {
    if (!connected) {
      toast.error("Connect wallet first to create game");
      return;
    }
    setIsCreateGameOpen(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BackgroundCircles
        actionLabel="Create Game"
        onAction={handleCreateGame}
        description="Stake, Roll, Win."
        variant="octonary"
      />

      {isCreateGameOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-5xl relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white rounded-full hover:bg-white/20 hover:text-red-500 transition-colors"
              onClick={() => setIsCreateGameOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
            <ContactCard
              title="Create Game Room"
              description="Simple rules, complex strategies. Built for ease of use and total transparency."
              className="bg-background/95 backdrop-blur shadow-2xl"
              contactInfo={[
                {
                  icon: Users,
                  label: 'Unify Players',
                  value: 'Join multiplayer rooms instantly via your Solana wallet.',
                },
                {
                  icon: Coins,
                  label: 'Stake Fees',
                  value: 'Each roll requires a small stake, contributing to the jackpot.',
                },
                {
                  icon: ShieldCheck,
                  label: 'Provably Fair',
                  value: 'Magic Blocks VRF ensures every roll is cryptographically random.',
                },
                {
                  icon: Trophy,
                  label: 'Winner Takes All',
                  value: 'Reach the 100th square first to claim the entire prize pool.',
                },
                {
                  icon: Zap,
                  label: 'Network',
                  value: 'Powered by Solana Devnet.',
                  className: 'col-span-2 md:col-span-1',
                }
              ]}
            >
              <form className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Room Name</Label>
                  <Input type="text" placeholder="e.g. Friday Night Game" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Entry Fee (SOL)</Label>
                  <Input type="number" placeholder="0.1" step="0.01" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price Per Roll (SOL)</Label>
                  <Input type="number" placeholder="0.01" step="0.001" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Max Players</Label>
                  <Input type="number" placeholder="4" max="4" min="2" />
                </div>
                <Button className="w-full h-12 text-lg" type="submit">
                  Create Game
                </Button>
              </form>
            </ContactCard>
          </div>
        </div>
      )}

      {/* Add your game components here */}
    </div>
  );
}
