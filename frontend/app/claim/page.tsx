"use client";

import { useState } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Trophy, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "@/utils/anchor-client";
import { toast } from "sonner";
import { BN } from "@coral-xyz/anchor";

export default function ClaimPrizePage() {
    const [gameKey, setGameKey] = useState("");
    const [status, setStatus] = useState<"idle" | "checking" | "winner" | "loser" | "error">("idle");
    const [gameAccount, setGameAccount] = useState<any>(null);
    const [isClaiming, setIsClaiming] = useState(false);
    const router = useRouter();

    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { connected, publicKey } = useWallet();

    const checkWinner = async () => {
        if (!connected || !publicKey || !anchorWallet) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!gameKey) {
            toast.error("Please enter a game address");
            return;
        }

        try {
            setStatus("checking");
            const program = getProgram(connection, anchorWallet);

            let gamePubkey: PublicKey;
            try {
                gamePubkey = new PublicKey(gameKey);
            } catch (e) {
                toast.error("Invalid Game Address");
                setStatus("error");
                return;
            }

            const acc = await program.account.game.fetch(gamePubkey);
            console.log("Game State:", acc);
            setGameAccount(acc);

            // Check if game is finished
            // Note: Check enum/structure. In IDL state is enum { created, started, finished }
            // In JS client, enums are often object keys like { finished: {} } or strings depending on version.
            // Using logic from page.tsx: acc.finished (boolean) is simpler if available.
            // Looking at IDL, `finished` is a boolean field.

            if (!acc.finished) {
                toast.error("Game is not finished yet!");
                setStatus("error");
                return;
            }

            if (acc.winner && acc.winner.toString() === publicKey.toString()) {
                setStatus("winner");
                toast.success("You are the winner!");
            } else {
                setStatus("loser");
                toast.error("You are not the winner.");
            }

        } catch (error: any) {
            console.error("Fetch Error:", error);
            toast.error("Error fetching game: " + error.message);
            setStatus("error");
        }
    };

    const handleClaim = async () => {
        if (!gameAccount || !publicKey || !anchorWallet) return;

        try {
            setIsClaiming(true);
            const program = getProgram(connection, anchorWallet);

            const tx = await program.methods
                .claimPrize()
                .accounts({
                    winner: publicKey,
                    game: new PublicKey(gameKey),
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc({ skipPreflight: true });

            console.log("Claim Tx:", tx);
            toast.success("Prize Claimed Successfully!");

            // Allow time for toast
            setTimeout(() => {
                router.push("/game");
            }, 2000);

        } catch (error: any) {
            console.error("Claim Error:", error);
            toast.error("Claim failed: " + error.message);
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <HeroGeometric
            badge="Rewards"
            title1="Claim Your"
            title2="Victory"
        >
            <div className="w-full max-w-md mx-auto space-y-8 mt-4">

                {/* Form Container */}
                <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="bg-black/40 rounded-xl p-8 space-y-6">

                        {/* Input Phase */}
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-medium text-gray-300 ml-1">Game Public Key</label>
                            <div className="relative">
                                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                                <Input
                                    placeholder="Enter game address..."
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                                    value={gameKey}
                                    onChange={(e) => {
                                        setGameKey(e.target.value);
                                        setStatus("idle"); // Reset status on edit
                                    }}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {status !== "winner" && (
                            <Button
                                className="w-full h-12 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl"
                                onClick={checkWinner}
                                disabled={status === "checking" || !connected}
                            >
                                {status === "checking" ? <Loader2 className="animate-spin" /> : <>Check Winner <Search className="ml-2 w-4 h-4" /></>}
                            </Button>
                        )}

                        {/* Winner View */}
                        {status === "winner" && gameAccount && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-emerald-400">Congratulations!</h3>
                                    <p className="text-sm text-gray-400">You won this game.</p>
                                    <div className="text-3xl font-mono text-white">
                                        {(gameAccount.totalPot.toNumber() / 1e9).toFixed(4)} <span className="text-emerald-500 text-lg">SOL</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20 rounded-xl"
                                    onClick={handleClaim}
                                    disabled={isClaiming}
                                >
                                    {isClaiming ? <Loader2 className="animate-spin" /> : "Claim Prize Now"}
                                </Button>
                            </div>
                        )}

                        {/* Loser View */}
                        {status === "loser" && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 text-sm">
                                This wallet is not recorded as the winner of this game.
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </HeroGeometric>
    );
}
