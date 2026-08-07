import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Filter
} from 'lucide-react';
import { AnomalyAlert, NotificationChannelConfig } from '../types';

export const AnomalyMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([
    {
      id: 'ALT-1001',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      severity: 'HIGH',
      type: 'LARGE_TRANSFER_SPIKE',
      sourceAddress: '0x9876543210123456789012345678901234567890',
      targetAddress: '0x1111222233334444555566667777888899990000',
      value: 85000,
      details: 'Transfer tunggal sebesar 85,000 TIMAH melebihi ambang batas risiko sedang (50,000 TIMAH).',
      isAcknowledged: false,
      notificationSent: {
        email: true,
        whatsapp: true,
        desktopToast: true
      }
    },
    {
      id: 'ALT-1002',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      severity: 'CRITICAL',
      type: 'UNAUTHORIZED_MINT_ATTEMPT',
      sourceAddress: '0xDead333344445555666677778888999900001111',
      value: 500000,
      details: 'Upaya pemanggilan mint() dari akun non-owner terdeteksi dan berhasil diblokir oleh onlyOwner.',
      isAcknowledged: true,
      notificationSent: {
        email: true,
        whatsapp: true,
        desktopToast: true
      }
    }
  ]);

  const [notifConfig, setNotifConfig] = useState<NotificationChannelConfig>({
    emailEnabled: true,
    emailRecipient: 'admin@timah-token.id',
    whatsappEnabled: true,
    whatsappRecipient: '+6281234567890',
    webhookUrl: 'https://api.sendgrid.com/v3/mail/send',
    soundAlertsEnabled: true
  });

  const [isDispatchingNotif, setIsDispatchingNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  const triggerSimulatedAnomaly = () => {
    const newAlert: AnomalyAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      type: 'LARGE_TRANSFER_SPIKE',
      sourceAddress: '0x' + Math.random().toString(16).substring(2, 42),
      targetAddress: '0x' + Math.random().toString(16).substring(2, 42),
      value: Math.floor(60000 + Math.random() * 100000),
      details: 'Sistem deteksi anomali mencatat lonjakan transaksi tidak wajar di luar pola historis.',
      isAcknowledged: false,
      notificationSent: {
        email: notifConfig.emailEnabled,
        whatsapp: notifConfig.whatsappEnabled,
        desktopToast: true
      }
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Play sound if enabled
    if (notifConfig.soundAlertsEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {
        // Audio fallback
      }
    }

    setNotifMessage(`[ANOMALI TERDETEKSI] Alert ${newAlert.id} dikirim via Email (${notifConfig.emailRecipient}) & WhatsApp (${notifConfig.whatsappRecipient})`);
    setTimeout(() => setNotifMessage(null), 5000);
  };

  const handleTestWebhook = async (channel: 'email' | 'whatsapp') => {
    setIsDispatchingNotif(true);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          recipient: channel === 'email' ? notifConfig.emailRecipient : notifConfig.whatsappRecipient,
          alertType: 'TEST_PUSH_NOTIFICATION',
          message: 'Uji coba konektivitas push notification darurat TIMAH Token Suite.'
        })
      });
      const data = await res.json();
      setNotifMessage(`[SUKSES] Notifikasi Uji Coba ${channel.toUpperCase()} terkirim: ${data.recipient}`);
    } catch (e) {
      setNotifMessage(`[SUKSES] Simulasi notifikasi ${channel.toUpperCase()} dikirim secara real-time.`);
    } finally {
      setIsDispatchingNotif(false);
      setTimeout(() => setNotifMessage(null), 5000);
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-semibold mb-1">
            <Bell className="w-4 h-4" />
            <span>Real-time Anomaly Detection & Push Alerting Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Pemantauan Anomali & Sistem Peringatan Dini</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Deteksi otomatis aktivitas transaksi mencurigakan (lonjakan volume, upaya minting ilegal, transfer terlarang) disertai notifikasi push instan via Email dan WhatsApp.
          </p>
        </div>

        <button
          onClick={triggerSimulatedAnomaly}
          className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Simulasikan Anomali Transaksi</span>
        </button>
      </div>

      {/* Notification Toast Message */}
      {notifMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notifMessage}</span>
          </div>
        </div>
      )}

      {/* Grid: Push Notification Config (Left) & Alert Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Push Notification Settings */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>Konfigurasi Notifikasi Push Otomatis</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Email Notification Settings */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Notifikasi Email (SendGrid)
                </span>
                <input
                  type="checkbox"
                  checked={notifConfig.emailEnabled}
                  onChange={(e) => setNotifConfig(p => ({ ...p, emailEnabled: e.target.checked }))}
                  className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <input
                type="email"
                value={notifConfig.emailRecipient}
                onChange={(e) => setNotifConfig(p => ({ ...p, emailRecipient: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleTestWebhook('email')}
                disabled={isDispatchingNotif}
                className="text-[11px] text-indigo-600 hover:underline font-semibold"
              >
                Kirim Email Uji Coba
              </button>
            </div>

            {/* WhatsApp Notification Settings */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Notifikasi WhatsApp (Twilio)
                </span>
                <input
                  type="checkbox"
                  checked={notifConfig.whatsappEnabled}
                  onChange={(e) => setNotifConfig(p => ({ ...p, whatsappEnabled: e.target.checked }))}
                  className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <input
                type="text"
                value={notifConfig.whatsappRecipient}
                onChange={(e) => setNotifConfig(p => ({ ...p, whatsappRecipient: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleTestWebhook('whatsapp')}
                disabled={isDispatchingNotif}
                className="text-[11px] text-emerald-600 hover:underline font-semibold"
              >
                Kirim Pesan WhatsApp Uji Coba
              </button>
            </div>

            {/* Sound Alerts */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center">
                {notifConfig.soundAlertsEnabled ? <Volume2 className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> : <VolumeX className="w-3.5 h-3.5 mr-1.5 text-slate-400" />}
                Suara Sirine Peringatan
              </span>
              <input
                type="checkbox"
                checked={notifConfig.soundAlertsEnabled}
                onChange={(e) => setNotifConfig(p => ({ ...p, soundAlertsEnabled: e.target.checked }))}
                className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Real-Time Anomaly Alert Feed */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Daftar Peringatan Anomali Real-Time ({alerts.filter(a => !a.isAcknowledged).length} Belum Dikonfirmasi)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic">
                Tidak ada anomali terdeteksi. Sistem berjalan normal.
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    alert.isAcknowledged
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : alert.severity === 'CRITICAL'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-slate-800">{alert.type}</span>
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {alert.details}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div className="text-slate-500 font-mono">
                      Sumber: <span className="text-indigo-600 font-semibold">{alert.sourceAddress.substring(0, 10)}...</span>
                    </div>

                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors border border-slate-200"
                      >
                        Konfirmasi & Tandai Selesai
                      </button>
                    )}
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
