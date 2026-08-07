import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { TIMAH_TOKEN_SOL } from "./src/contracts/solidityCode.js";
import { TIMAH_TOKEN_ABI } from "./src/contracts/abi.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory store for mock state and logs
  let tokenState = {
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
  };

  let auditLogs = [
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
      remark: "Initial supply deployment minted to contract owner.",
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
  ];

  let anomalyAlerts = [
    {
      id: "ALT-1001",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      severity: "MEDIUM",
      type: "LARGE_TRANSFER_SPIKE",
      sourceAddress: "0x9876543210123456789012345678901234567890",
      targetAddress: "0x1111222233334444555566667777888899990000",
      value: 75000,
      details: "Transfer of 75,000 TIMAH exceeded single transaction soft limit alert threshold (50,000 TIMAH).",
      isAcknowledged: false,
      notificationSent: {
        email: true,
        whatsapp: true,
        desktopToast: true
      }
    }
  ];

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", token: "TIMAH", timestamp: new Date().toISOString() });
  });

  app.get("/api/contract/solidity", (req, res) => {
    res.json({
      filename: "TimahToken.sol",
      solidityVersion: "0.8.28",
      openZeppelinVersion: "5.1.0",
      code: TIMAH_TOKEN_SOL,
      abi: TIMAH_TOKEN_ABI
    });
  });

  app.get("/api/token/stats", (req, res) => {
    res.json(tokenState);
  });

  app.get("/api/audit-logs", (req, res) => {
    res.json(auditLogs);
  });

  app.post("/api/audit-logs", (req, res) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      blockNumber: 18459300 + auditLogs.length,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      eventType: req.body.eventType || "TRANSFER",
      fromAddress: req.body.fromAddress || tokenState.ownerAddress,
      toAddress: req.body.toAddress || "0x0000000000000000000000000000000000000000",
      amount: Number(req.body.amount || 0),
      actor: req.body.actor || tokenState.ownerAddress,
      status: req.body.status || "SUCCESS",
      remark: req.body.remark || "Action processed via Web3 interface.",
      encryptedHash: `aes256gcm:${Math.random().toString(36).substring(2)}`
    };
    auditLogs.unshift(newLog);
    res.status(201).json(newLog);
  });

  app.get("/api/alerts", (req, res) => {
    res.json(anomalyAlerts);
  });

  app.post("/api/notifications/test", (req, res) => {
    const { channel, recipient, alertType, message } = req.body;
    res.json({
      success: true,
      channel,
      recipient,
      deliveredAt: new Date().toISOString(),
      message: `[SECURITY ALERT DELIVERED] ${alertType || 'ANOMALY_DETECTION'}: ${message || 'System anomaly detected on TIMAH Token smart contract.'}`
    });
  });

  app.get("/api/export", (req, res) => {
    const format = req.query.format || "json";
    if (format === "csv") {
      let csv = "ID,Timestamp,Block,TxHash,EventType,From,To,Amount,Status,Remark\n";
      auditLogs.forEach(l => {
        csv += `"${l.id}","${l.timestamp}",${l.blockNumber},"${l.txHash}","${l.eventType}","${l.fromAddress}","${l.toAddress}",${l.amount},"${l.status}","${l.remark}"\n`;
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="TIMAH_Compliance_Audit_Report.csv"');
      return res.send(csv);
    }
    res.json({
      exportedAt: new Date().toISOString(),
      contract: "TIMAH",
      tokenStats: tokenState,
      auditLogs
    });
  });

  // Vite middleware for development or static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TIMAH Token Express App running on http://localhost:${PORT}`);
  });
}

startServer();
