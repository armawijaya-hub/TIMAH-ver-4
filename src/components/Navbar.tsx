import React from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Terminal, 
  Activity, 
  Bell, 
  FileText, 
  BookOpen, 
  UserCheck, 
  Lock,
  Wallet,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  walletConnected: boolean;
  walletAddress: string;
  connectWallet: () => void;
  networkName: string;
  isPaused: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  walletConnected,
  walletAddress,
  connectWallet,
  networkName,
  isPaused
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Analitik', icon: Activity },
    { id: 'sandbox', label: 'Smart Contract Sandbox', icon: Terminal },
    { id: 'remix', label: 'Remix & Deployment', icon: Coins },
    { id: 'security', label: 'Uji Keamanan & Reentrancy', icon: ShieldCheck },
    { id: 'anomaly', label: 'Deteksi Anomali & Push Alert', icon: Bell },
    { id: 'audit', label: 'Log Aktivitas & Audit', icon: FileText },
    { id: 'docs', label: 'Dokumentasi & API', icon: BookOpen }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center text-slate-300 gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            OpenZeppelin v5.1.0 Active
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline font-mono text-slate-400">
            Solidity v0.8.28
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="inline-flex items-center text-slate-300 font-medium">
            Standard: <strong className="text-indigo-300 ml-1">ERC-20 (TIMAH)</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {isPaused ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              <Lock className="w-3 h-3 mr-1" /> CONTRACT PAUSED (EMERGENCY)
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" /> OPERATIONAL
            </span>
          )}

          <div className="flex items-center bg-slate-800 rounded px-2.5 py-0.5 border border-slate-700">
            <span className="text-slate-400 mr-1.5">Peran:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="OWNER" className="bg-slate-900 text-indigo-300">Pemilik / Contract Owner</option>
              <option value="ADMIN_WHITELIST" className="bg-slate-900 text-blue-300">Admin Whitelist</option>
              <option value="AUDITOR" className="bg-slate-900 text-emerald-300">Auditor Independen</option>
              <option value="USER_PUBLIC" className="bg-slate-900 text-slate-300">Pengguna Publik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-600/30">
              T
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">TIMAH Protocol</h1>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                  1,000,000 TIMAH
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Smart Contract Management System v2.1.0
              </p>
            </div>
          </div>

          {/* Wallet Connector & Network Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              <span>Jaringan: <strong className="text-slate-900">{networkName}</strong></span>
            </div>

            <button
              onClick={connectWallet}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                walletConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletConnected
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                  : 'Hubungkan Wallet'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
