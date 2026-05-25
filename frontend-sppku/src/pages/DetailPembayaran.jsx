import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * DetailPembayaran Component
 * 
 * Halaman Struk Nota Digital Pembayaran SPPku.
 * Jika diakses pasca-transaksi, menampilkan nota pembayaran tunggal riil yang baru diproses.
 * Jika diakses biasa, menampilkan histori daftar transaksi lengkap yang bisa diklik.
 */
export default function DetailPembayaran() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil data transaksi dari state router jika baru saja membayar
  const newTransaksi = location.state?.transaksi;

  // Daftar histori transaksi yang dimuat dari localStorage agar persisten
  const [historyList, setHistoryList] = useState(() => {
    const localData = localStorage.getItem('transaksi_spp');
    if (localData) {
      return JSON.parse(localData);
    }
    
    // Default initial mock data sebagai sampel awal jika kosong
    const defaults = [
      { id_pembayaran: 'PAY-882312', nisn: '0011223345', nama: 'Bunga Citra', kelas: 'XII RPL 1', nominal: 350000, jumlah_bayar: 400000, kembalian: 50000, tgl_bayar: '25 Mei 2026', status: 'Sudah Lunas' },
      { id_pembayaran: 'PAY-571290', nisn: '0011223346', nama: 'Chandra Wijaya', kelas: 'XII RPL 2', nominal: 300000, jumlah_bayar: 300000, kembalian: 0, tgl_bayar: '24 Mei 2026', status: 'Sudah Lunas' }
    ];
    localStorage.setItem('transaksi_spp', JSON.stringify(defaults));
    return defaults;
  });

  const [activeReceipt, setActiveReceipt] = useState(newTransaksi || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fadeIn space-y-10">
      
      {/* Header */}
      <div className="print:hidden">
        <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Kasir / Administrasi</p>
        <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">
          {activeReceipt ? 'Struk Pembayaran SPP' : 'Histori Transaksi'}
        </h2>
      </div>

      {activeReceipt ? (
        /* 1. VIEW STRUK NOTA DIGITAL (Jika baru bayar atau struk dipilih) */
        <div className="max-w-xl mx-auto space-y-8">
          
          {/* Struk Content */}
          <div className="bg-white rounded-md p-12 premium-shadow space-y-8 print:shadow-none print:p-0">
            
            {/* Header Nota */}
            <div className="text-center pb-6 border-b border-neutral-100/50">
              <h3 className="font-serif text-3xl font-bold tracking-tight text-primary">SPPku</h3>
              <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 mt-2">Bukti Pembayaran Elektronik Resmi</p>
              <p className="font-public text-[9px] text-neutral-400 mt-1">ID Transaksi: {activeReceipt.id_pembayaran}</p>
            </div>

            {/* Grid Informasi Struk */}
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs">
                <span className="font-public uppercase tracking-wider text-neutral-400 text-[10px]">Waktu Bayar</span>
                <span className="font-sans font-semibold text-neutral-800">{activeReceipt.tgl_bayar}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-public uppercase tracking-wider text-neutral-400 text-[10px]">Nama Siswa</span>
                <span className="font-sans font-semibold text-neutral-800">{activeReceipt.nama}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-public uppercase tracking-wider text-neutral-400 text-[10px]">NISN / Kelas</span>
                <span className="font-sans font-semibold text-neutral-800">{activeReceipt.nisn} / {activeReceipt.kelas}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-public uppercase tracking-wider text-neutral-400 text-[10px]">Status Pembayaran</span>
                <span className="font-public text-[9px] uppercase font-semibold text-primary px-2 py-0.5 rounded-sm bg-blue-50">
                  {activeReceipt.status}
                </span>
              </div>
            </div>

            {/* Rincian Finansial */}
            <div className="pt-6 border-t border-neutral-100/50 space-y-4 font-public">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider text-neutral-400 text-[10px]">Nominal SPP</span>
                <span className="font-semibold text-neutral-800">Rp {parseInt(activeReceipt.nominal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider text-neutral-400 text-[10px]">Jumlah Dibayar</span>
                <span className="font-semibold text-neutral-800">Rp {parseInt(activeReceipt.jumlah_bayar).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-dashed border-neutral-200">
                <span className="uppercase tracking-wider text-neutral-500 font-semibold text-[10px]">Uang Kembalian</span>
                <span className="font-bold text-primary">Rp {parseInt(activeReceipt.kembalian).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer Nota */}
            <div className="text-center pt-8 border-t border-neutral-100/50">
              <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 leading-normal">
                Terima kasih atas pembayaran Anda.<br/>Simpan bukti ini sebagai tanda terima yang sah.
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center px-4 print:hidden">
            <button 
              onClick={() => {
                setActiveReceipt(null);
                // Clear state router agar tidak mengunci saat refresh
                if (location.state?.transaksi) {
                  navigate(location.pathname, { replace: true, state: {} });
                }
              }} 
              className="font-public text-xs text-neutral-500 hover:underline"
            >
              KEMBALI KE DAFTAR HISTORI
            </button>
            <button 
              onClick={handlePrint}
              className="font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
            >
              CETAK NOTA RESMI
            </button>
          </div>

        </div>
      ) : (
        /* 2. VIEW DAFTAR HISTORI TRANSAKSI LENGKAP */
        <div className="bg-white rounded-md premium-shadow overflow-hidden">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 uppercase tracking-widest font-public text-[10px]">
                <th className="py-5 px-8 font-medium">ID Transaksi</th>
                <th className="py-5 px-6 font-medium">Waktu Transaksi</th>
                <th className="py-5 px-6 font-medium">Nama Siswa</th>
                <th className="py-5 px-6 font-medium">Jumlah Nominal SPP</th>
                <th className="py-5 px-6 font-medium">Uang Dibayar</th>
                <th className="py-5 px-8 text-right font-medium">Struk</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((histori, idx) => (
                <tr 
                  key={histori.id_pembayaran} 
                  className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-blue-50/10`}
                >
                  <td className="py-5 px-8 font-public font-medium text-primary">{histori.id_pembayaran}</td>
                  <td className="py-5 px-6 font-semibold text-neutral-800">{histori.tgl_bayar}</td>
                  <td className="py-5 px-6 text-neutral-600">{histori.nama}</td>
                  <td className="py-5 px-6 font-public text-neutral-500">Rp {parseInt(histori.nominal).toLocaleString('id-ID')}</td>
                  <td className="py-5 px-6 font-public text-neutral-500">Rp {parseInt(histori.jumlah_bayar).toLocaleString('id-ID')}</td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => setActiveReceipt(histori)}
                      className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                    >
                      LIHAT NOTA
                    </button>
                  </td>
                </tr>
              ))}
              {historyList.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400 font-public">
                    Belum ada transaksi pembayaran yang dilakukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
