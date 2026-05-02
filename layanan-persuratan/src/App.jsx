import React, { useState } from 'react'
import './App.css'

const menuItems = [
  {
    id: 1,
    label: 'Surat Keterangan Siswa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: 'Surat Keterangan Lomba Siswa Team',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: 'Surat Permohonan Tutup Buku Rekening KJP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        <line x1="12" y1="15" x2="12" y2="17"/>
        <line x1="8" y1="11" x2="8" y2="11"/>
      </svg>
    ),
  },
  {
    id: 4,
    label: 'Surat Permohonan Buka Blokir KJP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        <circle cx="12" cy="16" r="1"/>
      </svg>
    ),
  },
  {
    id: 5,
    label: 'Surat Permohonan Perubahan Nama / Wali KJP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    id: 6,
    label: 'Surat Permohonan Ganti Buku / ATM Bank DKI KJP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: 7,
    label: 'Surat Dispensasi Siswa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 8,
    label: 'Surat Izin Guru dan Pegawai',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

function ThreeDotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="12" cy="19" r="2"/>
    </svg>
  )
}

function SnowflakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="M17 7l-5-5-5 5"/>
      <path d="M17 17l-5 5-5-5"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M7 7l-5 5 5 5"/>
      <path d="M17 7l5 5-5 5"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function SchoolLogo() {
  return (
    <div className="logo-wrapper">
      <div className="logo-circle">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="22" fill="#2a5298"/>
          <text x="50%" y="38%" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Nunito" dy=".3em">SMA</text>
          <text x="50%" y="60%" textAnchor="middle" fill="#7ec8e3" fontSize="11" fontWeight="800" fontFamily="Nunito" dy=".3em">ZP</text>
        </svg>
      </div>
    </div>
  )
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
    <div className="page-bg">
      <div className="card">
        {/* Top bar */}
        <div className="topbar">
          <button className="icon-btn">
            <SnowflakeIcon />
          </button>
          <button className="icon-btn">
            <ShareIcon />
          </button>
        </div>

        {/* Logo + Title */}
        <div className="header">
          <SchoolLogo />
          <h1 className="title">LAYANAN ADM. PERSURATAN</h1>
        </div>

        {/* Menu List */}
        <div className="menu-list">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-dots">
                <ThreeDotIcon />
              </span>
            </button>
          ))}
        </div>

        {/* Mail icon bottom */}
        <div className="footer-icon">
          <MailIcon />
        </div>
      </div>
    </div>
  )
}
