import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * DataSiswa Component
 * 
 * Halaman Master Data Siswa dengan fitur CRUD lengkap dan pencarian dinamis
 * terintegrasi REST API.
 */
export default function DataSiswa() {
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [sppList, setSppList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSiswa, setSelectedSiswa] = useState({
    nisn: '',
    nis: '',
    nama: '',
    id_kelas: '',
    alamat: '',
    no_telp: '',
    id_spp: '',
    status: 'Belum Lunas'
  });

  // Ambil data riil dari database (Siswa, Kelas, SPP)
  const fetchAllData = async () => {
    try {
      const siswaRes = await api.get('/siswa');
      if (siswaRes.data && siswaRes.data.status) {
        setSiswaList(siswaRes.data.data);
      }

      const masterRes = await api.get('/master-data');
      if (masterRes.data && masterRes.data.status) {
        setKelasList(masterRes.data.data.kelas);
        setSppList(masterRes.data.data.spp);
      }
    } catch (err) {
      console.warn('REST API offline, menggunakan data lokal.');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedSiswa({
      nisn: '',
      nis: '',
      nama: '',
      id_kelas: kelasList[0]?.id_kelas || '',
      alamat: '',
      no_telp: '',
      id_spp: sppList[0]?.id_spp || '',
      status: 'Belum Lunas'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (siswa) => {
    setModalMode('edit');
    setSelectedSiswa({
      nisn: siswa.nisn,
      nis: siswa.nis || '',
      nama: siswa.nama || '',
      id_kelas: siswa.id_kelas || '',
      alamat: siswa.alamat || '',
      no_telp: siswa.no_telp || '',
      id_spp: siswa.id_spp || '',
      status: siswa.cek_pembayaran?.status_pembayaran || 'Belum Lunas'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSiswa.nisn || !selectedSiswa.nama) {
      alert('NISN dan Nama wajib diisi!');
      return;
    }

    try {
      if (modalMode === 'add') {
        // Panggil POST /api/siswa
        await api.post('/siswa', selectedSiswa);
      } else {
        // Panggil PUT /api/siswa/{nisn}
        await api.put(`/siswa/${selectedSiswa.nisn}`, selectedSiswa);
      }
      fetchAllData(); // Refresh data dari DB
    } catch (err) {
      console.warn('Gagal menghubungi API, melakukan penyimpanan lokal.');
      if (modalMode === 'add') {
        setSiswaList([...siswaList, {
          ...selectedSiswa,
          kelas: kelasList.find(k => k.id_kelas === selectedSiswa.id_kelas),
          spp: sppList.find(s => s.id_spp === selectedSiswa.id_spp),
          cek_pembayaran: { status_pembayaran: selectedSiswa.status }
        }]);
      } else {
        setSiswaList(siswaList.map(s => s.nisn === selectedSiswa.nisn ? {
          ...selectedSiswa,
          kelas: kelasList.find(k => k.id_kelas === selectedSiswa.id_kelas),
          spp: sppList.find(s => s.id_spp === selectedSiswa.id_spp),
          cek_pembayaran: { status_pembayaran: selectedSiswa.status }
        } : s));
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (nisn) => {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      try {
        await api.delete(`/siswa/${nisn}`);
        fetchAllData();
      } catch (err) {
        console.warn('Gagal menghubungi API, menghapus data secara lokal.');
        setSiswaList(siswaList.filter(s => s.nisn !== nisn));
      }
    }
  };

  const filteredSiswa = siswaList.filter(s =>
    (s.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nisn || '').includes(searchQuery)
  );

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-public text-xs uppercase tracking-widest text-neutral-400 mb-2">Master Data / Kependudukan</p>
          <h2 className="font-serif text-4xl font-normal tracking-wide text-neutral-900 leading-normal">Data Siswa</h2>
        </div>
        <div>
          <button 
            onClick={handleOpenAdd}
            className="font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 px-6 py-3 rounded-md premium-shadow hover:opacity-90 transition-all duration-300"
          >
            TAMBAH SISWA
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Cari Nama atau NISN..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-md text-xs font-public ghost-input pl-10 bg-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3.5 text-neutral-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Table: borderless premium with zebra striping */}
      <div className="bg-white rounded-md premium-shadow overflow-hidden">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="bg-neutral-50/50 text-neutral-400 uppercase tracking-widest font-public text-[10px]">
              <th className="py-5 px-8 font-medium">NISN</th>
              <th className="py-5 px-6 font-medium">NIS</th>
              <th className="py-5 px-6 font-medium">Nama</th>
              <th className="py-5 px-6 font-medium">Kelas</th>
              <th className="py-5 px-6 font-medium">Status SPP</th>
              <th className="py-5 px-8 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSiswa.map((siswa, idx) => (
              <tr 
                key={siswa.nisn} 
                className={`transition-colors duration-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/20'} hover:bg-blue-50/10`}
              >
                <td className="py-5 px-8 font-public font-medium text-primary">{siswa.nisn}</td>
                <td className="py-5 px-6 font-public text-neutral-500">{siswa.nis || '-'}</td>
                <td className="py-5 px-6 font-semibold text-neutral-800">{siswa.nama}</td>
                <td className="py-5 px-6 text-neutral-600">
                  {siswa.kelas?.nama_kelas || siswa.id_kelas || '-'}
                </td>
                <td className="py-5 px-6">
                  <span className={`font-public text-[9px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm ${
                    (siswa.cek_pembayaran?.status_pembayaran || 'Belum Lunas') === 'Sudah Lunas' 
                      ? 'bg-blue-50 text-primary' 
                      : 'bg-amber-50 text-accent'
                  }`}>
                    {siswa.cek_pembayaran?.status_pembayaran || 'Belum Lunas'}
                  </span>
                </td>
                <td className="py-5 px-8 text-right space-x-4">
                  <button 
                    onClick={() => handleOpenEdit(siswa)}
                    className="font-public text-[10px] uppercase font-semibold text-primary hover:underline"
                  >
                    UBAH
                  </button>
                  <button 
                    onClick={() => handleDelete(siswa.nisn)}
                    className="font-public text-[10px] uppercase font-semibold text-red-600 hover:underline"
                  >
                    HAPUS
                  </button>
                </td>
              </tr>
            ))}
            {filteredSiswa.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-neutral-400 font-public">
                  Tidak ada data siswa ditemukan di database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-10 w-full max-w-lg premium-shadow animate-scaleUp">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Formulir Siswa</p>
                <h3 className="font-serif text-2xl text-neutral-800">
                  {modalMode === 'add' ? 'Tambah Siswa Baru' : 'Ubah Data Siswa'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xs font-public">TUTUP</button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">NISN (Wajib)</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'edit'}
                    value={selectedSiswa.nisn}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, nisn: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input disabled:bg-neutral-100 disabled:text-neutral-400"
                    maxLength="10"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">NIS</label>
                  <input 
                    type="text" 
                    value={selectedSiswa.nis}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, nis: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                    maxLength="8"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nama Lengkap (Wajib)</label>
                <input 
                  type="text" 
                  value={selectedSiswa.nama}
                  onChange={(e) => setSelectedSiswa({ ...selectedSiswa, nama: e.target.value })}
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Kelas</label>
                  <select 
                    value={selectedSiswa.id_kelas}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, id_kelas: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input bg-white cursor-pointer"
                  >
                    {kelasList.map(k => (
                      <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Status Pembayaran</label>
                  <select 
                    value={selectedSiswa.status}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, status: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input bg-white cursor-pointer"
                  >
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Sudah Lunas">Sudah Lunas</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Alamat</label>
                <textarea 
                  value={selectedSiswa.alamat}
                  onChange={(e) => setSelectedSiswa({ ...selectedSiswa, alamat: e.target.value })}
                  rows="3"
                  className="px-4 py-2.5 rounded-md text-xs font-public ghost-input resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">No. Telepon</label>
                  <input 
                    type="text" 
                    value={selectedSiswa.no_telp}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, no_telp: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input"
                    maxLength="13"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">SPP</label>
                  <select 
                    value={selectedSiswa.id_spp}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, id_spp: e.target.value })}
                    className="px-4 py-2.5 rounded-md text-xs font-public ghost-input bg-white cursor-pointer"
                  >
                    {sppList.map(s => (
                      <option key={s.id_spp} value={s.id_spp}>Tahun {s.tahun} - Rp {parseInt(s.nominal).toLocaleString('id-ID')}</option>
                    ))}
                  </select>
                </div>
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
