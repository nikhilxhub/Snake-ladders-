"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Home, Menu, Trophy, Gamepad2, Plus, Wallet, Settings, LogOut, Copy, Check, BookOpen } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { VerticalNav } from "@/components/ui/navbars";
import { usePathname } from "next/navigation";

export function FloatingNavbar() {
    const pathname = usePathname();
    const { connected, publicKey, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = React.useState(false);

    // Do not show on landing page "/" or home page "/home"
    if (pathname === "/" || pathname === "/home") return null;

    const copyAddress = async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey.toBase58());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <nav className="pointer-events-auto flex items-center justify-center space-x-2 md:space-x-4 rounded-full border bg-background/80 backdrop-blur-md p-2 shadow-lg border-white/10">

                {/* <Link href="/game">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Home</span>
                    </Button>
                </Link> */}

                <Link href="/join">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Join Game</span>
                    </Button>
                </Link>

                <Link href="/claim">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Trophy className="h-5 w-5" />
                        <span className="sr-only">Claim Prize</span>
                    </Button>
                </Link>

                {/* Play Button - Prominent */}
                <Link href="/game">
                    <Button
                        size="icon"
                        className="rounded-full bg-primary text-black hover:bg-primary/90 h-12 w-12 -mt-6 shadow-xl border-4 border-background"
                    >
                        <Gamepad2 className="h-6 w-6" />
                        <span className="sr-only">Play</span>
                    </Button>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <BookOpen className="h-5 w-5" />
                            <span className="sr-only">How to Play</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[350px] bg-neutral-900 border-r border-white/10 text-white p-6 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <SheetTitle className="text-2xl font-bold text-emerald-400 mb-2">How to Play</SheetTitle>
                                <SheetDescription className="text-zinc-400 text-sm">Welcome to Web3 Snakes & Ladders!</SheetDescription>
                            </div>

                            <div className="space-y-4">
                                <section>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-2">
                                        <Gamepad2 className="w-4 h-4 text-emerald-500" />
                                        Basics
                                    </h3>
                                    <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1 ml-1">
                                        <li>Join a game or create a new one.</li>
                                        <li>Each game has an <strong>Entry Fee</strong> and <strong>Roll Fee</strong>.</li>
                                        <li>Fees go into the <strong>Pot</strong>.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-2">
                                        <Plus className="w-4 h-4 text-blue-500" />
                                        Movement
                                    </h3>
                                    <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1 ml-1">
                                        <li>Roll the dice when it's your turn.</li>
                                        <li><strong>Ladders</strong> boost you up! 🚀</li>
                                        <li><strong>Snakes</strong> slide you down! 🐍</li>
                                        <li>First to reach <strong>Tile 100</strong> wins!</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        Winning
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        The winner takes the <strong>Entire Pot</strong>!
                                        Once the game ends, click "Claim Prize" to withdraw your winnings to your wallet.
                                    </p>
                                </section>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-zinc-600 text-center">
                                    Powered by Solana & Anchor
                                </p>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>



                {/* Wallet Button Refactored */}
                {!connected ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/10"
                        onClick={() => setVisible(true)}
                    >
                        <Wallet className="h-5 w-5" />
                        <span className="sr-only">Connect Wallet</span>
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 relative">
                                <Wallet className="h-5 w-5 text-primary" />
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="sr-only">Wallet Options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" side="top" className="mb-4 bg-[#111] border-[#222] min-w-[200px]">
                            <DropdownMenuLabel className="text-xs text-gray-500 font-mono">
                                {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                                className="focus:bg-white/10 cursor-pointer"
                                onClick={copyAddress}
                            >
                                {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Address"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="focus:bg-white/10 cursor-pointer text-red-500 focus:text-red-400"
                                onClick={disconnect}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Disconnect
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Mobile Menu / More */}
                {/* <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0 bg-background/95 backdrop-blur-xl border-r border-white/10">
                        <VerticalNav />
                    </SheetContent>
                </Sheet> */}

            </nav>
        </div>
    );
}
