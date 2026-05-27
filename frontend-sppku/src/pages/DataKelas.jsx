import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * DataKelas Component
 * 
 * Halaman Master Data Kelas untuk mengelola daftar kelas langsung dari basis data.
 */
export default function DataKelas() {
  const [kelasList, setKelasList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedKelas, setSelectedKelas] = useState({ id_kelas: '', nama_kelas: '', komp_keahlian: '' });
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchKelas = async () => {
    try {
      const response = await api.get('/kelas');
      if (response.data && response.data.status) {
        setKelasList(response.data.data);
      }
    } catch (err) {
      console.warn('REST API offline, menggunakan fallback data lokal.');
      setKelasList([
        { id_kelas: 'KLS01', nama_kelas: 'XII RPL 1', komp_keahlian: 'Rekayasa Perangkat Lunak' },
        { id_kelas: 'KLS02', nama_kelas: 'XII RPL 2', komp_keahlian: 'Rekayasa Perangkat Lunak' }
      ]);
    }
  };

  // Ambil data riil dari database
  useEffect(() => {
    fetchKelas();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedKelas({ id_kelas: '', nama_kelas: '', komp_keahlian: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (kelas) => {
    setModalMode('edit');
    setSelectedKelas({ ...kelas });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedKelas.id_kelas || !selectedKelas.nama_kelas) {
      setNotification({ type: 'error', message: 'ID Kelas dan Nama Kelas wajib diisi!' });
      return;
    }

    try {
      if (modalMode === 'add') {
        await api.post('/kelas', selectedKelas);
      } else {
        await api.put(`/kelas/${selectedKelas.id_kelas}`, selectedKelas);
      }
      await fetchKelas();
      setShowModal(false);
      setNotification({ type: 'success', message: 'Data kelas berhasil disimpan!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan data kelas ke database.' });
    }
  };

  const handleDelete = (id_kelas) => {
    setConfirmDialog({
      message: 'Apakah Anda yakin ingin menghapus kelas ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/kelas/${id_kelas}`);
          await fetchKelas();
          setNotification({ type: 'success', message: 'Data kelas berhasil dihapus!' });
        } catch (err) {
          setNotification({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus kelas dari database.' });
        }
      }
    });
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Master Data / Akademik</p>
          <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Data Kelas</h2>
        </div>
        <div>
          <button 
            onClick={handleOpenAdd}
            className="font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
          >
            TAMBAH KELAS
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md premium-shadow overflow-hidden">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="bg-neutral-50/50 text-neutral-400 uppercase tracking-widest font-public text-[10px]">
              <th className="py-5 px-8 font-medium">ID Kelas</th>
              <th className="py-5 px-6 font-medium">Nama Kelas</th>
              <th className="py-5 px-6 font-medium">Kompetensi Keahlian</th>
              <th className="py-5 px-8 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelasList.map((kelas, idx) => (
              <tr 
                key={kelas.id_kelas} 
                className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-blue-50/10`}
              >
                <td className="py-5 px-8 font-public font-medium text-primary">{kelas.id_kelas}</td>
                <td className="py-5 px-6 font-semibold text-neutral-800">{kelas.nama_kelas}</td>
                <td className="py-5 px-6 text-neutral-600">{kelas.komp_keahlian}</td>
                <td className="py-5 px-8 text-right space-x-4">
                  <button 
                    onClick={() => handleOpenEdit(kelas)}
                    className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                  >
                    UBAH
                  </button>
                  <button 
                    onClick={() => handleDelete(kelas.id_kelas)}
                    className="font-public text-[10px] uppercase font-semibold text-red-600 hover:underline"
                  >
                    HAPUS
                  </button>
                </td>
              </tr>
            ))}
            {kelasList.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-neutral-400 font-public">
                  Memuat data kelas dari database...
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
                <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Formulir Kelas</p>
                <h3 className="font-serif text-2xl text-neutral-800">
                  {modalMode === 'add' ? 'Tambah Kelas Baru' : 'Ubah Kelas'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xs font-public">TUTUP</button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">ID Kelas (Wajib)</label>
                <input 
                  type="text" 
                  disabled={modalMode === 'edit'}
                  value={selectedKelas.id_kelas}
                  onChange={(e) => setSelectedKelas({ ...selectedKelas, id_kelas: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input disabled:bg-neutral-100 disabled:text-neutral-400"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nama Kelas (Wajib)</label>
                <input 
                  type="text" 
                  value={selectedKelas.nama_kelas}
                  onChange={(e) => setSelectedKelas({ ...selectedKelas, nama_kelas: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Kompetensi Keahlian</label>
                <input 
                  type="text" 
                  value={selectedKelas.komp_keahlian}
                  onChange={(e) => setSelectedKelas({ ...selectedKelas, komp_keahlian: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
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
