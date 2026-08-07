import React from 'react';
import { 
  Coins, 
  Flame, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertTriangle,
  Zap,
  Download,
  Share2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { TokenStats, UserRole } from '../types';

interface AnalyticsDashboardProps {
  stats: TokenStats;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onPauseToggle: (reason: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  stats,
  setActiveTab,
  userRole,
  onPauseToggle
}) => {
  // Pie chart data for Token Supply Breakdown
  const supplyData = [
    { name: 'Suplai Beredar (Circulating)', value: stats.circulatingSupply, color: '#f59e0b' },
    { name: 'Token Dihanguskan (Burned)', value: stats.burnedSupply, color: '#ef4444' },
    { name: 'Sisa Batas Maksimum (Cap Remaining)', value: stats.maxCap - stats.totalSupply, color: '#3b82f6' }
  ];

  // Bar chart data for 7-day activity metrics
  const activityData = [
    { day: 'Sen', transfer: 42000, mint: 0, burn: 1000 },
    { day: 'Sel', transfer: 68000, mint: 50000, burn: 2500 },
    { day: 'Rab', transfer: 95000, mint: 0, burn: 4000 },
    { day: 'Kam', transfer: 54000, mint: 20000, burn: 1500 },
    { day: 'Jum', transfer: 112000, mint: 0, burn: 3000 },
    { day: 'Sab', transfer: 88000, mint: 0, burn: 2000 },
    { day: 'Min', transfer: 135000, mint: 10000, burn: 1000 }
  ];

  // Anomaly timeline
  const anomalyTrendData = [
    { time: '00:00', riskIndex: 2 },
    { time: '04:00', riskIndex: 1 },
    { time: '08:00', riskIndex: 3 },
    { time: '12:00', riskIndex: 8 },
    { time: '16:00', riskIndex: 2 },
    { time: '20:00', riskIndex: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Paused */}
      {stats.isPaused && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-rose-800">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">EMERGENCY PAUSE AKTIF</h3>
              <p className="text-xs text-rose-700">
                Seluruh aktivitas transfer, minting, dan burning token TIMAH dihentikan sementara demi keamanan.
              </p>
            </div>
          </div>
          {userRole === 'OWNER' && (
            <button
              onClick={() => onPauseToggle('Emergency resolved')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Unpause Kontrak
            </button>
          )}
        </div>
      )}

      {/* Hero Welcome & Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart Contract Standar ERC-20 OpenZeppelin v5</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Koin TIMAH (TIMAH) — Platform & Visual Dashboard
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Arsitektur smart contract Solidity v0.8.28 tingkat tinggi dengan pasokan awal <strong>1,000,000 TIMAH</strong>, 
              fitur minting terbatas pemilik & whitelist, burning terkontrol, emergency pause, serta proteksi ReentrancyGuard terintegrasi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shadow-indigo-600/20"
            >
              <Coins className="w-4 h-4" />
              <span>Buka Smart Contract Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('remix')}
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Deploy di Remix IDE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Supply */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pasokan</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats.totalSupply.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-bold">TIMAH</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center">
              <span>Pasokan Awal: 1,000,000 TIMAH</span>
            </div>
          </div>
        </div>

        {/* Burned Tokens */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Dihanguskan</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-rose-600 font-mono">
              {stats.burnedSupply.toLocaleString()} <span className="text-xs font-sans font-bold text-slate-500">TIMAH</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center">
              <span>{((stats.burnedSupply / stats.totalSupply) * 100).toFixed(2)}% dari total pasokan</span>
            </div>
          </div>
        </div>

        {/* Whitelisted Accounts */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akun Whitelist</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats.totalWhitelisted} <span className="text-xs text-blue-600 font-sans font-bold">Terverifikasi</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center">
              <span>Akses eksklusif minting & admin</span>
            </div>
          </div>
        </div>

        {/* Security Audit Rating */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor Keamanan</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-emerald-600 font-mono">
              {stats.securityScore}% <span className="text-xs font-sans text-slate-600 font-semibold">(Audited)</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <span className="text-emerald-700 font-semibold">ReentrancyGuard</span>
              <span>+ OZ v5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Supply Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Coins className="w-4 h-4 text-indigo-600" />
                <span>Distribusi Pasokan Token</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Cap: 10M TIMAH</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {supplyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : index === 1 ? '#f43f5e' : '#0284c7'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(val: any) => `${Number(val).toLocaleString()} TIMAH`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {supplyData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: idx === 0 ? '#4f46e5' : idx === 1 ? '#f43f5e' : '#0284c7' }}></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: 7-Day Activity Volume Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Tren Aktivitas Transaksi (7 Hari)</span>
                </h3>
                <p className="text-xs text-slate-500">Volume Transfer, Minting, dan Burning harian</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium">
                <span className="inline-flex items-center text-indigo-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span> Transfer
                </span>
                <span className="inline-flex items-center text-sky-700">
                  <span className="w-2 h-2 rounded-full bg-sky-500 mr-1"></span> Mint
                </span>
                <span className="inline-flex items-center text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> Burn
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="transfer" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mint" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="burn" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Rata-rata volume harian: <strong className="text-slate-800">85,000 TIMAH</strong></span>
            <button 
              onClick={() => setActiveTab('audit')}
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center font-semibold"
            >
              Lihat Seluruh Log Transaksi <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Contract Management Quick Action Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Aksi Kontrol Cepat Pemilik & Admin</h3>
            <p className="text-xs text-slate-500">Operasional fungsi kritis smart contract yang dibatasi oleh modifier `onlyOwner` & `onlyWhitelisted`</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
            RBAC: {userRole}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('sandbox')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Minting Token Baru</div>
              <div className="text-[11px] text-slate-500">Fungsi mint() & mintWhitelisted() khusus owner</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Hanguskan Token (Burn)</div>
              <div className="text-[11px] text-slate-500">Fungsi burn() terkontrol dengan ReentrancyGuard</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Kelola Whitelist</div>
              <div className="text-[11px] text-slate-500">Tambah & hapus akun terverifikasi</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (userRole !== 'OWNER') {
                alert('Aksi ini memerlukan peran OWNER (Pemilik Kontrak). Silakan ubah peran di header.');
                return;
              }
              onPauseToggle(stats.isPaused ? '' : 'Emergency Pause triggered by Owner');
            }}
            className={`p-4 rounded-xl border text-left transition-all space-y-2 group ${
              stats.isPaused
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
              stats.isPaused ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
            }`}>
              {stats.isPaused ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-xs">
                {stats.isPaused ? 'Aktifkan Kembali (Unpause)' : 'Darurat Pause (Pause)'}
              </div>
              <div className="text-[11px] opacity-80">Hentikan seluruh transfer dalam kondisi darurat</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
