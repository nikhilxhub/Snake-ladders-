"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import { Users, ShieldCheck, Trophy, ArrowRight, Wallet, Lock, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-primary/30 flex justify-center overflow-x-hidden">

      {/* Global Background Grid (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black_70%,transparent_100%)]" />
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 w-full max-w-[1480px] border-x border-white/10 bg-black/40 min-h-screen shadow-2xl">



        <main className="flex flex-col items-center w-full pt-20">

          {/* --- HERO SECTION --- */}
          <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-4 text-center pb-20">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold tracking-wide uppercase mb-8 shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live on Solana Devnet
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1] font-heading">
                Stake, Roll, <span className="text-gradient">Win.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The future of Snakes & Ladders. Powered by Magic Blocks VRF for provably fair gameplay.
                <span className="text-white"> Winner takes all.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/game">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-md bg-white text-black hover:bg-zinc-200 transition-all transform hover:scale-105">
                    Play Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-md border-zinc-800 text-white hover:bg-zinc-900 backdrop-blur-sm">
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          </section>


          {/* --- HOW IT WORKS SECTION --- */}
          <section className="w-full px-6 py-24 relative border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Simple rules, complex strategies. Built for ease of use and total transparency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <FeatureCard
                icon={<Users className="w-8 h-8 text-primary" />}
                title="Unify Players"
                description="Join multiplayer rooms instantly via your Solana wallet. No sign-ups required."
              />
              <FeatureCard
                icon={<Wallet className="w-8 h-8 text-secondary" />}
                title="Stake Fees"
                description="Each roll requires a small stake, contributing directly to the winner's jackpot."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                title="Provably Fair"
                description="Magic Blocks VRF ensures every dice roll is cryptographically random and unverifiable."
              />
              <FeatureCard
                icon={<Trophy className="w-8 h-8 text-secondary" />}
                title="Winner Takes All"
                description="Reach the 100th square first to claim the entire accumulated prize pool."
              />
            </div>
          </section>


          {/* --- STRATEGIC TWIST SECTION --- */}
          <section className="w-full px-6 py-32 border-t border-white/5">
            <div className="glass-panel p-1 rounded-xl overflow-hidden max-w-7xl mx-auto">
              <div className="bg-[#111] rounded-lg grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                <div className="p-12 flex flex-col justify-center">
                  <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold mb-6 w-fit">
                    Strategic Gameplay
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 font-heading leading-tight">
                    Choose to Roll <br /> or <span className="text-purple-400">Wait.</span>
                  </h3>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    It's not just luck. In Stake & Ladders, you decide when to push your luck.
                    Sometimes waiting for others to trigger traps builds the jackpot for your victory.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span>Time your moves effectively</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <Activity className="w-5 h-5 text-secondary" />
                      <span>Watch opponent patterns</span>
                    </li>
                  </ul>
                </div>
                <div className="relative min-h-[400px] bg-gradient-to-br from-secondary/5 to-primary/5 flex items-center justify-center">
                  {/* Abstract visual for gameplay split */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfae967a5b?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

                  {/* Mock UI Elements */}
                  <div className="relative z-10 flex gap-8">
                    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                      <span className="text-4xl font-black text-gray-500">98</span>
                      <span className="text-xs uppercase tracking-widest text-gray-400">Waiting</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-black/80 border border-primary text-primary shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                      <span className="text-5xl font-black">30</span>
                      <span className="text-xs uppercase tracking-widest text-primary animate-pulse">Rolling...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- POOL & ESCROW SECTION --- */}
          <section className="w-full px-6 py-20 text-center relative overflow-hidden border-t border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <Lock className="w-16 h-16 text-white mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-6xl font-bold mb-8 font-heading">Secure Escrow System</h2>
              <p className="text-xl text-gray-400 mb-12">
                No hidden fees. No rug pulls. All gameplay funds are locked in auditable smart contracts until the game concludes.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Stat label="Total Volume" value="1,240 SOL" />
                <Stat label="Active Players" value="532" />
                <Stat label="Games Played" value="12k+" />
                <Stat label="Avg. Jackpot" value="4.5 SOL" />
              </div>
            </div>
          </section>

          {/* --- FOOTER --- */}
          <footer className="w-full border-t border-white/5 bg-black/50 backdrop-blur-lg mt-0">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="text-xl font-bold text-white font-heading">
                  Stake<span className="text-primary">&</span>Ladders
                </span>
                <p className="text-sm text-gray-500 mt-2">© 2024. Built with ❤️ on Solana.</p>
              </div>

              <div className="flex gap-8 text-sm text-gray-400">
                <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
                <Link href="#" className="hover:text-white transition-colors">Discord</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>

    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group p-8 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-white/[0.07]"
  >
    <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">{value}</span>
    <span className="text-sm text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);