'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
    return (
        <section className="section-padding gradient-primary relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Mulai Gratis Sekarang</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        Siap Mencoba SIVANA?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
                    >
                        Percepat perencanaan infrastruktur EV Anda dengan analisis berbasis AI dan visualisasi interaktif
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="/intelligence-planner"
                            className="group px-10 py-5 bg-white text-[var(--color-blue)] rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-white/90 transition-all hover:scale-105 shadow-2xl"
                        >
                            Mulai Analisis Sekarang
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#kenapa-sivana"
                            className="px-10 py-5 bg-transparent text-white rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-white/10 transition-all"
                        >
                            Pelajari Lebih Lanjut
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                &lt; 15
                            </div>
                            <div className="text-sm text-white/80">Menit per Analisis</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                100%
                            </div>
                            <div className="text-sm text-white/80">Berbasis Data</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                AI
                            </div>
                            <div className="text-sm text-white/80">Powered by Gemini</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
