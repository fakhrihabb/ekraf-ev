'use client';

import { motion } from 'framer-motion';
import { X, Check, Clock, TrendingUp, FileText, Zap } from 'lucide-react';

const beforeItems = [
    { icon: Clock, text: 'Analisis manual memakan waktu berhari-hari' },
    { icon: X, text: 'Data tersebar di berbagai sumber' },
    { icon: X, text: 'Sulit membandingkan lokasi kandidat' },
    { icon: X, text: 'Laporan dibuat manual dengan Excel' },
    { icon: X, text: 'Tidak ada visualisasi 3D' },
    { icon: X, text: 'Keputusan berdasarkan intuisi' },
];

const afterItems = [
    { icon: Zap, text: 'Analisis selesai dalam 15 menit' },
    { icon: Check, text: 'Data terintegrasi dari Google Cloud' },
    { icon: Check, text: 'Perbandingan lokasi side-by-side' },
    { icon: Check, text: 'Laporan PDF otomatis & profesional' },
    { icon: Check, text: 'Visualisasi 2D & 3D interaktif' },
    { icon: Check, text: 'Rekomendasi berbasis AI & data' },
];

export default function Results() {
    return (
        <section id="hasil" className="section-padding bg-gray-50">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Hasil <span className="gradient-text">SIVANA</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transformasi dari perencanaan tradisional ke perencanaan berbasis AI
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Before Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card p-8 border-2 border-red-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Sebelum SIVANA</h3>
                                <p className="text-sm text-gray-600">Perencanaan Tradisional</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {beforeItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50"
                                >
                                    <item.icon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-red-100 rounded-lg">
                            <p className="text-sm font-semibold text-red-800">
                                ⏱️ Waktu rata-rata: 2-3 hari per lokasi
                            </p>
                        </div>
                    </motion.div>

                    {/* After Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card p-8 border-2 border-green-200 relative overflow-hidden"
                    >
                        {/* Shine effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/50 to-transparent rounded-full blur-3xl"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Dengan SIVANA</h3>
                                <p className="text-sm text-gray-600">Perencanaan Modern</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {afterItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-green-50"
                                >
                                    <item.icon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg relative z-10">
                            <p className="text-sm font-semibold text-green-800">
                                ⚡ Waktu rata-rata: &lt; 15 menit per lokasi
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                Hemat 95% waktu perencanaan!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
