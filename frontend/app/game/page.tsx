"use client";

import { BackgroundCircles } from "@/components/ui/background-circles";

export default function GamePage() {
  return (
    <div className="relative w-full h-screen">
      <BackgroundCircles
        actionLabel="Create Game"
        description="Stake, Roll, Win."
        variant="octonary"
      />
      {/* Add your game components here */}
    </div>
  );
}
