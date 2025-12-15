"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BackgroundCirclesProps {
    title?: string;
    description?: string;
    className?: string;
    variant?: keyof typeof COLOR_VARIANTS;
    actionLabel?: string;
    onAction?: () => void;
}

const COLOR_VARIANTS = {
    primary: {
        border: [
            "border-emerald-500/60",
            "border-cyan-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-emerald-500/30",
    },
    secondary: {
        border: [
            "border-violet-500/60",
            "border-fuchsia-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-violet-500/30",
    },
    tertiary: {
        border: [
            "border-orange-500/60",
            "border-yellow-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-orange-500/30",
    },
    quaternary: {
        border: [
            "border-purple-500/60",
            "border-pink-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-purple-500/30",
    },
    quinary: {
        border: [
            "border-red-500/60",
            "border-rose-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-red-500/30",
    }, // red
    senary: {
        border: [
            "border-blue-500/60",
            "border-sky-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-blue-500/30",
    }, // blue
    septenary: {
        border: [
            "border-gray-500/60",
            "border-gray-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-gray-500/30",
    },
    octonary: {
        border: [
            "border-red-500/60",
            "border-rose-400/50",
            "border-slate-600/30",
        ],
        gradient: "from-red-500/30",
    },
} as const;

const AnimatedGrid = () => (
    <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
        }}
    >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
    </motion.div>
);

export function BackgroundCircles({
    title,
    description,
    className,
    variant = "octonary",
    actionLabel,
    onAction,
}: BackgroundCirclesProps) {
    const variantStyles = COLOR_VARIANTS[variant];

    return (
        <div
            className={clsx(
                "relative flex h-screen w-full items-center justify-center overflow-hidden",
                "bg-black/5",
                className
            )}
        >
            <AnimatedGrid />
            <motion.div className="absolute h-[480px] w-[480px]">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={clsx(
                            "absolute inset-0 rounded-full",
                            "border-2 bg-gradient-to-br to-transparent",
                            variantStyles.border[i],
                            variantStyles.gradient
                        )}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05 + i * 0.05, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className={clsx(
                                "absolute inset-0 rounded-full mix-blend-screen",
                                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                                    "from-",
                                    ""
                                )}/10%,transparent_70%)]`
                            )}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="relative z-10 text-center hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {title && (
                    <h1
                        className={clsx(
                            "text-5xl font-bold tracking-tight md:text-7xl",
                            "text-white",
                            "drop-shadow-[0_0_32px_rgba(94,234,212,0.4)]"
                        )}
                    >
                        {title}
                    </h1>
                )}

                {actionLabel && (
                    <div className="mt-8">
                        <Button
                            variant="ghost"
                            className={clsx(
                                "text-5xl font-bold tracking-tight md:text-7xl",
                                "text-white hover:bg-transparent hover:text-white/90",
                                "h-auto p-0 cursor-pointer transition-transform hover:scale-105 duration-200",
                                "drop-shadow-[0_0_32px_rgba(94,234,212,0.4)]"
                            )}
                            onClick={onAction}
                        >
                            {actionLabel}
                        </Button>
                    </div>
                )}

                <motion.p
                    className="mt-6 text-lg md:text-xl text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {description}
                    <span className="mx-3 opacity-50">·</span>
                    Solana
                    <span className="mx-3 opacity-50"></span>
                
                </motion.p>

            </motion.div>

            <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0F766E/30%,transparent_70%)] blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2DD4BF/15%,transparent)] blur-[80px]" />
            </div>
        </div>
    );
}

export function DemoCircles() {
    const [currentVariant, setCurrentVariant] =
        useState<keyof typeof COLOR_VARIANTS>("octonary");

    const variants = Object.keys(
        COLOR_VARIANTS
    ) as (keyof typeof COLOR_VARIANTS)[];

    function getNextVariant() {
        const currentIndex = variants.indexOf(currentVariant);
        const nextVariant = variants[(currentIndex + 1) % variants.length];
        return nextVariant;
    }

    return (
        <>
            <BackgroundCircles variant={currentVariant} />
            <div className="absolute top-12 right-12">
                <button
                    type="button"
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-1 rounded-md z-10 text-sm font-medium"
                    onClick={() => {
                        setCurrentVariant(getNextVariant());
                    }}
                >
                    Change Variant
                </button>
            </div>
        </>
    );
}
