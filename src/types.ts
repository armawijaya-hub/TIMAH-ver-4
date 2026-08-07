export type UserRole = 'OWNER' | 'ADMIN_WHITELIST' | 'AUDITOR' | 'USER_PUBLIC';

export interface TokenStats {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number; // in TIMAH tokens (e.g. 1000000)
  burnedSupply: number;
  circulatingSupply: number;
  maxCap: number;
  isPaused: boolean;
  pauseReason?: string;
  ownerAddress: string;
  totalWhitelisted: number;
  activeHoldersCount: number;
  totalTransactionsCount: number;
  securityScore: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  blockNumber: number;
  txHash: string;
  eventType: 'TRANSFER' | 'MINT' | 'BURN' | 'PAUSE' | 'UNPAUSE' | 'WHITELIST_ADD' | 'WHITELIST_REMOVE' | 'ANOMALY_FLAG' | 'ROLE_CHANGE';
  fromAddress: string;
  toAddress: string;
  amount: number;
  actor: string;
  status: 'SUCCESS' | 'REJECTED' | 'FLAGGED';
  remark: string;
  encryptedHash: string;
}

export interface AnomalyAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'LARGE_TRANSFER_SPIKE' | 'UNAUTHORIZED_MINT_ATTEMPT' | 'PAUSED_CONTRACT_INTERACTION' | 'RAPID_BURST_ATTEMPT' | 'NON_WHITELIST_REJECT';
  sourceAddress: string;
  targetAddress?: string;
  value: number;
  details: string;
  isAcknowledged: boolean;
  notificationSent: {
    email: boolean;
    whatsapp: boolean;
    desktopToast: boolean;
  };
}

export interface WhitelistEntry {
  address: string;
  label: string;
  addedAt: string;
  addedBy: string;
  isWhitelisted: boolean;
  transactionLimit?: number;
}

export interface SecurityTestCase {
  id: string;
  name: string;
  description: string;
  category: 'REENTRANCY' | 'ACCESS_CONTROL' | 'PAUSABLE' | 'WHITELIST' | 'ARITHMETIC_CAP';
  status: 'PASSED' | 'RUNNING' | 'FAILED' | 'PENDING';
  executionTimeMs: number;
  logOutput: string;
}

export interface NotificationChannelConfig {
  emailEnabled: boolean;
  emailRecipient: string;
  whatsappEnabled: boolean;
  whatsappRecipient: string;
  webhookUrl: string;
  soundAlertsEnabled: boolean;
}
