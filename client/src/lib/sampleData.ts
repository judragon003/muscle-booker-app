/**
 * 肌肉書僮示例數據
 * 預設為 0050 元大台灣50 ETF
 */

import type { Account, MarketData, DashboardState, RiskIndicators, TradeAction } from "./types";
import {
  calculateSMA,
  calculateBollingerBands,
  calculateKD,
  calculateRSI,
  calculateATR,
  calculateNetPnL,
  evaluateCashRisk,
  evaluateFinancingRisk,
  evaluateMAArrangement,
  evaluateKDCross,
  evaluateRSI,
  calculateTrailingStopPrice,
  calculateAdditionTier1,
  calculateAdditionTier2,
  calculateProfitTaking,
} from "./calculations";

/**
 * 生成示例市場數據（0050 元大台灣50）
 */
export function generateSampleMarketData(): MarketData {
  // 基準價格數據（0050 元大台灣50 確定行情歷史，避免 Math.random 亂數跳動）
  const basePrice = 103.0;
  const prices: number[] = [
    95.2, 96.1, 95.8, 97.0, 98.2, 97.9, 99.1, 100.5, 101.2, 100.8,
    102.0, 101.5, 103.1, 102.8, 104.0, 103.5, 102.9, 103.8, 104.2, 103.0
  ];

  const currentPrice = basePrice;
  const previousClose = 102.5;

  // 計算技術指標
  const ma5 = calculateSMA(prices, 5);
  const ma10 = calculateSMA(prices, 10);
  const ma20 = calculateSMA(prices, 20);
  const ma60 = calculateSMA(prices, 60);

  const bb = calculateBollingerBands(prices, 20, 2);
  const kd = calculateKD(
    prices.map(p => p * 1.02), // 模擬高價
    prices.map(p => p * 0.98), // 模擬低價
    prices,
    9,
    3
  );
  const rsi = calculateRSI(prices, 14);
  const atr = calculateATR(
    prices.map(p => p * 1.02),
    prices.map(p => p * 0.98),
    prices,
    14
  );

  return {
    symbol: "0050",
    name: "元大台灣50",
    currentPrice,
    previousClose,
    high: Math.max(...prices.slice(-20)),
    low: Math.min(...prices.slice(-20)),
    volume: 8500, // 成交量（張）
    turnoverRate: 4.2, // 週轉率（%）

    // 融資與籌碼
    financingBalance: 45000,
    financingChange: 1200,
    institutionalBuyVolume: 3500,
    institutionalSellVolume: 2800,

    // 券商買賣比
    brokerBuyRatio: 0.55,
    brokerSellRatio: 0.45,

    // 技術指標
    ma5: ma5[ma5.length - 1],
    ma10: ma10[ma10.length - 1],
    ma20: ma20[ma20.length - 1],
    ma60: ma60[ma60.length - 1],

    bollingerUpper: bb[bb.length - 1].upper,
    bollingerMiddle: bb[bb.length - 1].middle,
    bollingerLower: bb[bb.length - 1].lower,
    bollingerBandwidth: bb[bb.length - 1].bandwidth,

    k: kd.k[kd.k.length - 1],
    d: kd.d[kd.d.length - 1],
    rsi: rsi[rsi.length - 1],
    atr: atr[atr.length - 1],
  };
}

/**
 * 生成示例帳戶信息
 */
export function generateSampleAccount(marketData: MarketData): Account {
  const quantity = 18313; // 持股股數
  const costBasis = 82.97; // 均價成本
  const availableCash = 100868; // 可用現金

  const stockValue = quantity * marketData.currentPrice;
  const totalAssets = stockValue + availableCash;
  const stockRatio = (stockValue / totalAssets) * 100;
  const cashRatio = (availableCash / totalAssets) * 100;

  const pnl = calculateNetPnL(costBasis, marketData.currentPrice, quantity, true);

  return {
    totalAssets,
    stockValue,
    availableCash,
    stockRatio,
    cashRatio,
    positions: [
      {
        symbol: marketData.symbol,
        name: marketData.name,
        quantity,
        costBasis,
        currentPrice: marketData.currentPrice,
        unrealizedPnL: pnl.unrealizedPnL,
        unrealizedReturn: pnl.unrealizedReturn,
        netPnL: pnl.netPnL,
        netReturn: pnl.netReturn,
        isETF: true,
      },
    ],
  };
}

/**
 * 生成風控指標
 */
export function generateRiskIndicators(
  account: Account,
  marketData: MarketData
): RiskIndicators {
  const financingMarketValue = marketData.financingBalance * marketData.currentPrice;
  const totalMarketValue = marketData.volume * marketData.currentPrice;

  const kdPrev = marketData.k - 5; // 模擬前一根 K 值
  const dPrev = marketData.d - 3; // 模擬前一根 D 值

  return {
    cashRisk: evaluateCashRisk(account.cashRatio / 100),
    financingRisk: evaluateFinancingRisk(financingMarketValue, totalMarketValue),
    maArrangement: evaluateMAArrangement(
      marketData.ma5,
      marketData.ma10,
      marketData.ma20,
      marketData.ma60
    ),
    kdCross: evaluateKDCross(kdPrev, dPrev, marketData.k, marketData.d),
    rsiLevel: evaluateRSI(marketData.rsi),
    atrTrailingStop: calculateTrailingStopPrice(
      marketData.high,
      marketData.atr,
      2,
      marketData.ma60
    ),
  };
}

/**
 * 生成交易建議
 */
export function generateTradeActions(
  account: Account,
  marketData: MarketData,
  riskIndicators: RiskIndicators
): TradeAction[] {
  const actions: TradeAction[] = [];

  // 1. 獲利調節
  if (account.positions[0].unrealizedReturn > 5) {
    const profitTaking = calculateProfitTaking(
      marketData.currentPrice,
      Math.floor(account.positions[0].quantity * 0.3), // 減碼 30%
      account.availableCash,
      true
    );

    actions.push({
      type: "profit_taking",
      title: "🔴 獲利調節",
      description: `現價 ${marketData.currentPrice.toFixed(2)} 元，建議減碼 ${profitTaking.quantity.toLocaleString()} 股落袋`,
      quantity: profitTaking.quantity,
      orderPrice: profitTaking.orderPrice,
      netProceeds: profitTaking.netProceeds,
      color: "red",
    });
  }

  // 2. 加碼梯次一（季線撐）
  if (marketData.currentPrice > marketData.ma60 && account.cashRatio > 0.1) {
    const tier1 = calculateAdditionTier1(marketData.ma60, account.availableCash, true);

    if (tier1.quantity > 0) {
      actions.push({
        type: "addition_tier1",
        title: "🟢 加碼梯次一（季線撐）",
        description: `季線 ${marketData.ma60.toFixed(2)} 元，可掛單 ${tier1.quantity.toLocaleString()} 股`,
        quantity: tier1.quantity,
        orderPrice: tier1.orderPrice,
        totalCost: tier1.totalCost,
        remainingCash: tier1.remainingCash,
        color: "green",
      });
    }
  }

  // 3. 加碼梯次二（布林下軌）
  if (
    marketData.currentPrice < marketData.bollingerMiddle &&
    account.cashRatio > 0.15
  ) {
    const tier2 = calculateAdditionTier2(
      marketData.bollingerLower,
      account.availableCash,
      true
    );

    if (tier2.quantity > 0) {
      actions.push({
        type: "addition_tier2",
        title: "🟢 加碼梯次二（布林下軌）",
        description: `布林下軌 ${marketData.bollingerLower.toFixed(2)} 元，可掛單 ${tier2.quantity.toLocaleString()} 股`,
        quantity: tier2.quantity,
        orderPrice: tier2.orderPrice,
        totalCost: tier2.totalCost,
        remainingCash: tier2.remainingCash,
        color: "green",
      });
    }
  }

  // 4. 持股（預設）
  if (actions.length === 0) {
    actions.push({
      type: "hold",
      title: "🛡️ 持股觀察",
      description: "當前市況無明顯買賣信號，繼續持股觀察",
      color: "gray",
    });
  }

  return actions;
}

/**
 * 生成完整儀表板狀態
 */
export function generateSampleDashboardState(): DashboardState {
  const marketData = generateSampleMarketData();
  const account = generateSampleAccount(marketData);
  const riskIndicators = generateRiskIndicators(account, marketData);
  const tradeActions = generateTradeActions(account, marketData, riskIndicators);

  return {
    account,
    marketData,
    riskIndicators,
    tradeActions,
    lastUpdated: new Date(),
  };
}
