import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Login Component
 * 
 * Halaman masuk aplikasi SPPku dengan arsitektur bersih,
 * menggunakan Noto Serif headlines, Inter body, Public Sans labels,
 * serta tombol masuk gradient Teal premium yang terintegrasi dengan REST API.
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // REST API call riil ke Backend Laravel 12 /api/login
      const response = await api.post('/login', { username, password });
      
      if (response.data && response.data.status) {
        const { token, user } = response.data.data;
        
        // Menyimpan kredensial ke Local Storage
        localStorage.setItem('token', token); // ID Petugas disimpan sebagai token (X-Id-Petugas)
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigasi ke Dashboard
        navigate('/dashboard');
      } else {
        setError('Koneksi berhasil tetapi format respons server tidak valid.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal terhubung ke REST API Laravel. Pastikan PHP artisan serve / Laragon Anda sudah aktif.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-md p-12 premium-shadow">
        
        {/* Header Desain Editorial */}
        <div className="text-center mb-10">
          <p className="font-public text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">Internal Gate</p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary mb-1">SPPku Login</h2>
          <p className="font-public text-[10px] text-neutral-400 tracking-wide">Masukkan akun Anda untuk masuk sistem</p>
        </div>

        {error && (
          <div className="bg-amber-50 text-[#6d5e00] p-4 rounded-md text-xs font-public mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="flex flex-col space-y-2">
            <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Nama Pengguna</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-md text-xs font-public ghost-input"
              placeholder="Username"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-public text-[10px] uppercase tracking-wider text-neutral-500">Kata Sandi</label>
              <span className="font-public text-[9px] uppercase tracking-widest text-neutral-400 hover:text-neutral-600 cursor-not-allowed">Lupa Sandi?</span>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-md text-xs font-public ghost-input"
              placeholder="Password"
              required
            />
          </div>

          {/* Login Button with Premium Teal Gradient */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full font-public text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-primary to-blue-600 py-3.5 rounded-md premium-shadow hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'MEMASUKKAN...' : 'MASUK SISTEM'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-neutral-100/50">
          <p className="font-public text-[9px] uppercase tracking-widest text-neutral-400">
            Sistem Pembayaran SPP • Ujian Sertifikasi 2026
          </p>
        </div>

      </div>
    </div>
  );
}
