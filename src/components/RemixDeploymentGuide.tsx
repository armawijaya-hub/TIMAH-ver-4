import React, { useState } from 'react';
import { 
  Coins, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Terminal, 
  CheckCircle2, 
  ChevronRight, 
  FileCode, 
  ShieldCheck, 
  Zap,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { TIMAH_TOKEN_SOL } from '../contracts/solidityCode';

export const RemixDeploymentGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [initialOwnerInput, setInitialOwnerInput] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(TIMAH_TOKEN_SOL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadSol = () => {
    const blob = new Blob([TIMAH_TOKEN_SOL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TimahToken.sol';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-semibold mb-1">
            <Coins className="w-4 h-4" />
            <span>Deployment Guide untuk Remix IDE & EVM Networks</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Panduan Deployment Smart Contract TIMAH</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Langkah-langkah lengkap untuk mendeploy smart contract <code className="text-indigo-600 font-mono font-semibold">TimahToken.sol</code> ke jaringan Ethereum Sepolia, Polygon Amoy, BNB Chain, atau Mainnet via Remix IDE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shadow-indigo-600/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kode Tersalin!' : 'Salin Kode Solidity'}</span>
          </button>

          <button
            onClick={handleDownloadSol}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Unduh TimahToken.sol</span>
          </button>
        </div>
      </div>

      {/* Step by Step Deployment Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Open Remix & Create File */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-900">Buka Remix IDE & Buat File</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kunjungi <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center">remix.ethereum.org <ExternalLink className="w-3 h-3 ml-0.5" /></a>, buat file baru di folder <code className="text-slate-700 font-mono">contracts/</code> bernama <code className="text-indigo-600 font-mono font-semibold">TimahToken.sol</code>, lalu tempel kode Solidity yang sudah disalin.
          </p>
          <div className="pt-2 text-[11px] text-emerald-600 font-medium flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Termasuk impor OpenZeppelin v5.x
          </div>
        </div>

        {/* Step 2: Compile Contract */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-900">Kompilasi dengan Compiler v0.8.28</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pada tab <strong>Solidity Compiler</strong> di Remix, pilih compiler versi <code className="text-indigo-600 font-mono font-semibold">0.8.28</code> (atau versi terdekat ^0.8.20). Aktifkan opsi Optimization (200 runs) untuk efisiensi gas. Klik tombol <strong>Compile TimahToken.sol</strong>.
          </p>
          <div className="pt-2 text-[11px] text-emerald-600 font-medium flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Bebas dari peringatan error kompilasi
          </div>
        </div>

        {/* Step 3: Deploy to EVM Network */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-900">Deploy via Injected Provider</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pindah ke tab <strong>Deploy & Run Transactions</strong>. Ubah Environment ke <strong>Injected Provider - MetaMask</strong>. Masukkan parameter konstruktor <code className="text-indigo-600 font-mono font-semibold">initialOwner</code>, lalu klik <strong>Transact</strong>.
          </p>
          <div className="pt-2 text-[11px] text-indigo-600 font-medium flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1" /> Pasokan awal 1,000,000 TIMAH ter-minting otomatis
          </div>
        </div>
      </div>

      {/* Constructor Parameter Helper Box */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-indigo-600" />
          <span>Konfigurasi Parameter Konstruktor Deployment</span>
        </h3>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Parameter 1: <code className="text-indigo-600 font-mono font-semibold">initialOwner (address)</code>
            </label>
            <input
              type="text"
              value={initialOwnerInput}
              onChange={(e) => setInitialOwnerInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Alamat ini akan mendapatkan peran <strong>Owner (Pemilik)</strong>, akses kontrol minting/pause, serta penerima minting pasokan awal 1,000,000 TIMAH.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Solidity Source Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs text-white font-mono">contracts/TimahToken.sol</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Solidity ^0.8.28</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="text-xs text-indigo-400 hover:underline flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950/80 overflow-x-auto max-h-[400px]">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
            {TIMAH_TOKEN_SOL}
          </pre>
        </div>
      </div>
    </div>
  );
};
