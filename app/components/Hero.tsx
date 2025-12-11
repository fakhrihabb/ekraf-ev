'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    const scrollToNext = () => {
        document.getElementById('kenapa-sivana')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-primary">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            SIVANA
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl md:text-2xl mb-8 text-white/90 font-bold"
                        >
                            Sistem Intelijen EV untuk Analitik Lokasi SPKLU dan SPBKLU Nasional
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg mb-10 text-white/80 max-w-xl"
                        >
                            Platform perencanaan berbasis AI yang membantu Anda menemukan, menganalisis, dan mengusulkan lokasi optimal untuk infrastruktur pengisian kendaraan listrik di seluruh Indonesia.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link
                                href="/intelligence-planner"
                                className="group px-8 py-4 bg-white text-[var(--color-blue)] rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
                            >
                                Coba Demo
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={scrollToNext}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-white/20 transition-all border border-white/30"
                            >
                                Selengkapnya
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="glass-card p-8 backdrop-blur-xl bg-white/10">
                            <div className="aspect-square bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center">
                                {/* Placeholder for hero image - you can replace with actual image */}
                                <div className="text-center text-white">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg
                                            className="w-16 h-16"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">Visualisasi Interaktif</p>
                                    <p className="text-sm text-white/70 mt-2">2D & 3D Maps</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="absolute -top-6 -right-6 glass-card p-4 bg-white"
                        >
                            <p className="text-sm text-gray-600">Waktu Analisis</p>
                            <p className="text-2xl font-bold text-[var(--color-blue)]">&lt; 15 min</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-white/70 cursor-pointer"
                    onClick={scrollToNext}
                >
                    <ChevronDown className="w-8 h-8" />
                </motion.div>
            </motion.div>
        </section>
    );
}
