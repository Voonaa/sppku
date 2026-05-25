import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * CekPembayaran Component
 * 
 * Halaman verifikasi status pembayaran siswa (Lunas vs Belum Lunas) riil dari database.
 */
export default function CekPembayaran() {
  const [searchNisn, setSearchNisn] = useState('');
  const [siswaList, setSiswaList] = useState([]);

  // Ambil data siswa riil dari REST API
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await api.get('/siswa');
        if (response.data && response.data.status) {
          const mapped = response.data.data.map(s => ({
            nisn: s.nisn,
            nama: s.nama,
            id_kelas: s.kelas?.nama_kelas || s.id_kelas || '-',
            status: s.cek_pembayaran?.status_pembayaran || 'Belum Lunas'
          }));
          setSiswaList(mapped);
        }
      } catch (err) {
        console.warn('REST API offline, menggunakan data lokal.');
      }
    };
    fetchSiswa();
  }, []);

  const lunasSiswa = siswaList.filter(s => s.status === 'Sudah Lunas' && (searchNisn === '' || s.nisn.includes(searchNisn)));
  const belumLunasSiswa = siswaList.filter(s => s.status === 'Belum Lunas' && (searchNisn === '' || s.nisn.includes(searchNisn)));

  return (
    <div className="animate-fadeIn space-y-10">
      <div>
        <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Utama / Transaksi</p>
        <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Cek Status Pembayaran</h2>
      </div>

      <div className="bg-white rounded-md p-8 premium-shadow">
        <div className="flex flex-col space-y-3">
          <label className="font-public text-[10px] uppercase tracking-widest text-neutral-400">Pencarian Cepat Berdasarkan NISN</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              placeholder="Masukkan NISN Siswa..." 
              value={searchNisn}
              onChange={(e) => setSearchNisn(e.target.value)}
              className="flex-1 px-5 py-3 rounded-md text-xs font-public ghost-input"
            />
            {searchNisn && (
              <button 
                onClick={() => setSearchNisn('')}
                className="font-public text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-700 px-2"
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Siswa Sudah Lunas */}
        <div className="bg-white rounded-md p-10 premium-shadow space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100/50">
            <h3 className="font-serif text-xl text-neutral-800">Siswa Yang Sudah Lunas</h3>
            <span className="font-public text-[10px] uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded-sm font-semibold">
              {lunasSiswa.length} Orang
            </span>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {lunasSiswa.map(siswa => (
              <div key={siswa.nisn} className="p-5 bg-neutral-50/30 rounded-md hover:bg-blue-50/10 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-800 font-sans">{siswa.nama}</h4>
                  <p className="font-public text-[10px] text-neutral-400 mt-1">NISN: {siswa.nisn} • {siswa.id_kelas}</p>
                </div>
                <span className="font-public text-[9px] uppercase tracking-widest text-primary font-semibold">
                  LUNAS
                </span>
              </div>
            ))}
            {lunasSiswa.length === 0 && (
              <p className="font-public text-xs text-neutral-400 text-center py-8">
                Tidak ada data siswa lunas di database.
              </p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Siswa Belum Lunas */}
        <div className="bg-white rounded-md p-10 premium-shadow space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100/50">
            <h3 className="font-serif text-xl text-neutral-800">Siswa Yang Belum Lunas</h3>
            <span className="font-public text-[10px] uppercase tracking-wider text-accent bg-amber-50 px-2.5 py-1 rounded-sm font-semibold">
              {belumLunasSiswa.length} Orang
            </span>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {belumLunasSiswa.map(siswa => (
              <div key={siswa.nisn} className="p-5 bg-neutral-50/30 rounded-md hover:bg-amber-50/10 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-800 font-sans">{siswa.nama}</h4>
                  <p className="font-public text-[10px] text-neutral-400 mt-1">NISN: {siswa.nisn} • {siswa.id_kelas}</p>
                </div>
                <span className="font-public text-[9px] uppercase tracking-widest text-accent font-semibold bg-amber-50 px-2.5 py-1.5 rounded-sm">
                  TERUTANG
                </span>
              </div>
            ))}
            {belumLunasSiswa.length === 0 && (
              <p className="font-public text-xs text-neutral-400 text-center py-8">
                Tidak ada data siswa belum lunas di database.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
