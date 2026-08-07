import React from 'react';
import { UserCheck, ShieldCheck, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { UserRole } from '../types';

interface RbacPanelProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RbacPanel: React.FC<RbacPanelProps> = ({ currentRole, onSelectRole }) => {
  const rolesMatrix = [
    {
      action: 'Minting Token (mint)',
      owner: true,
      adminWhitelist: false,
      auditor: false,
      publicUser: false
    },
    {
      action: 'Minting Whitelist (mintWhitelisted)',
      owner: true,
      adminWhitelist: false,
      auditor: false,
      publicUser: false
    },
    {
      action: 'Hanguskan Token (burn)',
      owner: true,
      adminWhitelist: true,
      auditor: false,
      publicUser: true
    },
    {
      action: 'Kelola Whitelist (addToWhitelist / removeFromWhitelist)',
      owner: true,
      adminWhitelist: true,
      auditor: false,
      publicUser: false
    },
    {
      action: 'Emergency Pause / Unpause Kontrak',
      owner: true,
      adminWhitelist: false,
      auditor: false,
      publicUser: false
    },
    {
      action: 'Akses Log Audit Terenkripsi & Ekspor Laporan CSV',
      owner: true,
      adminWhitelist: true,
      auditor: true,
      publicUser: true
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Matriks Matrik Akses Berbasis Peran (RBAC Matrix)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Penetapan otorisasi ketat sesuai azas keamanan smart contract Solidity OpenZeppelin v5.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Pilih Peran Simulasi:</span>
          <select
            value={currentRole}
            onChange={(e) => onSelectRole(e.target.value as UserRole)}
            className="bg-slate-50 border border-slate-200 text-indigo-700 font-semibold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="OWNER">Pemilik (Contract Owner)</option>
            <option value="ADMIN_WHITELIST">Admin Whitelist</option>
            <option value="AUDITOR">Auditor Independen</option>
            <option value="USER_PUBLIC">Pengguna Publik</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Fungsi / Fitur Kontrak</th>
              <th className="px-4 py-3 text-center">OWNER</th>
              <th className="px-4 py-3 text-center">ADMIN WHITELIST</th>
              <th className="px-4 py-3 text-center">AUDITOR</th>
              <th className="px-4 py-3 text-center">PENGGUNA PUBLIK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rolesMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{row.action}</td>
                <td className="px-4 py-3 text-center">
                  {row.owner ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.adminWhitelist ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.auditor ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.publicUser ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
