"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "@/utils/anchor-client";
import { toast } from "sonner";
import { BN } from "@coral-xyz/anchor";
import { Loader2 } from "lucide-react";

// Placeholder - User needs to replace this if using Devnet/Localnet with specific Queue
// For Devnet MagicBlock: often "A43DyUGA7s8eXPxqEjJY6EBu1KKbNgvxF8hef76skUpM" but varies.
// We'll use a dummy or try to parse from ENV if available.
// const ORACLE_QUEUE_PUBKEY = new PublicKey("A43DyUGA7s8eXPxqEjJY6EBu1KKbNgvxF8hef76skUpM"); // Old
const ORACLE_QUEUE_PUBKEY = new PublicKey("Cuj97ggrhhidhbu39TijNVqE74xvKJ69gDervRUXAxGh"); // Correct Devnet Queue from Screenshot

// Floating Paths Background Component
function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-white opacity-20"
                viewBox="0 0 696 316"
                fill="none"
            >
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export default function BoardPage() {
    const params = useParams();
    const gameId = params?.id as string;
    const router = useRouter();

    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { publicKey } = useWallet();

    const [gameAccount, setGameAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [diceValue, setDiceValue] = useState(0);

    // Fetch Game Data
    const fetchGameData = useCallback(async () => {
        if (!gameId || !anchorWallet) return;
        try {
            const program = getProgram(connection, anchorWallet);
            const acc = await program.account.game.fetch(new PublicKey(gameId));
            console.log("Game State:", acc);
            setGameAccount(acc);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    }, [gameId, anchorWallet, connection]);

    useEffect(() => {
        fetchGameData();
        const interval = setInterval(fetchGameData, 2000); // Fast polling for game actions
        return () => clearInterval(interval);
    }, [fetchGameData]);

    // Derived State
    const myIndex = useMemo(() => {
        if (!gameAccount || !publicKey) return -1;
        return gameAccount.players.findIndex((p: any) => p.toString() === publicKey.toString());
    }, [gameAccount, publicKey]);

    const isMyTurn = useMemo(() => {
        if (!gameAccount || myIndex === -1) return false;
        return gameAccount.currentTurnIndex === myIndex && !gameAccount.finished;
    }, [gameAccount, myIndex]);

    const currentTurnAddress = useMemo(() => {
        if (!gameAccount) return "...";
        const idx = gameAccount.currentTurnIndex;
        if (idx >= gameAccount.players.length) return "...";
        return gameAccount.players[idx].toString().slice(0, 4) + "..." + gameAccount.players[idx].toString().slice(-4);
    }, [gameAccount]);

    // Actions
    const handleRoll = async () => {
        if (!gameAccount || !anchorWallet || !publicKey) return;
        try {
            setIsLoading(true);
            const program = getProgram(connection, anchorWallet);
            const clientSeed = new BN(Math.floor(Math.random() * 1000000));

            const VRF_PROGRAM_ID = new PublicKey("7wcvxgGZi6b651YUoVM51sbbGRdg14CDRjqkq4SSYwFA");
            const SLOT_HASHES_PUBKEY = new PublicKey("SysvarS1otHashes111111111111111111111111111");
            const INSTRUCTIONS_SYSVAR_ID = new PublicKey("Sysvar1nstructions1111111111111111111111111");
            const VRF_IDENTITY = new PublicKey("9irBy75QS2BN81FUgXuHcjqceJJRuc9oDkAe8TKVvvAw");

            // ... (in handleRoll)

            const tx = await program.methods
                .requestRoll(clientSeed)
                .accounts({
                    player: publicKey,
                    game: new PublicKey(gameId),
                    oracleQueue: ORACLE_QUEUE_PUBKEY,
                    systemProgram: SystemProgram.programId,
                } as any)
                .remainingAccounts([
                    { pubkey: VRF_PROGRAM_ID, isWritable: false, isSigner: false },
                    { pubkey: SLOT_HASHES_PUBKEY, isWritable: false, isSigner: false },
                    { pubkey: INSTRUCTIONS_SYSVAR_ID, isWritable: false, isSigner: false },
                    { pubkey: VRF_IDENTITY, isWritable: false, isSigner: false }
                ])
                .rpc(); // Default: performs simulation (skipPreflight: false)

            console.log("Roll Requested:", tx);
            toast.success("Dice Roll Requested!");
            // setDiceValue(0); // Reset or show animation?
        } catch (e: any) {
            console.error("Roll Failed:", JSON.stringify(e, null, 2));
            console.error("Roll error raw:", e);
            toast.error("Roll failed: " + (e.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePass = async () => {
        if (!gameAccount || !anchorWallet || !publicKey) return;
        try {
            setIsLoading(true);
            const program = getProgram(connection, anchorWallet);
            const tx = await program.methods
                .passTurn()
                .accounts({
                    player: publicKey,
                    game: new PublicKey(gameId),
                } as any)
                .rpc({ skipPreflight: true });

            console.log("Turn Passed:", tx);
            toast.success("Turn Passed!");
        } catch (e: any) {
            console.error("Pass Failed:", e);
            toast.error("Pass failed: " + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Grid Mapping (ZigZag)
    const getGridNumber = (row: number, col: number) => {
        // Row 0 is Top (100..91), Row 9 is Bottom (1..10)
        // Wait, Snake and Ladders board usually starts 1 at BOTTOM LEFT.
        // Let's stick to standard 10x10 chart orientation.
        // Row 9 (bottom): 1 -> 10 (Left to Right)
        // Row 8: 20 <- 11 (Right to Left)
        // ...
        // Row 0 (top): 100 <- 91 (Right to Left) if odd parity blocks? 
        // Let's implement typical logic:

        // Let's use 0-indexed rows from Top (row 0) to Bottom (row 9)
        // Bottom Row (row 9): 1 to 10.
        // The previous code had it calculating. Let's reuse that logic but cleaner?
        // Actually, let's just generate the numbers and find where they map.
        return null; // Logic is inline below
    };

    // Generate grid numbers to render
    const gridCells = [];
    for (let row = 0; row < 10; row++) {
        const rowCells = [];
        for (let col = 0; col < 10; col++) {
            let cellNum;
            // Standard Board: Bottom Row is 1..10
            // Indexing row 0 as Top.
            // Row 9 (Bottom): 1, 2, 3... 
            // Row 0 (Top): 100, 99...

            // Inverted Row index for math: 0 is bottom, 9 is top
            const mathRow = 9 - row;

            if (mathRow % 2 === 0) {
                // Even math rows (0, 2..): 1-10, 21-30 -> Increasing
                cellNum = (mathRow * 10) + col + 1;
            } else {
                // Odd math rows (1, 3..): 20-11, 40-31 -> Decreasing
                cellNum = (mathRow * 10) + (10 - col);
            }
            rowCells.push(cellNum);
        }
        gridCells.push(...rowCells);
    }


    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-neutral-950" />
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <main className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">

                {/* Game Board Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-white/5 rounded-xl blur-sm opacity-20"></div>

                    <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] bg-neutral-900 rounded-sm shadow-2xl overflow-hidden border border-white/5">
                        <img
                            src="/BOARD.png"
                            alt="Snakes and Ladders Board"
                            className="absolute inset-0 w-full h-full object-fill opacity-95"
                        />

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                            {gridCells.map((num) => {
                                // Check if any player is here
                                const playersHere = gameAccount?.players.map((p: any, idx: number) => ({
                                    pubkey: p,
                                    idx,
                                    pos: gameAccount.positions[idx]
                                })).filter((p: any) => p.pos === num) || [];

                                return (
                                    <div
                                        key={num}
                                        id={`b${num}`}
                                        className="flex items-center justify-center border-[0.5px] border-white/5 relative bg-transparent"
                                    >
                                        {/* Render Players */}
                                        <div className="flex flex-wrap items-center justify-center gap-1">
                                            {playersHere.map((p: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[8px] md:text-[10px] font-bold text-black z-10
                                                        ${p.idx === 0 ? 'bg-red-500' :
                                                            p.idx === 1 ? 'bg-blue-500' :
                                                                p.idx === 2 ? 'bg-green-500' : 'bg-yellow-500'}
                                                    `}
                                                    title={p.pubkey.toString()}
                                                >
                                                    P{p.idx + 1}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Game Controls Panel - Minimalist */}
                <div className="w-full max-w-md flex flex-col gap-6">
                    <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-medium text-white tracking-tight">
                                Game Room
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Live</span>
                            </div>
                        </div>

                        {/* Turn Status */}
                        <div className="text-center mb-10">
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mb-4">Current Turn</p>
                            <div className="text-3xl font-light text-white flex flex-col items-center justify-center gap-2">
                                {isMyTurn ? (
                                    <span className="text-green-400 drop-shadow-sm animate-pulse font-bold">Your Turn</span>
                                ) : (
                                    <span className="text-zinc-500">Waiting for {currentTurnAddress}</span>
                                )}
                            </div>
                        </div>

                        {/* Dice Display - Monochrome */}
                        {/* <div className="flex justify-center mb-10">
                            <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
                                <span className="text-5xl font-light text-white">
                                    {diceValue > 0 ? diceValue : "-"}
                                </span>
                            </div>
                        </div> */}

                        {/* Actions - Clean White/Black */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="ghost"
                                onClick={handlePass}
                                disabled={!isMyTurn || isLoading}
                                className="w-full h-14 text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl transition-all"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Skip"}
                            </Button>

                            <Button
                                onClick={handleRoll}
                                disabled={!isMyTurn || isLoading}
                                className={`w-full h-14 font-semibold text-lg rounded-xl shadow-lg transition-all ${isMyTurn ? "bg-white hover:bg-zinc-200 text-black shadow-white/5" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"}`}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Roll Dice"}
                            </Button>
                        </div>
                    </div>

                    {/* Helper Text */}
                    <p className="text-center text-zinc-600 text-xs font-mono">
                        ID: {gameId.slice(0, 8)}...
                    </p>
                </div>

            </main>
        </div>
    );
}