import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';

// Impor Halaman (yang akan kita implementasikan berikutnya)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataKelas from './pages/DataKelas';
import DataSiswa from './pages/DataSiswa';
import DataSpp from './pages/DataSpp';
import DataPetugas from './pages/DataPetugas';
import CekPembayaran from './pages/CekPembayaran';
import Pembayaran from './pages/Pembayaran';
import DetailPembayaran from './pages/DetailPembayaran';

/**
 * App Component
 * 
 * Root component untuk Front-End SPPku dengan konfigurasi navigasi
 * menggunakan React Router DOM.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Login (Tanpa Layout Utama) */}
        <Route path="/login" element={<Login />} />

        {/* Rute Aplikasi Utama (Menggunakan MainLayout) */}
        <Route 
          path="/dashboard" 
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/kelas" 
          element={
            <MainLayout>
              <DataKelas />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/siswa" 
          element={
            <MainLayout>
              <DataSiswa />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/spp" 
          element={
            <MainLayout>
              <DataSpp />
            </MainLayout>
          } 
        />

        <Route 
          path="/cek-pembayaran" 
          element={
            <MainLayout>
              <CekPembayaran />
            </MainLayout>
          } 
        />

        <Route 
          path="/pembayaran" 
          element={
            <MainLayout>
              <Pembayaran />
            </MainLayout>
          } 
        />

        <Route 
          path="/detail-pembayaran" 
          element={
            <MainLayout>
              <DetailPembayaran />
            </MainLayout>
          } 
        />

        <Route 
          path="/petugas" 
          element={
            <MainLayout>
              <DataPetugas />
            </MainLayout>
          } 
        />

        {/* Redirect default ke /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
