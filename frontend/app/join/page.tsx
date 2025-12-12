"use client";

import { useState } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinGamePage() {
    const [gameKey, setGameKey] = useState("");
    const router = useRouter();

    const handleJoin = () => {
        if (gameKey) {
            router.push(`/waiting/${gameKey}`);
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
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-indigo-500/20 rounded-xl"
                            onClick={handleJoin}
                        >
                            Join Game <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-white/5 py-2 rounded-lg">
                            <Wallet className="w-3 h-3" />
                            <span>Please connect your wallet first</span>
                        </div>

                    </div>
                </div>
{/* 
                <p className="text-gray-500 text-sm">
                    Don't have a game ID? <a href="/game" className="text-indigo-400 hover:text-indigo-300 hover:underline">Start a new game</a>
                </p> */}

            </div>
        </HeroGeometric>
    );
}
