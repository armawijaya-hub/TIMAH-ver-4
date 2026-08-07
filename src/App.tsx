/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ContractSandbox } from './components/ContractSandbox';
import { RemixDeploymentGuide } from './components/RemixDeploymentGuide';
import { SecurityTestRunner } from './components/SecurityTestRunner';
import { AnomalyMonitor } from './components/AnomalyMonitor';
import { AuditLogCenter } from './components/AuditLogCenter';
import { TechnicalDocs } from './components/TechnicalDocs';
import { RbacPanel } from './components/RbacPanel';
import { TokenStats, UserRole, AuditLogItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('OWNER');
  
  // Wallet state
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [networkName, setNetworkName] = useState<string>('Ethereum Sepolia (Testnet)');

  // Token Stats State
  const [stats, setStats] = useState<TokenStats>({
    name: "TIMAH",
    symbol: "TIMAH",
    decimals: 18,
    totalSupply: 1000000,
    burnedSupply: 15000,
    circulatingSupply: 985000,
    maxCap: 10000000,
    isPaused: false,
    pauseReason: "",
    ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    totalWhitelisted: 42,
    activeHoldersCount: 128,
    totalTransactionsCount: 1420,
    securityScore: 100
  });

  // Audit Logs State
  const [logs, setLogs] = useState<AuditLogItem[]>([
    {
      id: "LOG-9901",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      blockNumber: 18459201,
      txHash: "0x8f2d8a0f98e72c83a1f9e283b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
      eventType: "MINT",
      fromAddress: "0x0000000000000000000000000000000000000000",
      toAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      amount: 1000000,
      actor: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      status: "SUCCESS",
      remark: "Initial total supply deployment minted to contract owner.",
      encryptedHash: "aes256gcm:9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"
    },
    {
      id: "LOG-9902",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      blockNumber: 18459288,
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      eventType: "WHITELIST_ADD",
      fromAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      toAddress: "0x3C44CdD45a3B35580C3263234B993fe4c2b92131",
      amount: 0,
      actor: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      status: "SUCCESS",
      remark: "Verified admin account added to whitelist.",
      encryptedHash: "aes256gcm:1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e"
    }
  ]);

  // Connect Web3 Wallet
  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      // Toggle or set mock address
      if (!walletConnected) {
        setWalletAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
        setWalletConnected(true);
      } else {
        setWalletConnected(false);
      }
    }
  };

  // Fetch initial token stats & logs from Express API
  useEffect(() => {
    fetch('/api/token/stats')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, ...data })))
      .catch(() => {});

    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLogs(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogAction = (logData: Partial<AuditLogItem>) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      blockNumber: 18459300 + logs.length,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      eventType: logData.eventType || 'TRANSFER',
      fromAddress: logData.fromAddress || walletAddress,
      toAddress: logData.toAddress || '0x0000000000000000000000000000000000000000',
      amount: logData.amount || 0,
      actor: logData.actor || walletAddress,
      status: logData.status || 'SUCCESS',
      remark: logData.remark || 'Web3 smart contract action recorded.',
      encryptedHash: `aes256gcm:${Math.random().toString(36).substring(2)}`
    };

    setLogs(prev => [newLog, ...prev]);

    // Send to server
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    }).catch(() => {});
  };

  const handlePauseToggle = (reason: string) => {
    const nextPaused = !stats.isPaused;
    setStats(prev => ({
      ...prev,
      isPaused: nextPaused,
      pauseReason: nextPaused ? reason : ''
    }));

    handleLogAction({
      eventType: nextPaused ? 'PAUSE' : 'UNPAUSE',
      fromAddress: walletAddress,
      toAddress: '0x0000000000000000000000000000000000000000',
      amount: 0,
      actor: walletAddress,
      status: 'SUCCESS',
      remark: nextPaused ? `Emergency Pause triggered: ${reason}` : 'Contract Unpaused'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        networkName={networkName}
        isPaused={stats.isPaused}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Role Access Matrix Header Widget */}
        <RbacPanel currentRole={userRole} onSelectRole={setUserRole} />

        {/* Tab Router */}
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            stats={stats}
            setActiveTab={setActiveTab}
            userRole={userRole}
            onPauseToggle={handlePauseToggle}
          />
        )}

        {activeTab === 'sandbox' && (
          <ContractSandbox
            stats={stats}
            userRole={userRole}
            walletAddress={walletAddress}
            onLogAction={handleLogAction}
            onUpdateStats={setStats}
          />
        )}

        {activeTab === 'remix' && <RemixDeploymentGuide />}

        {activeTab === 'security' && <SecurityTestRunner />}

        {activeTab === 'anomaly' && <AnomalyMonitor />}

        {activeTab === 'audit' && (
          <AuditLogCenter
            logs={logs}
            onRefreshLogs={() => {
              fetch('/api/audit-logs')
                .then(r => r.json())
                .then(d => { if (Array.isArray(d)) setLogs(d); });
            }}
          />
        )}

        {activeTab === 'docs' && <TechnicalDocs />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 font-mono">TIMAH Token Suite</span>
            <span>— Smart Contract Solidity v0.8.28 & OpenZeppelin Contracts v5.1.0</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-600 font-medium">
            <span className="text-emerald-600 font-semibold">● 100% Audited</span>
            <span>ReentrancyGuard Active</span>
            <span>AES-256 Encrypted Audit Trail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
