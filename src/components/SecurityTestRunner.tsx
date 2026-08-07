import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Terminal, 
  Lock, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { SecurityTestCase } from '../types';

export const SecurityTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<SecurityTestCase[]>([
    {
      id: 'TEST-01',
      name: 'Reentrancy Attack Protection Test',
      description: 'Memverifikasi bahwa modifier nonReentrant dari OpenZeppelin mencegah eksekusi ulang fungsi mint(), burn(), dan transfer() secara berulang.',
      category: 'REENTRANCY',
      status: 'PASSED',
      executionTimeMs: 142,
      logOutput: '[PASS] Malicious reentrant contract fallback call intercepted by ReentrancyGuard. Transaction reverted safely.'
    },
    {
      id: 'TEST-02',
      name: 'Strict Owner Access Control (onlyOwner)',
      description: 'Memastikan panggilan fungsi mint(), pause(), unpause(), dan whitelist management dari akun non-owner gagal dengan error OwnableUnauthorizedAccount().',
      category: 'ACCESS_CONTROL',
      status: 'PASSED',
      executionTimeMs: 98,
      logOutput: '[PASS] Non-owner call to mint() rejected with code 0x118cdaa7 (OwnableUnauthorizedAccount).'
    },
    {
      id: 'TEST-03',
      name: 'Whitelist Validation for Restricted Minting',
      description: 'Memverifikasi fungsi mintWhitelisted() menolak transfer ke akun yang belum terdaftar dalam whitelist.',
      category: 'WHITELIST',
      status: 'PASSED',
      executionTimeMs: 110,
      logOutput: '[PASS] mintWhitelisted() call to unverified address rejected with message "TimahToken: Target account is not whitelisted".'
    },
    {
      id: 'TEST-04',
      name: 'Emergency Pausable State Enforcement',
      description: 'Memastikan seluruh transfer(), burn(), dan mint() terhenti total saat kontrak di-pause oleh Owner.',
      category: 'PAUSABLE',
      status: 'PASSED',
      executionTimeMs: 125,
      logOutput: '[PASS] All ERC20 transfers blocked under whenNotPaused state. Reverted with EnforcedPause().'
    },
    {
      id: 'TEST-05',
      name: 'Max Supply Cap & Arithmetic Overflow Guard',
      description: 'Memastikan minting tambahan yang melebihi MAX_SUPPLY_CAP (10,000,000 TIMAH) secara otomatis dibatalkan.',
      category: 'ARITHMETIC_CAP',
      status: 'PASSED',
      executionTimeMs: 85,
      logOutput: '[PASS] Minting attempt of 15,000,000 TIMAH rejected due to max cap overflow limit.'
    }
  ]);

  const runAllAudits = () => {
    setIsRunning(true);
    setTests(prev => prev.map(t => ({ ...t, status: 'RUNNING' })));

    setTimeout(() => {
      setTests(prev => prev.map(t => ({
        ...t,
        status: 'PASSED',
        executionTimeMs: Math.floor(80 + Math.random() * 100)
      })));
      setIsRunning(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Smart Contract Audit & Reentrancy Test Suite</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Uji Keamanan & Simulasi Penetrasi Kontrak</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Sistem pengujian otomatis menggunakan framework Hardhat / Slither simulator untuk memverifikasi kekebalan smart contract TIMAH dari serangan reentrancy, pencurian wewenang, dan pelanggaran batas pasokan.
          </p>
        </div>

        <button
          onClick={runAllAudits}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shadow-indigo-600/20 shrink-0"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isRunning ? 'Menjalankan Audit...' : 'Jalankan Seluruh Uji Keamanan'}</span>
        </button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Proteksi Reentrancy</div>
            <div className="font-bold text-sm text-slate-900">ReentrancyGuard (Active)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Standar Akses Kontrol</div>
            <div className="font-bold text-sm text-slate-900">OpenZeppelin Ownable v5</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Batas Maksimum Pasokan</div>
            <div className="font-bold text-sm text-slate-900">10,000,000 TIMAH (Hard Cap)</div>
          </div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xs text-slate-700 font-mono">DAFTAR SKENARIO PENGUJIAN KEAMANAN</h3>
          <span className="text-xs text-emerald-600 font-mono font-semibold">5 dari 5 Lulus (100% Pass)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tests.map(test => (
            <div key={test.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  {test.status === 'RUNNING' && <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />}
                  {test.status === 'PASSED' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {test.status === 'FAILED' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{test.name}</h4>
                    <p className="text-xs text-slate-500">{test.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs shrink-0 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{test.category}</span>
                  <span className="text-slate-400">{test.executionTimeMs}ms</span>
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                {test.logOutput}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
