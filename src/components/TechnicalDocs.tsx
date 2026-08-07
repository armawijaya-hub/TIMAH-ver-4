import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Server, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Key,
  Globe
} from 'lucide-react';

export const TechnicalDocs: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 3000);
  };

  const ethersSnippet = `import { ethers } from "ethers";
import { TIMAH_TOKEN_ABI } from "./abi";

const CONTRACT_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

async function interactWithTimahToken() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const timahContract = new ethers.Contract(CONTRACT_ADDRESS, TIMAH_TOKEN_ABI, signer);

  // 1. Cek Total Supply
  const totalSupply = await timahContract.totalSupply();
  console.log("Total Supply TIMAH:", ethers.formatUnits(totalSupply, 18));

  // 2. Minting (Hanya Pemilik)
  const tx = await timahContract.mint("0xTargetAddress...", ethers.parseUnits("50000", 18));
  await tx.wait();
  console.log("Minting Sukses! TxHash:", tx.hash);
}`;

  const envSnippet = `# Smart Contract Deployment & RPC Settings
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"
DEPLOYER_PRIVATE_KEY="0x_YOUR_PRIVATE_KEY_HERE"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# Real-time Webhook Push Notifications
EMAIL_NOTIFICATION_WEBHOOK="https://api.sendgrid.com/v3/mail/send"
WHATSAPP_TWILIO_SID="AC_YOUR_TWILIO_ACCOUNT_SID"
WHATSAPP_TWILIO_TOKEN="YOUR_TWILIO_AUTH_TOKEN"
ALERT_RECIPIENT_EMAIL="admin@timah-token.id"
ALERT_RECIPIENT_PHONE="whatsapp:+6281234567890"`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Dokumentasi Teknis & API Integration Hub</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Dokumentasi Teknis TIMAH Token Suite</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Panduan lengkap arsitektur smart contract, referensi API endpoint backend, instruksi konfigurasi environment variabel, serta snippet integrasi Web3 Ethers.js.
          </p>
        </div>
      </div>

      {/* Grid: Developer API Reference & Ethers Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Endpoint Reference */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>Referensi REST API Backend</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center space-x-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                <span className="text-slate-800 font-semibold">/api/token/stats</span>
              </div>
              <p className="text-slate-600">Mengembalikan metrik statistik token real-time (Total Supply, Burned, Paused State, Whitelisted Count).</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center space-x-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                <span className="text-slate-800 font-semibold">/api/audit-logs</span>
              </div>
              <p className="text-slate-600">Mengambil daftar catatan jejak audit terenkripsi dari seluruh aktivitas transaksi smart contract.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center space-x-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">POST</span>
                <span className="text-slate-800 font-semibold">/api/notifications/test</span>
              </div>
              <p className="text-slate-600">Menguji pengiriman notifikasi push darurat ke Email (SendGrid) dan WhatsApp (Twilio).</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center space-x-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                <span className="text-slate-800 font-semibold">/api/export?format=csv</span>
              </div>
              <p className="text-slate-600">Mengunduh laporan kepatuhan aktivitas token dalam format CSV standar industri.</p>
            </div>
          </div>
        </div>

        {/* Ethers.js Web3 Integration Code */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Contoh Kode Integrasi Web3 (Ethers.js v6)</span>
            </h3>

            <button
              onClick={() => copyToClipboard(ethersSnippet, 'ethers')}
              className="text-xs text-indigo-600 hover:underline flex items-center space-x-1 font-semibold"
            >
              {copiedSection === 'ethers' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'ethers' ? 'Tersalin' : 'Salin Code'}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto max-h-[300px]">
            <pre className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre">
              {ethersSnippet}
            </pre>
          </div>
        </div>
      </div>

      {/* Environment Variables & Deployment Instructions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Konfigurasi Environment Variables (.env)</span>
          </h3>

          <button
            onClick={() => copyToClipboard(envSnippet, 'env')}
            className="text-xs text-indigo-600 hover:underline flex items-center space-x-1 font-semibold"
          >
            {copiedSection === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'env' ? 'Tersalin' : 'Salin .env'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{envSnippet}</pre>
        </div>
      </div>
    </div>
  );
};
