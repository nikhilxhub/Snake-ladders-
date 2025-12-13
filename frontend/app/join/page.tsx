"use client";

import { useState } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Gamepad2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "@/utils/anchor-client";
import { toast } from "sonner";

export default function JoinGamePage() {
    const [gameKey, setGameKey] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter();

    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { connected, publicKey } = useWallet();

    const handleJoin = async () => {
        if (!connected || !publicKey || !anchorWallet) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!gameKey) {
            toast.error("Please enter a game address");
            return;
        }

        try {
            // Validate Public Key
            let gamePubkey: PublicKey;
            try {
                gamePubkey = new PublicKey(gameKey);
            } catch (e) {
                toast.error("Invalid Game Address format");
                return;
            }

            setIsJoining(true);
            const program = getProgram(connection, anchorWallet);

            console.log("Joining Game:", gamePubkey.toBase58());

            const tx = await program.methods
                .joinGame()
                .accounts({
                    player: publicKey,
                    game: gamePubkey,
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc({ skipPreflight: true }); // Skip preflight on localnet to avoid simulation errors

            console.log("Join Transaction:", tx);
            toast.success("Joined game successfully!");

            // Redirect to waiting room
            router.push(`/waiting/${gamePubkey.toBase58()}`);

        } catch (error: any) {
            console.error("Join Error:", error);
            toast.error("Failed to join: " + (error.message || "Unknown error"));
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <HeroGeometric
            badge="Join & Play"
            title1="Enter The"
            title2="Arena"
        >
            <div className="w-full max-w-md mx-auto space-y-8 mt-4">

                {/* Form Container */}
                <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="bg-black/40 rounded-xl p-8 space-y-6">

                        <div className="space-y-2 text-left">
                            <label className="text-sm font-medium text-gray-300 ml-1">Game Public Key</label>
                            <div className="relative">
                                <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                    placeholder="Enter game address..."
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-offset-0 rounded-xl"
                                    value={gameKey}
                                    onChange={(e) => setGameKey(e.target.value)}
                                    disabled={isJoining}
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-indigo-500/20 rounded-xl"
                            onClick={handleJoin}
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Join Game <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </Button>

                        {!connected && (
                            <div className="flex items-center justify-center gap-2 text-xs text-red-400 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                <Wallet className="w-3 h-3" />
                                <span>Please connect your wallet first</span>
                            </div>
                        )}

                        {connected && (
                            <div className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                                <Wallet className="w-3 h-3" />
                                <span>Wallet Connected</span>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </HeroGeometric>
    );
}
