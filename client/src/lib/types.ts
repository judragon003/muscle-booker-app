/**
 * 肌肉書僮數據類型定義
 */

// ============ 永豐金籌碼數據 ============
export interface YunfengChipData {
  majorBrokerConcentration: number; // 主力集中度 %
  majorBrokerNetVolume: number;     // 主力買賣超 (張)
  foreignNetBuy: number;            // 外資買賣超 (張)
  investmentTrustNetBuy: number;    // 投信買賣超 (張)
  dealerNetBuy: number;             // 自營商買賣超 (張)
  largeHolder400Ratio: number;      // 400張大戶持股比率 (%)
  largeHolder1000Ratio: number;     // 1000張大戶持股比率 (%)
  largeHolderChangeTrend: 'accumulate' | 'distribute' | 'neutral';
}

// ============ 市場數據 ============
export interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  high: number;
  low: number;
  volume: number; // 成交量（張）
  turnoverRate: number; // 週轉率（%）
  
  // 融資與籌碼
  financingBalance: number; // 融資餘額（張）
  financingChange: number; // 融資變化（張）
  institutionalBuyVolume: number; // 法人買超（張）
  institutionalSellVolume: number; // 法人賣超（張）

  // 永豐金籌碼模組
  yunfengChips?: YunfengChipData;
  
  // 券商買賣比
  brokerBuyRatio: number; // 前 5 大券商買進比率
  brokerSellRatio: number; // 前 5 大券商賣出比率
  
  // 技術指標
  ma5: number;
  ma10: number;
  ma20: number;
  ma60: number;
  
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  bollingerBandwidth: number;
  
  k: number;
  d: number;
  rsi: number;
  atr: number;
}

// ============ 持股信息 ============
export interface Position {
  symbol: string;
  name: string;
  quantity: number; // 持股數
  costBasis: number; // 均價成本
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedReturn: number; // %
  netPnL: number;
  netReturn: number; // %
  isETF: boolean;
}

// ============ 帳戶信息 ============
export interface Account {
  totalAssets: number; // 總資產
  stockValue: number; // 股票市值
  availableCash: number; // 可用現金
  stockRatio: number; // 股票佔比 %
  cashRatio: number; // 現金佔比 %
  positions: Position[];
}

// ============ 風控指標 ============
export interface RiskIndicators {
  cashRisk: {
    level: "safe" | "warning" | "danger";
    message: string;
    color: string;
  };
  financingRisk: {
    level: "safe" | "warning" | "danger";
    message: string;
    color: string;
  };
  maArrangement: {
    signal: "bullish" | "bearish" | "neutral";
    message: string;
  };
  kdCross: {
    signal: "golden" | "death" | "none";
    message: string;
  };
  rsiLevel: {
    level: "overbought" | "oversold" | "neutral";
    message: string;
  };
  atrTrailingStop: number;
}

// ============ 交易建議 ============
export interface TradeAction {
  type: "profit_taking" | "addition_tier1" | "addition_tier2" | "hold";
  title: string;
  description: string;
  quantity?: number;
  orderPrice?: number;
  totalCost?: number;
  netProceeds?: number;
  remainingCash?: number;
  color: string; // "red" | "green" | "blue" | "gray"
}

// ============ 儀表板狀態 ============
export interface DashboardState {
  account: Account;
  marketData: MarketData;
  riskIndicators: RiskIndicators;
  tradeActions: TradeAction[];
  lastUpdated: Date;
}
