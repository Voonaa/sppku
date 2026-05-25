import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * DataPetugas Component
 * 
 * Halaman Master Data Petugas untuk mengelola administrator dan petugas penagihan.
 */
export default function DataPetugas() {
  const [petugasList, setPetugasList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPetugas, setSelectedPetugas] = useState({ id_petugas: '', username: '', password: '', nama_petugas: '', level: 'petugas' });

  const fetchPetugas = async () => {
    try {
      const response = await api.get('/petugas');
      if (response.data && response.data.status) {
        setPetugasList(response.data.data);
      }
    } catch (err) {
      console.warn('REST API offline, menggunakan fallback data lokal.');
      setPetugasList([
        { id_petugas: 'PTG01', username: 'admin', nama_petugas: 'Ahmad Dahlan', level: 'admin' },
        { id_petugas: 'PTG02', username: 'petugas1', nama_petugas: 'Siti Rahma', level: 'petugas' },
        { id_petugas: 'PTG03', username: 'petugas2', nama_petugas: 'Budi Santoso', level: 'petugas' }
      ]);
    }
  };

  useEffect(() => {
    fetchPetugas();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedPetugas({ id_petugas: '', username: '', password: '', nama_petugas: '', level: 'petugas' });
    setShowModal(true);
  };

  const handleOpenEdit = (petugas) => {
    setModalMode('edit');
    setSelectedPetugas({ ...petugas, password: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedPetugas.id_petugas || !selectedPetugas.username || !selectedPetugas.nama_petugas) {
      alert('ID Petugas, Username, dan Nama Petugas wajib diisi!');
      return;
    }

    try {
      if (modalMode === 'add') {
        if (!selectedPetugas.password) {
          alert('Kata Sandi wajib diisi untuk petugas baru!');
          return;
        }
        await api.post('/petugas', selectedPetugas);
      } else {
        await api.put(`/petugas/${selectedPetugas.id_petugas}`, selectedPetugas);
      }
      await fetchPetugas();
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data petugas ke database.');
    }
  };

  const handleDelete = async (id_petugas) => {
    if (confirm('Apakah Anda yakin ingin menghapus petugas ini?')) {
      try {
        await api.delete(`/petugas/${id_petugas}`);
        await fetchPetugas();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus petugas dari database.');
      }
    }
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Master Data / Kepegawaian</p>
          <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Data Petugas</h2>
        </div>
        <div>
          <button 
            onClick={handleOpenAdd}
            className="font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
          >
            TAMBAH PETUGAS
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md premium-shadow overflow-hidden">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="bg-neutral-50/50 text-neutral-400 uppercase tracking-widest font-public text-[10px]">
              <th className="py-5 px-8 font-medium">ID Petugas</th>
              <th className="py-5 px-6 font-medium">Username</th>
              <th className="py-5 px-6 font-medium">Nama Lengkap</th>
              <th className="py-5 px-6 font-medium">Tingkat Otoritas</th>
              <th className="py-5 px-8 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {petugasList.map((petugas, idx) => (
              <tr 
                key={petugas.id_petugas} 
                className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-blue-50/10`}
              >
                <td className="py-5 px-8 font-public font-medium text-primary">{petugas.id_petugas}</td>
                <td className="py-5 px-6 font-semibold text-neutral-800 font-public">{petugas.username}</td>
                <td className="py-5 px-6 text-neutral-600 font-sans">{petugas.nama_petugas}</td>
                <td className="py-5 px-6">
                  <span className={`font-public text-[9px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm ${petugas.level === 'admin' ? 'bg-blue-50 text-primary' : 'bg-amber-50 text-accent'}`}>
                    {petugas.level}
                  </span>
                </td>
                <td className="py-5 px-8 text-right space-x-4">
                  <button 
                    onClick={() => handleOpenEdit(petugas)}
                    className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                  >
                    UBAH
                  </button>
                  <button 
                    onClick={() => handleDelete(petugas.id_petugas)}
                    className="font-public text-[10px] uppercase font-semibold text-red-600 hover:underline"
                  >
                    HAPUS
                  </button>
                </td>
              </tr>
            ))}
            {petugasList.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-neutral-400 font-public">
                  Memuat data petugas dari database...
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
                <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Formulir Petugas</p>
                <h3 className="font-serif text-2xl text-neutral-800">
                  {modalMode === 'add' ? 'Tambah Petugas Baru' : 'Ubah Data Petugas'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xs font-public">TUTUP</button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">ID Petugas (Wajib)</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'edit'}
                    value={selectedPetugas.id_petugas}
                    onChange={(e) => setSelectedPetugas({ ...selectedPetugas, id_petugas: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Otoritas Level</label>
                  <select 
                    value={selectedPetugas.level}
                    onChange={(e) => setSelectedPetugas({ ...selectedPetugas, level: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input bg-white cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="petugas">Petugas</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nama Petugas (Wajib)</label>
                <input 
                  type="text" 
                  value={selectedPetugas.nama_petugas}
                  onChange={(e) => setSelectedPetugas({ ...selectedPetugas, nama_petugas: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Username (Wajib)</label>
                <input 
                  type="text" 
                  value={selectedPetugas.username}
                  onChange={(e) => setSelectedPetugas({ ...selectedPetugas, username: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Kata Sandi {modalMode === 'edit' && '(Kosongkan jika tak diubah)'}</label>
                <input 
                  type="password" 
                  value={selectedPetugas.password}
                  onChange={(e) => setSelectedPetugas({ ...selectedPetugas, password: e.target.value })}
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
    </div>
  );
}
