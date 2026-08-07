import React, { useState } from 'react';
import { 
  Terminal, 
  Coins, 
  Flame, 
  UserCheck, 
  Lock, 
  Unlock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';
import { TokenStats, UserRole, AuditLogItem } from '../types';

interface ContractSandboxProps {
  stats: TokenStats;
  userRole: UserRole;
  walletAddress: string;
  onLogAction: (log: Partial<AuditLogItem>) => void;
  onUpdateStats: (updater: (prev: TokenStats) => TokenStats) => void;
}

export const ContractSandbox: React.FC<ContractSandboxProps> = ({
  stats,
  userRole,
  walletAddress,
  onLogAction,
  onUpdateStats
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mint' | 'burn' | 'whitelist' | 'pause' | 'transfer' | 'balance'>('mint');

  // Form states
  const [targetAddress, setTargetAddress] = useState<string>('0x3C44CdD45a3B35580C3263234B993fe4c2b92131');
  const [amount, setAmount] = useState<string>('50000');
  const [pauseReason, setPauseReason] = useState<string>('Instabilitas jaringan atau audit rutin');
  const [isWhitelistedTarget, setIsWhitelistedTarget] = useState<boolean>(true);

  // Output terminal logs
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: string; time: string; type: 'info' | 'success' | 'error' | 'event'; text: string }>>([
    {
      id: '1',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'Smart Contract TimahToken loaded successfully at 0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    },
    {
      id: '2',
      time: new Date().toLocaleTimeString(),
      type: 'event',
      text: 'Event: TokensMinted(to: 0x71C7656EC7ab..., amount: 1000000000000000000000000 wei)'
    }
  ]);

  const addTerminalLog = (type: 'info' | 'success' | 'error' | 'event', text: string) => {
    setTerminalLogs(prev => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        type,
        text
      },
      ...prev
    ]);
  };

  const handleMint = (isWhitelistRequired: boolean) => {
    if (stats.isPaused) {
      addTerminalLog('error', 'TX REVERTED: TimahToken: EnforcedPause() - Transaksi dibatalkan karena kontrak dalam status EMERGENCY PAUSE.');
      return;
    }

    if (userRole !== 'OWNER') {
      addTerminalLog('error', 'TX REVERTED: OwnableUnauthorizedAccount() - Hanya OWNER yang memiliki akses ke fungsi mint(). Modifier onlyOwner gagal.');
      return;
    }

    if (!targetAddress || !targetAddress.startsWith('0x') || targetAddress.length < 10) {
      addTerminalLog('error', 'INVALID ADDRESS: Alamat target harus berupa format alamat Ethereum/EVM valid (0x...)');
      return;
    }

    const mintNum = Number(amount);
    if (isNaN(mintNum) || mintNum <= 0) {
      addTerminalLog('error', 'INVALID AMOUNT: Jumlah minting harus angka positif lebih dari 0.');
      return;
    }

    if (stats.totalSupply + mintNum > stats.maxCap) {
      addTerminalLog('error', `TX REVERTED: TimahToken: Minting exceeds max supply cap (${stats.maxCap.toLocaleString()} TIMAH).`);
      return;
    }

    if (isWhitelistRequired && !isWhitelistedTarget) {
      addTerminalLog('error', 'TX REVERTED: TimahToken: Target account is not whitelisted. Modifier onlyWhitelisted gagal.');
      return;
    }

    // Success execution
    onUpdateStats(prev => ({
      ...prev,
      totalSupply: prev.totalSupply + mintNum,
      circulatingSupply: prev.circulatingSupply + mintNum,
      totalTransactionsCount: prev.totalTransactionsCount + 1
    }));

    const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    addTerminalLog('success', `[SUCCESS] ${mintNum.toLocaleString()} TIMAH berhasil di-mint ke ${targetAddress}. TxHash: ${txHash.substring(0, 18)}...`);
    addTerminalLog('event', `Event: TokensMinted(to: ${targetAddress}, amount: ${mintNum} TIMAH, caller: ${walletAddress})`);

    onLogAction({
      eventType: 'MINT',
      fromAddress: '0x0000000000000000000000000000000000000000',
      toAddress: targetAddress,
      amount: mintNum,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: isWhitelistRequired ? 'Whitelisted Minting executed by Owner' : 'Standard Minting executed by Owner'
    });
  };

  const handleBurn = () => {
    if (stats.isPaused) {
      addTerminalLog('error', 'TX REVERTED: TimahToken: EnforcedPause() - Fungsi burn() tidak dapat dipanggil saat kontrak di-pause.');
      return;
    }

    const burnNum = Number(amount);
    if (isNaN(burnNum) || burnNum <= 0) {
      addTerminalLog('error', 'INVALID AMOUNT: Jumlah token yang dihanguskan harus lebih dari 0.');
      return;
    }

    if (burnNum > stats.circulatingSupply) {
      addTerminalLog('error', 'TX REVERTED: ERC20: burn amount exceeds balance. Saldo tidak mencukupi.');
      return;
    }

    onUpdateStats(prev => ({
      ...prev,
      burnedSupply: prev.burnedSupply + burnNum,
      circulatingSupply: prev.circulatingSupply - burnNum,
      totalSupply: prev.totalSupply - burnNum,
      totalTransactionsCount: prev.totalTransactionsCount + 1
    }));

    const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    addTerminalLog('success', `[SUCCESS] ${burnNum.toLocaleString()} TIMAH berhasil dihanguskan (burned). TxHash: ${txHash.substring(0, 18)}...`);
    addTerminalLog('event', `Event: TokensBurned(burner: ${walletAddress}, amount: ${burnNum} TIMAH, newTotalSupply: ${(stats.totalSupply - burnNum).toLocaleString()})`);

    onLogAction({
      eventType: 'BURN',
      fromAddress: walletAddress,
      toAddress: '0x0000000000000000000000000000000000000000',
      amount: burnNum,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: 'Tokens burned permanently by caller with nonReentrant guard'
    });
  };

  const handleWhitelistToggle = (status: boolean) => {
    if (userRole !== 'OWNER' && userRole !== 'ADMIN_WHITELIST') {
      addTerminalLog('error', 'TX REVERTED: Akses ditolak. Hanya OWNER atau ADMIN_WHITELIST yang dapat mengelola whitelist.');
      return;
    }

    if (!targetAddress || !targetAddress.startsWith('0x')) {
      addTerminalLog('error', 'INVALID ADDRESS: Masukkan alamat Ethereum yang valid.');
      return;
    }

    setIsWhitelistedTarget(status);
    onUpdateStats(prev => ({
      ...prev,
      totalWhitelisted: status ? prev.totalWhitelisted + 1 : Math.max(0, prev.totalWhitelisted - 1)
    }));

    addTerminalLog('success', `[WHITELIST UPDATED] Status whitelist untuk ${targetAddress}: ${status ? 'TERVERIFIKASI (TRUE)' : 'DIHAPUS (FALSE)'}`);
    addTerminalLog('event', `Event: WhitelistUpdated(account: ${targetAddress}, isWhitelisted: ${status}, updatedBy: ${walletAddress})`);

    onLogAction({
      eventType: status ? 'WHITELIST_ADD' : 'WHITELIST_REMOVE',
      fromAddress: walletAddress,
      toAddress: targetAddress,
      amount: 0,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: status ? 'Address added to verified whitelist' : 'Address removed from whitelist'
    });
  };

  const handlePauseToggle = (reasonText: string) => {
    if (userRole !== 'OWNER') {
      addTerminalLog('error', 'TX REVERTED: OwnableUnauthorizedAccount() - Hanya Owner yang berhak mengubah status Pause.');
      return;
    }

    const nextPaused = !stats.isPaused;
    onUpdateStats(prev => ({
      ...prev,
      isPaused: nextPaused,
      pauseReason: nextPaused ? reasonText : ''
    }));

    if (nextPaused) {
      addTerminalLog('error', `[EMERGENCY PAUSED] Kontrak di-pause oleh Owner. Alasan: "${reasonText}"`);
      addTerminalLog('event', `Event: EmergencyPauseTriggered(ownerAddress: ${walletAddress}, reason: "${reasonText}")`);
    } else {
      addTerminalLog('success', `[UNPAUSED] Kontrak diaktifkan kembali. Operasional normal berlanjut.`);
      addTerminalLog('event', `Event: EmergencyUnpauseTriggered(ownerAddress: ${walletAddress})`);
    }

    onLogAction({
      eventType: nextPaused ? 'PAUSE' : 'UNPAUSE',
      fromAddress: walletAddress,
      toAddress: '0x0000000000000000000000000000000000000000',
      amount: 0,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: nextPaused ? `Emergency Pause: ${reasonText}` : 'Unpaused contract'
    });
  };

  const handleTransfer = () => {
    if (stats.isPaused) {
      addTerminalLog('error', 'TX REVERTED: TimahToken: EnforcedPause() - Transfer tidak diperbolehkan dalam kondisi emergency pause.');
      return;
    }

    const transferNum = Number(amount);
    if (isNaN(transferNum) || transferNum <= 0) {
      addTerminalLog('error', 'INVALID AMOUNT: Jumlah transfer harus angka positif.');
      return;
    }

    onUpdateStats(prev => ({
      ...prev,
      totalTransactionsCount: prev.totalTransactionsCount + 1
    }));

    const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    addTerminalLog('success', `[TRANSFER SUCCESS] Transfer ${transferNum.toLocaleString()} TIMAH dari ${walletAddress.substring(0, 10)}... ke ${targetAddress.substring(0, 10)}... TxHash: ${txHash.substring(0, 18)}...`);
    addTerminalLog('event', `Event: Transfer(from: ${walletAddress}, to: ${targetAddress}, value: ${transferNum} TIMAH)`);

    onLogAction({
      eventType: 'TRANSFER',
      fromAddress: walletAddress,
      toAddress: targetAddress,
      amount: transferNum,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: 'Peer-to-peer ERC20 transfer executed'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Concept Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold mb-1">
            <Terminal className="w-4 h-4" />
            <span>Smart Contract Execution Sandbox</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Uji Coba Fungsi Contract TimahToken</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Simulasikan eksekusi method smart contract Solidity secara langsung dengan validasi modifier <code className="text-indigo-600 font-mono font-semibold">onlyOwner</code>, <code className="text-blue-600 font-mono font-semibold">onlyWhitelisted</code>, <code className="text-rose-600 font-mono font-semibold">whenNotPaused</code>, serta <code className="text-emerald-600 font-mono font-semibold">nonReentrant</code>.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600 font-medium">
            Peran Aktif: <strong className="text-indigo-700">{userRole}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & Terminal Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Action Control Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          {/* Action Sub Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSubTab('mint')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'mint' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minting
            </button>
            <button
              onClick={() => setActiveSubTab('burn')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'burn' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Burning
            </button>
            <button
              onClick={() => setActiveSubTab('whitelist')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'whitelist' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Whitelist
            </button>
            <button
              onClick={() => setActiveSubTab('pause')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'pause' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergency Pause
            </button>
            <button
              onClick={() => setActiveSubTab('transfer')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'transfer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transfer
            </button>
          </div>

          {/* Form Content by SubTab */}
          <div className="space-y-4 pt-2">
            {/* MINT TAB */}
            {activeSubTab === 'mint' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                  <span className="font-bold">Fungsi:</span> <code className="font-mono">mint(address to, uint256 amount)</code> & <code className="font-mono">mintWhitelisted(address to, uint256 amount)</code>
                  <p className="mt-1 text-slate-600">
                    Dibatasi secara ketat oleh modifier <code className="text-indigo-700 font-mono font-semibold">onlyOwner</code> dan batas maksimum pasokan (10,000,000 TIMAH).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Penerima Token (To Address)
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Token yang Di-mint (TIMAH)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="chkWhitelist"
                    checked={isWhitelistedTarget}
                    onChange={(e) => setIsWhitelistedTarget(e.target.checked)}
                    className="rounded bg-slate-50 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="chkWhitelist" className="text-xs text-slate-600 cursor-pointer">
                    Verifikasi bahwa target penerima sudah berada di Whitelist
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleMint(false)}
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm shadow-indigo-600/20"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Eksekusi mint() Standard</span>
                  </button>

                  <button
                    onClick={() => handleMint(true)}
                    className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm shadow-sky-600/20"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Eksekusi mintWhitelisted()</span>
                  </button>
                </div>
              </div>
            )}

            {/* BURN TAB */}
            {activeSubTab === 'burn' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-900">
                  <span className="font-bold">Fungsi:</span> <code className="font-mono">burn(uint256 amount)</code>
                  <p className="mt-1 text-slate-600">
                    Mengurangi total pasokan koin secara permanen dari akun pemanggil. Dilengkapi proteksi <code className="text-emerald-700 font-mono font-semibold">nonReentrant</code>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Token TIMAH yang Dihanguskan
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <button
                  onClick={handleBurn}
                  className="w-full px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <Flame className="w-4 h-4" />
                  <span>Eksekusi burn() Permament</span>
                </button>
              </div>
            )}

            {/* WHITELIST TAB */}
            {activeSubTab === 'whitelist' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900">
                  <span className="font-bold">Fungsi:</span> <code className="font-mono">addToWhitelist(address)</code> & <code className="font-mono">removeFromWhitelist(address)</code>
                  <p className="mt-1 text-slate-600">
                    Menjaga eksklusivitas distribusi token untuk pengguna terverifikasi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Target Pengguna (Address)
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleWhitelistToggle(true)}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Tambah ke Whitelist</span>
                  </button>

                  <button
                    onClick={() => handleWhitelistToggle(false)}
                    className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-rose-600 font-semibold text-xs border border-slate-200 flex items-center justify-center space-x-2 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Hapus dari Whitelist</span>
                  </button>
                </div>
              </div>
            )}

            {/* EMERGENCY PAUSE TAB */}
            {activeSubTab === 'pause' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-xs text-purple-900">
                  <span className="font-bold">Fungsi:</span> <code className="font-mono">pause(string reason)</code> & <code className="font-mono">unpause()</code>
                  <p className="mt-1 text-slate-600">
                    Menghentikan seluruh aktivitas transfer dalam kondisi darurat ancaman peretasan atau audit keamanan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alasan / Justifikasi Emergency Pause
                  </label>
                  <input
                    type="text"
                    value={pauseReason}
                    onChange={(e) => setPauseReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-sans focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={() => handlePauseToggle(pauseReason)}
                  className={`w-full px-4 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                    stats.isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {stats.isPaused ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Aktifkan Kembali Kontrak (Unpause)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Trigger Emergency Pause Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TRANSFER TAB */}
            {activeSubTab === 'transfer' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                  <span className="font-bold">Fungsi:</span> <code className="font-mono">transfer(address to, uint256 amount)</code>
                  <p className="mt-1 text-slate-600">
                    Transfer token standar ERC-20 antar dompet. Diproteksi oleh modifier <code className="text-emerald-700 font-mono font-semibold">whenNotPaused</code>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Penerima Transfer
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Token TIMAH
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={handleTransfer}
                  className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Token TIMAH</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Live Terminal Execution Log */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col h-[520px]">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">EVM Execution Terminal</span>
            </div>

            <button
              onClick={() => setTerminalLogs([])}
              className="text-slate-400 hover:text-white text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Log</span>
            </button>
          </div>

          {/* Log Output Body */}
          <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-2.5">
            {terminalLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-12 italic">
                Belum ada transaksi dieksekusi. Pilih fungsi di sebelah kiri untuk menguji smart contract.
              </div>
            ) : (
              terminalLogs.map(log => (
                <div key={log.id} className="space-y-0.5 border-b border-slate-900 pb-2">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <span>[{log.time}]</span>
                    {log.type === 'error' && <span className="text-rose-400 font-bold">REVERT</span>}
                    {log.type === 'success' && <span className="text-emerald-400 font-bold">SUCCESS</span>}
                    {log.type === 'event' && <span className="text-amber-400 font-bold">EVENT LOGGED</span>}
                  </div>
                  <div className={`leading-relaxed break-words ${
                    log.type === 'error' ? 'text-rose-300' :
                    log.type === 'success' ? 'text-emerald-300' :
                    log.type === 'event' ? 'text-amber-300' : 'text-slate-300'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
