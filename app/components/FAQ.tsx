'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        question: 'Apa itu SIVANA?',
        answer: 'SIVANA (Sistem Intelijen EV untuk Analitik Lokasi SPKLU dan SPBKLU Nasional) adalah platform perencanaan berbasis web yang membantu stakeholder mengidentifikasi, menganalisis, dan mengusulkan lokasi optimal untuk infrastruktur pengisian kendaraan listrik di Indonesia.',
    },
    {
        question: 'Siapa yang bisa menggunakan SIVANA?',
        answer: 'SIVANA dirancang untuk perencana infrastruktur pemerintah, investor swasta, pengembang, koordinator regional, dan konsultan yang terlibat dalam perencanaan infrastruktur EV.',
    },
    {
        question: 'Apakah SIVANA gratis?',
        answer: 'Untuk versi MVP hackathon ini, SIVANA dapat diakses secara terbuka tanpa memerlukan registrasi atau login. Proyek disimpan di browser lokal Anda.',
    },
    {
        question: 'Data apa saja yang digunakan untuk analisis?',
        answer: 'SIVANA mengintegrasikan data dari Google Maps (POI, rute, jarak), data grid PLN (kapasitas), data populasi BPS, dan registrasi SPKLU/SPBKLU nasional untuk memberikan analisis komprehensif.',
    },
    {
        question: 'Berapa lama waktu yang dibutuhkan untuk menganalisis satu lokasi?',
        answer: 'Analisis satu lokasi biasanya selesai dalam waktu kurang dari 15 menit, termasuk perhitungan skor, rekomendasi AI, dan estimasi finansial.',
    },
    {
        question: 'Apakah saya bisa membandingkan beberapa lokasi sekaligus?',
        answer: 'Ya! Anda dapat menambahkan beberapa lokasi kandidat ke dalam satu Proyek dan membandingkannya secara side-by-side dengan tabel perbandingan dan grafik.',
    },
    {
        question: 'Format apa yang tersedia untuk laporan?',
        answer: 'Laporan dapat diekspor dalam format PDF yang profesional, lengkap dengan visualisasi peta, analisis, rekomendasi, dan estimasi finansial.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="section-padding bg-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Pertanyaan <span className="gradient-text">Umum</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Temukan jawaban untuk pertanyaan yang sering diajukan
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="glass-card overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-800 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[var(--color-blue)] flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? 'auto' : 0,
                                    opacity: openIndex === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
