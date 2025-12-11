'use client';

import { motion } from 'framer-motion';
import { Search, Lightbulb, Save, FileCheck } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Search,
        title: 'Eksplorasi Lokasi',
        description: 'Gunakan Intelligence Planner untuk menjelajahi peta 2D/3D, melihat SPKLU/SPBKLU yang ada, dan menambahkan lokasi kandidat.',
    },
    {
        number: '02',
        icon: Lightbulb,
        title: 'Analisis AI',
        description: 'Sistem menganalisis permintaan, aksesibilitas, kesiapan grid, dan kompetisi. AI Gemini memberikan wawasan mendalam.',
    },
    {
        number: '03',
        icon: Save,
        title: 'Simpan Proyek',
        description: 'Simpan lokasi yang menjanjikan ke dalam Proyek untuk perbandingan dan dokumentasi lebih lanjut.',
    },
    {
        number: '04',
        icon: FileCheck,
        title: 'Buat Laporan',
        description: 'Hasilkan laporan profesional dengan satu klik, lengkap dengan visualisasi, analisis, dan rekomendasi.',
    },
];

export default function HowItWorks() {
    return (
        <section id="cara-kerja" className="section-padding bg-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Bagaimana <span className="gradient-text">Cara Kerjanya</span>?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Proses sederhana dari eksplorasi hingga laporan final
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-light-blue)] -translate-y-1/2 opacity-20"></div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="relative"
                            >
                                <div className="glass-card p-8 h-full">
                                    {/* Step Number */}
                                    <div className="text-6xl font-bold text-[var(--color-light-blue)]/20 mb-4">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-light-blue)] flex items-center justify-center">
                                        <step.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow for desktop */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--color-light-blue)] flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-[var(--color-light-blue)]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
