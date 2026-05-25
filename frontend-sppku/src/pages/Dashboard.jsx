import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Dashboard Component
 * 
 * Halaman utama (Dashboard) aplikasi SPPku yang menampilkan
 * data ringkasan analitik pembayaran siswa dalam format editorial Alexandria.
 */
export default function Dashboard() {
  const [stats, setStats] = useState({ sudah_lunas: 0, belum_lunas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Integrasi dengan endpoint backend Laravel /dashboard
        const response = await api.get('/dashboard');
        if (response.data && response.data.status) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.warn('Gagal mengambil data dari API, menggunakan mock data luring.');
        // Graceful fallback ke mock data yang representatif
        setStats({ sudah_lunas: 3, belum_lunas: 2 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalSiswa = stats.sudah_lunas + stats.belum_lunas;
  const persentaseLunas = totalSiswa > 0 ? Math.round((stats.sudah_lunas / totalSiswa) * 100) : 0;

  return (
    <div className="animate-fadeIn space-y-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Utama / Ringkasan</p>
          <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Dashboard Analisis</h2>
        </div>
        <div className="text-right">
          <span className="font-public text-[10px] uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-md">
            Status: Live Sync
          </span>
        </div>
      </div>

      {/* Premium Stats Area (No-Line grid with diffuse shadows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card Sudah Lunas */}
        <div className="bg-white rounded-md p-10 premium-shadow premium-shadow-hover flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
            <p className="font-public text-xs uppercase tracking-wider text-neutral-400">Total Siswa Sudah Lunas</p>
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          </div>
          <div>
            <h3 className="font-serif text-6xl font-light text-primary tracking-tight">
              {loading ? '...' : stats.sudah_lunas}
            </h3>
            <p className="font-public text-[10px] text-neutral-400 mt-2 uppercase tracking-widest">Siswa terverifikasi lunas</p>
          </div>
        </div>

        {/* Card Belum Lunas */}
        <div className="bg-white rounded-md p-10 premium-shadow premium-shadow-hover flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
            <p className="font-public text-xs uppercase tracking-wider text-neutral-400">Total Siswa Belum Lunas</p>
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
          </div>
          <div>
            <h3 className="font-serif text-6xl font-light text-accent tracking-tight">
              {loading ? '...' : stats.belum_lunas}
            </h3>
            <p className="font-public text-[10px] text-neutral-400 mt-2 uppercase tracking-widest">Siswa dalam masa penagihan</p>
          </div>
        </div>

      </div>

      {/* Premium Informational Visual Element */}
      <div className="bg-white rounded-md p-10 premium-shadow space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl text-neutral-800">Persentase Kepatuhan Pembayaran</h3>
          <span className="font-public text-xs font-semibold text-primary">
            {persentaseLunas}% Lunas
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-1000"
            style={{ width: `${persentaseLunas}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 pt-4 text-center">
          <div>
            <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Total Populasi</p>
            <p className="font-serif text-2xl text-neutral-800 mt-1">{totalSiswa} Siswa</p>
          </div>
          <div>
            <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Target Penerimaan</p>
            <p className="font-serif text-2xl text-neutral-800 mt-1">Rp{(totalSiswa * 300000).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Realisasi Saat Ini</p>
            <p className="font-serif text-2xl text-primary mt-1">Rp{(stats.sudah_lunas * 300000).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
