"use client"
import { useState } from "react";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { ContactCard } from "@/components/ui/contact-card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Coins, ShieldCheck, Trophy, Zap, XIcon, Loader2 } from "lucide-react";

import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getProgram, getGamePDA, PROGRAM_ID } from "@/utils/anchor-client";
import { BN } from "@coral-xyz/anchor";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function GamePage() {
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { connected, publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const router = useRouter();

  // Form States
  const [entryFee, setEntryFee] = useState("0.1");
  const [rollFee, setRollFee] = useState("0.01");
  const [maxPlayers, setMaxPlayers] = useState("2");


  const handleOpenCreateGame = () => {
    if (!connected) {
      toast.error("Connect wallet first to create game");
      return;
    }
    setIsCreateGameOpen(true);
  };

  const handleCreateGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet || !publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Initializing Program...");
      console.log("Connection Endpoint:", connection.rpcEndpoint);

      const program = getProgram(connection, anchorWallet);
      console.log("Program ID:", program.programId.toBase58());

      // 1. Generate Random Game ID (32 bytes)
      const gameId = new Uint8Array(32);
      crypto.getRandomValues(gameId);
      const gameIdArray = Array.from(gameId);
      console.log("Generated Game ID:", gameIdArray);

      // 2. Prepare Arguments
      const entryFeeLamports = new BN(parseFloat(entryFee) * LAMPORTS_PER_SOL);
      const rollFeeLamports = new BN(parseFloat(rollFee) * LAMPORTS_PER_SOL);
      const maxPlayersNum = parseInt(maxPlayers);

      // 3. Find PDA
      const [gamePda] = getGamePDA(publicKey, gameIdArray);
      console.log("Game PDA:", gamePda.toBase58());

      // 4. Send Transaction
      // Explicitly passing all accounts and chaining joinGame to ensure creator joins immediately
      const joinIx = await program.methods
        .joinGame()
        .accounts({
          player: publicKey,
          game: gamePda,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const tx = await program.methods
        .createGame(gameIdArray, maxPlayersNum, entryFeeLamports, rollFeeLamports)
        .accounts({
          creator: publicKey,
          game: gamePda,
          systemProgram: SystemProgram.programId,
        } as any)
        .postInstructions([joinIx])
        .rpc({ skipPreflight: true });

      console.log("Game created & joined tx:", tx);
      toast.success("Game created and joined successfully!");

      // 5. Redirect to Waiting Room
      // 5. Redirect to Waiting Room
      // Redirect using PDA so Waiting Room can easily fetch account
      router.push(`/waiting/${gamePda.toBase58()}`);

    } catch (error: any) {
      console.error("Error creating game:", error);
      // Detailed error logging
      if (error.logs) {
        console.error("Transaction Logs:", error.logs);
      }
      toast.error("Failed to create game: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BackgroundCircles
        actionLabel="Create Game"
        onAction={handleOpenCreateGame}
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
              <form onSubmit={handleCreateGameSubmit} className="w-full space-y-4">
                {/* <div className="flex flex-col gap-2">
                  <Label>Room Name</Label>
                  <Input type="text" placeholder="e.g. Friday Night Game" />
                </div> */}
                <div className="flex flex-col gap-2">
                  <Label>Entry Fee (SOL)</Label>
                  <Input
                    type="number"
                    placeholder="0.1"
                    step="0.01"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price Per Roll (SOL)</Label>
                  <Input
                    type="number"
                    placeholder="0.01"
                    step="0.001"
                    value={rollFee}
                    onChange={(e) => setRollFee(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Max Players</Label>
                  <Input
                    type="number"
                    placeholder="4"
                    max="4"
                    min="2"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full h-12 text-lg" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating on Blockchain...
                    </>
                  ) : (
                    "Create Game"
                  )}
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
