import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  FileSpreadsheet, 
  Code,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogCenterProps {
  logs: AuditLogItem[];
  onRefreshLogs: () => void;
}

export const AuditLogCenter: React.FC<AuditLogCenterProps> = ({ logs, onRefreshLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.toAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.remark.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = eventTypeFilter === 'ALL' || log.eventType === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    window.open('/api/export?format=csv', '_blank');
  };

  const handleExportJSON = () => {
    window.open('/api/export?format=json', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-semibold mb-1">
            <FileText className="w-4 h-4" />
            <span>Audit & Compliance Activity Log Center</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Log Aktivitas Terperinci & Laporan Kepatuhan</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Catatan Jejak Audit Terenkripsi AES-256 lengkap dari seluruh transaksi minting, burning, transfer, emergency pause, serta manajemen whitelist smart contract TIMAH.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shadow-indigo-600/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Laporan (CSV)</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center space-x-2 transition-all"
          >
            <Code className="w-4 h-4 text-indigo-600" />
            <span>Ekspor JSON API</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari TxHash, Alamat, atau Catatan..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Event</option>
              <option value="MINT">MINT (Minting)</option>
              <option value="BURN">BURN (Burning)</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="PAUSE">PAUSE / UNPAUSE</option>
              <option value="WHITELIST_ADD">WHITELIST</option>
            </select>
          </div>

          <button
            onClick={onRefreshLogs}
            className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">ID & Timestamp</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Dari (From)</th>
                <th className="px-4 py-3">Ke (To)</th>
                <th className="px-4 py-3">Jumlah (TIMAH)</th>
                <th className="px-4 py-3">Status & Enkripsi</th>
                <th className="px-4 py-3">Catatan Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 italic">
                    Tidak ada catatan log sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-indigo-600">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        log.eventType === 'MINT' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        log.eventType === 'BURN' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        log.eventType === 'PAUSE' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        log.eventType === 'WHITELIST_ADD' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {log.eventType}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {log.fromAddress.substring(0, 10)}...
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {log.toAddress.substring(0, 10)}...
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {log.amount > 0 ? log.amount.toLocaleString() : '-'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{log.status}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                        {log.encryptedHash}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600 max-w-xs leading-tight">
                      {log.remark}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
