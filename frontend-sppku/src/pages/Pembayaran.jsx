import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Pembayaran Component
 * 
 * Halaman pemrosesan transaksi pembayaran SPP riil terintegrasi database Laravel.
 * Memasukkan NISN akan memunculkan data tagihan aktif secara otomatis.
 * Kolom Uang Diterima akan menghitung kembalian secara interaktif.
 */
export default function Pembayaran() {
  const navigate = useNavigate();
  const [nisn, setNisn] = useState('');
  const [siswa, setSiswa] = useState(null);
  const [nominalSpp, setNominalSpp] = useState(300000);
  const [jumlahBayar, setJumlahBayar] = useState('');
  const [kembalian, setKembalian] = useState(0);
  const [siswaDb, setSiswaDb] = useState({});

  // Muat data siswa dari database riil Laravel
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await api.get('/siswa');
        if (response.data && response.data.status) {
          const db = {};
          response.data.data.forEach(s => {
            db[s.nisn] = {
              nama: s.nama,
              id_kelas: s.kelas?.nama_kelas || s.id_kelas || '-',
              id_spp: s.id_spp || 'SPP01',
              nominal: parseInt(s.spp?.nominal) || 300000,
              status: s.cek_pembayaran?.status_pembayaran || 'Belum Lunas'
            };
          });
          setSiswaDb(db);
        }
      } catch (err) {
        console.warn('Gagal memuat list siswa riil, menggunakan mock luring.');
        setSiswaDb({
          '0011223344': { nama: 'Ahmad Rian', id_kelas: 'XII RPL 1', id_spp: 'SPP01', nominal: 300000, status: 'Belum Lunas' },
          '0011223347': { nama: 'Dina Mariana', id_kelas: 'XII TKJ 1', id_spp: 'SPP01', nominal: 300000, status: 'Belum Lunas' },
        });
      }
    };
    fetchSiswa();
  }, []);

  const handleCariNisn = (e) => {
    const val = e.target.value;
    setNisn(val);
    if (siswaDb[val]) {
      setSiswa(siswaDb[val]);
      setNominalSpp(siswaDb[val].nominal);
      setJumlahBayar('');
      setKembalian(0);
    } else {
      setSiswa(null);
    }
  };

  const handleBayarChange = (e) => {
    const bayar = parseInt(e.target.value) || 0;
    setJumlahBayar(e.target.value);
    
    if (bayar >= nominalSpp) {
      setKembalian(bayar - nominalSpp);
    } else {
      setKembalian(0);
    }
  };

  const handleSubmitTransaksi = async (e) => {
    e.preventDefault();
    if (!siswa) {
      alert('Masukkan NISN yang terdaftar terlebih dahulu!');
      return;
    }
    if (parseInt(jumlahBayar) < nominalSpp) {
      alert('Jumlah bayar kurang dari nominal tarif SPP!');
      return;
    }

    const payload = {
      id_pembayaran: 'PAY-' + Math.floor(Math.random() * 900000 + 100000),
      nisn: nisn,
      id_spp: siswa.id_spp,
      nominal_bayar: nominalSpp,
      jumlah_bayar: parseInt(jumlahBayar)
    };

    try {
      // POST ke REST API Laravel /api/pembayaran/transaksi (DB::transaction & CekPembayaran sync)
      const response = await api.post('/pembayaran/transaksi', payload);
      
      if (response.data && response.data.status) {
        const payloadTransaksi = {
          id_pembayaran: payload.id_pembayaran,
          nisn: nisn,
          nama: siswa.nama,
          kelas: siswa.id_kelas,
          nominal: nominalSpp,
          jumlah_bayar: jumlahBayar,
          kembalian: kembalian,
          tgl_bayar: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: 'Sudah Lunas'
        };

        // Simpan ke localStorage agar langsung masuk list histori DetailPembayaran
        const existingHistory = JSON.parse(localStorage.getItem('transaksi_spp') || '[]');
        localStorage.setItem('transaksi_spp', JSON.stringify([payloadTransaksi, ...existingHistory]));

        // Arahkan ke Detail Pembayaran dengan membawa data transaksi sebagai struk
        navigate('/detail-pembayaran', { state: { transaksi: payloadTransaksi } });
      }
    } catch (err) {
      alert('Gagal memproses transaksi ke basis data Laravel. Pastikan data spp/siswa valid.');
    }
  };

  return (
    <div className="animate-fadeIn space-y-10">
      <div>
        <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Utama / Loket Kasir</p>
        <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Pemrosesan Transaksi SPP</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form Pencarian & Input Transaksi */}
        <div className="lg:col-span-2 bg-white rounded-md p-10 premium-shadow space-y-8">
          <h3 className="font-serif text-xl text-neutral-800">Formulir Pembayaran</h3>
          
          <form onSubmit={handleSubmitTransaksi} className="space-y-6">
            
            {/* Input NISN */}
            <div className="flex flex-col space-y-2">
              <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nomor Induk Siswa Nasional (NISN)</label>
              <input 
                type="text" 
                value={nisn}
                onChange={handleCariNisn}
                placeholder="Masukkan 10 digit NISN..."
                className="px-4 py-3 rounded-md text-xs font-public ghost-input"
                maxLength="10"
                required
              />
              <p className="text-[10px] font-public text-neutral-400">
                Ketik NISN aktif (contoh: <span className="font-semibold text-primary">0011223344</span> atau <span className="font-semibold text-primary">0011223347</span>)
              </p>
            </div>

            {siswa && (
              <div className="space-y-6 animate-fadeIn">
                {/* Nominal SPP */}
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Tarif SPP Bulanan (Tagihan)</label>
                  <input 
                    type="text" 
                    value={`Rp ${nominalSpp.toLocaleString('id-ID')}`} 
                    disabled 
                    className="px-4 py-3 rounded-md text-xs font-public bg-neutral-50 text-neutral-500 border border-neutral-100"
                  />
                </div>

                {/* Uang Diterima */}
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Jumlah Uang Diterima (Rp)</label>
                  <input 
                    type="number" 
                    value={jumlahBayar}
                    onChange={handleBayarChange}
                    placeholder="Masukkan jumlah pembayaran cash..."
                    className="px-4 py-3 rounded-md text-xs font-public ghost-input"
                    required
                  />
                </div>

                {/* Kembalian (Interaktif) */}
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Uang Kembalian</label>
                  <div className="px-4 py-3 rounded-md text-sm font-semibold font-public bg-blue-50/30 text-primary">
                    Rp {kembalian.toLocaleString('id-ID')}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 py-3.5 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
                >
                  PROSES PEMBAYARAN & CETAK NOTA
                </button>
              </div>
            )}

          </form>
        </div>

        {/* Informasi Ringkasan Siswa (Kanan) */}
        <div className="bg-white rounded-md p-10 premium-shadow space-y-6">
          <h3 className="font-serif text-lg text-neutral-800 pb-4 border-b border-neutral-100/50">Profil Tagihan</h3>
          {siswa ? (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Nama Lengkap</p>
                <p className="font-sans text-sm font-semibold text-neutral-800 mt-1">{siswa.nama}</p>
              </div>
              <div>
                <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Kelas Akademik</p>
                <p className="font-sans text-sm text-neutral-600 mt-1">{siswa.id_kelas}</p>
              </div>
              <div>
                <p className="font-public text-[10px] text-neutral-400 uppercase tracking-widest">Status Pembayaran</p>
                <span className="inline-block mt-2 font-public text-[9px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm bg-amber-50 text-accent">
                  {siswa.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-neutral-300">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
              <p className="font-public text-xs">Belum ada siswa yang dicari.</p>
            </div>
          )}
        </div>

      </div>

      {/* Tabel Siswa Belum Bayar */}
      <div className="bg-white rounded-md p-10 premium-shadow space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100/50">
          <div>
            <h3 className="font-serif text-xl text-neutral-800">Siswa Belum Melunasi SPP</h3>
            <p className="font-public text-[10px] text-neutral-400 mt-1">Daftar siswa aktif yang belum menyelesaikan pembayaran SPP bulan ini</p>
          </div>
          <span className="font-public text-[10px] font-semibold bg-amber-50 text-accent px-3 py-1 rounded-sm">
            {Object.keys(siswaDb).map(key => ({ nisn: key, ...siswaDb[key] })).filter(s => s.status !== 'Sudah Lunas').length} SISWA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="text-neutral-400 uppercase tracking-widest font-public text-[10px] bg-neutral-50/50">
                <th className="py-4 px-6 font-medium">NISN</th>
                <th className="py-4 px-6 font-medium">Nama Siswa</th>
                <th className="py-4 px-6 font-medium">Kelas</th>
                <th className="py-4 px-6 font-medium">Tarif SPP</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(siswaDb)
                .map(key => ({ nisn: key, ...siswaDb[key] }))
                .filter(s => s.status !== 'Sudah Lunas')
                .map((unpaid, idx) => (
                  <tr 
                    key={unpaid.nisn} 
                    className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-amber-50/10`}
                  >
                    <td className="py-4 px-6 font-public font-medium text-neutral-500">{unpaid.nisn}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-800">{unpaid.nama}</td>
                    <td className="py-4 px-6 text-neutral-600">{unpaid.id_kelas}</td>
                    <td className="py-4 px-6 text-neutral-600 font-public">Rp {unpaid.nominal.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6">
                      <span className="font-public text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-amber-50 text-accent">
                        {unpaid.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        type="button"
                        onClick={() => {
                          setNisn(unpaid.nisn);
                          setSiswa(unpaid);
                          setNominalSpp(unpaid.nominal);
                          setJumlahBayar('');
                          setKembalian(0);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                      >
                        Pilih & Bayar
                      </button>
                    </td>
                  </tr>
                ))}
              {Object.keys(siswaDb).map(key => ({ nisn: key, ...siswaDb[key] })).filter(s => s.status !== 'Sudah Lunas').length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-neutral-400 font-public">
                    Semua siswa sudah melunasi pembayaran SPP!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
