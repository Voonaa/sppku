import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * MainLayout Component
 * 
 * Layout utama aplikasi SPPku dengan Sidebar Navigasi transparan bergaya Glassmorphism
 * di sisi kiri dan area konten utama yang bersih serta lega di sisi kanan.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    )},
    { name: 'Data Kelas', path: '/kelas', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    )},
    { name: 'Data Siswa', path: '/siswa', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { name: 'Data SPP', path: '/spp', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )},
    { name: 'Cek Pembayaran', path: '/cek-pembayaran', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    )},
    { name: 'Pembayaran', path: '/pembayaran', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="12" y1="10" x2="12" y2="18" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    )},
    { name: 'Detail Pembayaran', path: '/detail-pembayaran', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )},
    { name: 'Data Petugas', path: '/petugas', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen flex font-sans bg-[#fcfcfc]">
      
      {/* SIDEBAR: Glassmorphism Floating Design */}
      <aside className="w-80 glass-sidebar border-r border-primary/5 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40 p-10 select-none">
        <div>
          {/* Brand Header */}
          <div className="mb-12">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-primary mb-1">SPPku</h1>
            <p className="font-public text-[10px] uppercase tracking-[0.25em] text-neutral-400">Editorial Interface</p>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `w-full flex items-center px-4 py-3 rounded-md font-public text-xs tracking-wider uppercase transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white font-medium premium-shadow' 
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Sidebar Footer with Logout */}
        <div className="pt-8 border-t border-neutral-100/50 flex flex-col space-y-4">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-md bg-[#094cb2]/10 flex items-center justify-center text-primary font-semibold text-xs font-public">
              AD
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-neutral-700 leading-none font-public">Administrator</p>
              <p className="text-[10px] text-neutral-400 leading-none mt-1 font-public font-light">Ujian Sertifikasi</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full text-left font-public text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors py-2 px-4 rounded-md hover:bg-red-50/50"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA: airy, whitespace layout */}
      <main className="ml-80 flex-1 min-h-screen p-14 bg-[#fcfcfc]">
        {children}
      </main>

    </div>
  );
}
