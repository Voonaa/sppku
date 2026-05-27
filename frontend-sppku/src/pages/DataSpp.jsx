import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * DataSpp Component
 * 
 * Halaman Master Data SPP untuk mengelola nominal dan tahun SPP langsung dari basis data.
 */
export default function DataSpp() {
  const [sppList, setSppList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSpp, setSelectedSpp] = useState({ id_spp: '', tahun: '', nominal: '' });
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchSpp = async () => {
    try {
      const response = await api.get('/spp');
      if (response.data && response.data.status) {
        setSppList(response.data.data);
      }
    } catch (err) {
      console.warn('REST API offline, menggunakan fallback data lokal.');
      setSppList([
        { id_spp: 'SPP01', tahun: 2026, nominal: '300000' },
        { id_spp: 'SPP02', tahun: 2026, nominal: '350000' }
      ]);
    }
  };

  // Ambil data riil dari database
  useEffect(() => {
    fetchSpp();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedSpp({ id_spp: '', tahun: new Date().getFullYear(), nominal: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (spp) => {
    setModalMode('edit');
    setSelectedSpp({ ...spp });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSpp.id_spp || !selectedSpp.nominal) {
      setNotification({ type: 'error', message: 'ID SPP dan Nominal wajib diisi!' });
      return;
    }

    try {
      if (modalMode === 'add') {
        await api.post('/spp', selectedSpp);
      } else {
        await api.put(`/spp/${selectedSpp.id_spp}`, selectedSpp);
      }
      await fetchSpp();
      setShowModal(false);
      setNotification({ type: 'success', message: 'Data tarif SPP berhasil disimpan!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan data SPP ke database.' });
    }
  };

  const handleDelete = (id_spp) => {
    setConfirmDialog({
      message: 'Apakah Anda yakin ingin menghapus tarif SPP ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/spp/${id_spp}`);
          await fetchSpp();
          setNotification({ type: 'success', message: 'Data tarif SPP berhasil dihapus!' });
        } catch (err) {
          setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus SPP dari database.' });
        }
      }
    });
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Master Data / Keuangan</p>
          <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Data SPP</h2>
        </div>
        <div>
          <button 
            onClick={handleOpenAdd}
            className="font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
          >
            TAMBAH TARIF SPP
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md premium-shadow overflow-hidden">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="bg-neutral-50/50 text-neutral-400 uppercase tracking-widest font-public text-[10px]">
              <th className="py-5 px-8 font-medium">ID SPP</th>
              <th className="py-5 px-6 font-medium">Tahun Tarif</th>
              <th className="py-5 px-6 font-medium">Nominal Bulanan</th>
              <th className="py-5 px-8 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sppList.map((spp, idx) => (
              <tr 
                key={spp.id_spp} 
                className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-blue-50/10`}
              >
                <td className="py-5 px-8 font-public font-medium text-primary">{spp.id_spp}</td>
                <td className="py-5 px-6 font-semibold text-neutral-800">{spp.tahun}</td>
                <td className="py-5 px-6 text-neutral-600 font-public font-medium">Rp {parseInt(spp.nominal).toLocaleString('id-ID')}</td>
                <td className="py-5 px-8 text-right space-x-4">
                  <button 
                    onClick={() => handleOpenEdit(spp)}
                    className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                  >
                    UBAH
                  </button>
                  <button 
                    onClick={() => handleDelete(spp.id_spp)}
                    className="font-public text-[10px] uppercase font-semibold text-red-600 hover:underline"
                  >
                    HAPUS
                  </button>
                </td>
              </tr>
            ))}
            {sppList.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-neutral-400 font-public">
                  Memuat data SPP dari database...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-10 w-full max-w-md premium-shadow animate-scaleUp">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Formulir Tarif SPP</p>
                <h3 className="font-serif text-2xl text-neutral-800">
                  {modalMode === 'add' ? 'Tambah SPP Baru' : 'Ubah SPP'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xs font-public">TUTUP</button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">ID SPP (Wajib)</label>
                <input 
                  type="text" 
                  disabled={modalMode === 'edit'}
                  value={selectedSpp.id_spp}
                  onChange={(e) => setSelectedSpp({ ...selectedSpp, id_spp: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input disabled:bg-neutral-100 disabled:text-neutral-400"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Tahun (Wajib)</label>
                <input 
                  type="number" 
                  value={selectedSpp.tahun}
                  onChange={(e) => setSelectedSpp({ ...selectedSpp, tahun: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nominal Bulanan (Wajib)</label>
                <input 
                  type="number" 
                  value={selectedSpp.nominal}
                  onChange={(e) => setSelectedSpp({ ...selectedSpp, nominal: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                  placeholder="Contoh: 300000"
                />
              </div>

              <div className="flex justify-end pt-4 space-x-4">
                <button type="button" onClick={() => setShowModal(false)} className="font-public text-xs text-neutral-500 hover:underline px-4 py-2">BATAL</button>
                <button type="submit" className="font-public text-xs font-semibold text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow">SIMPAN PERUBAHAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-8 w-full max-w-sm premium-shadow text-center animate-scaleUp">
            <div className="mb-4">
              {notification.type === 'error' ? (
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              )}
            </div>
            <h4 className="font-serif text-lg text-neutral-800 font-medium mb-2">
              {notification.type === 'error' ? 'Pemberitahuan' : 'Sukses'}
            </h4>
            <p className="font-public text-xs text-neutral-500 mb-6 leading-relaxed">
              {notification.message}
            </p>
            <button 
              onClick={() => setNotification(null)}
              className="font-public text-xs font-semibold text-white bg-neutral-900 px-6 py-2.5 rounded-md hover:bg-neutral-800 transition-colors w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-8 w-full max-w-sm premium-shadow text-center animate-scaleUp">
            <div className="mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <h4 className="font-serif text-lg text-neutral-800 font-medium mb-2">Konfirmasi Hapus</h4>
            <p className="font-public text-xs text-neutral-500 mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="font-public text-xs text-neutral-500 hover:underline flex-1 py-2.5"
              >
                BATAL
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="font-public text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 rounded-md premium-shadow hover:opacity-90 flex-1"
              >
                YA, HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
