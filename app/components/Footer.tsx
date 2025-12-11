'use client';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-dark-blue)] text-white py-12">
            <div className="container-custom">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-xl font-bold">SIVANA</span>
                        </div>
                        <p className="text-white/70 text-sm">
                            Sistem Intelijen EV untuk Analitik Lokasi SPKLU dan SPBKLU Nasional
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <a href="#kenapa-sivana" className="hover:text-white transition-colors">
                                    Kenapa SIVANA?
                                </a>
                            </li>
                            <li>
                                <a href="#cara-kerja" className="hover:text-white transition-colors">
                                    Cara Kerja
                                </a>
                            </li>
                            <li>
                                <a href="#hasil" className="hover:text-white transition-colors">
                                    Hasil SIVANA
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Informasi</h3>
                        <p className="text-sm text-white/70">
                            Powered by Google Cloud Platform
                        </p>
                        <p className="text-sm text-white/70 mt-2">
                            © 2025 SIVANA. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
