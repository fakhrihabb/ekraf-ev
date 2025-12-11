'use client';

import { motion } from 'framer-motion';
import { Map, Brain, BarChart3, FileText } from 'lucide-react';

const benefits = [
    {
        icon: Map,
        title: 'Visualisasi Interaktif 2D & 3D',
        description: 'Jelajahi lokasi kandidat dengan peta interaktif dan tampilan 3D realistis untuk pemahaman konteks yang lebih baik.',
    },
    {
        icon: Brain,
        title: 'Analisis Berbasis AI',
        description: 'Dapatkan wawasan mendalam dengan teknologi Gemini AI yang menganalisis permintaan, aksesibilitas, dan kelayakan lokasi.',
    },
    {
        icon: BarChart3,
        title: 'Rekomendasi Berbasis Data',
        description: 'Keputusan didukung oleh data real-time dari Google Maps, POI, dan analisis grid untuk hasil yang akurat.',
    },
    {
        icon: FileText,
        title: 'Laporan Otomatis',
        description: 'Hasilkan laporan profesional siap pakai dalam format PDF untuk presentasi dan pengajuan proposal.',
    },
];

export default function WhySivana() {
    return (
        <section id="kenapa-sivana" className="section-padding bg-gray-50">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Kenapa <span className="gradient-text">SIVANA</span>?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Platform lengkap yang menyederhanakan proses perencanaan infrastruktur EV dengan teknologi terkini
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="glass-card p-8 text-center group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <benefit.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
