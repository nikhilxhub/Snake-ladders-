"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Menu, Users, Gamepad2, PlayCircle, Trophy } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from 'next/link';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center space-x-2 group">
  
                    <span className="text-xl font-bold tracking-tight text-white font-heading">
                        Stake<span className="text-primary">&</span>Ladders
                    </span>
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
                <NavLink href="/home" label="Home" />
                <NavLink href="/game" label="Play" />
                <NavLink href="/join" label="Join Game" />
            </div>

            <div className="flex items-center gap-4">
                {/* Custom styling for Wallet Button handled via CSS overrides or inline styles due to library constraints */}
                <div className="hidden md:block">
                    <WalletMultiButton style={{
                        height: '42px',
                        borderRadius: '0.375rem',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        fontFamily: 'var(--font-heading)',
                    }} />
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[220px] bg-[#111] border-[#222] text-white">
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer">
                                <Home className="mr-2 h-4 w-4" />
                                Home
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Play
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer">
                                <Users className="mr-2 h-4 w-4" />
                                Leaderboard
                            </DropdownMenuItem>
                            <div className="p-2">
                                <WalletMultiButton style={{
                                    width: '100%',
                                    height: '36px',
                                    borderRadius: '0.5rem',
                                    fontSize: '13px',
                                    backgroundImage: 'linear-gradient(135deg, #00FF9D 0%, #9D00FF 100%)',
                                    justifyContent: 'center',
                                    color: '#000'
                                }} />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className="text-sm font-medium text-gray-400 hover:text-primary transition-colors relative group"
    >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
)
