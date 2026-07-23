/**
 * 肌肉書僮核心計算引擎
 * 
 * 設計原則：
 * - 所有摩擦成本必須精確計算，包含手續費低消
 * - 技術指標基於標準定義（SMA, Bollinger Bands, KD, RSI, ATR）
 * - 風控邏輯優先於獲利邏輯
 */

// ============ 摩擦成本常數 ============
export const FRICTION_CONSTANTS = {
  BUY_FEE_RATE: 0.001425 * 0.6, // 0.0855% (手續費 6 折)
  SELL_FEE_RATE: 0.001425 * 0.6, // 0.0855%
  ETF_TAX_RATE: 0.001, // 0.1% ETF 優惠證交稅
  STOCK_TAX_RATE: 0.003, // 0.3% 個股證交稅
  MIN_FEE: 20, // NT$ 20 低消
};

// ============ 技術指標計算 ============

/**
 * 簡單移動平均 (SMA)
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

/**
 * 布林通道 (Bollinger Bands)
 * @param prices 價格陣列
 * @param period 週期 (預設 20)
 * @param stdDevMultiplier 標準差倍數 (預設 2)
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
) {
  const sma = calculateSMA(prices, period);
  const bands: Array<{ upper: number; middle: number; lower: number; bandwidth: number }> = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      bands.push({ upper: NaN, middle: NaN, lower: NaN, bandwidth: NaN });
      continue;
    }

    const middle = sma[i];
    const slice = prices.slice(i - period + 1, i + 1);
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - middle, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upper = middle + stdDevMultiplier * stdDev;
    const lower = middle - stdDevMultiplier * stdDev;
    const bandwidth = upper - lower;

    bands.push({ upper, middle, lower, bandwidth });
  }

  return bands;
}

/**
 * KD 指標 (隨機指標)
 * @param highs 最高價
 * @param lows 最低價
 * @param closes 收盤價
 * @param kPeriod K 值週期 (預設 9)
 * @param dPeriod D 值週期 (預設 3)
 */
export function calculateKD(
  highs: number[],
  lows: number[],
  closes: number[],
  kPeriod: number = 9,
  dPeriod: number = 3
) {
  const kValues: number[] = [];
  const dValues: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < kPeriod - 1) {
      kValues.push(NaN);
      continue;
    }

    const slice = { highs: highs.slice(i - kPeriod + 1, i + 1), lows: lows.slice(i - kPeriod + 1, i + 1) };
    const highest = Math.max(...slice.highs);
    const lowest = Math.min(...slice.lows);
    const rsv = (closes[i] - lowest) / (highest - lowest) * 100;

    const prevK = kValues[i - 1] || 50;
    const k = (rsv + prevK * 2) / 3;
    kValues.push(k);
  }

  for (let i = 0; i < kValues.length; i++) {
    if (i < dPeriod - 1) {
      dValues.push(NaN);
    } else {
      const d = kValues.slice(i - dPeriod + 1, i + 1).reduce((a, b) => a + b, 0) / dPeriod;
      dValues.push(d);
    }
  }

  return { k: kValues, d: dValues };
}

/**
 * RSI 指標 (相對強度指標)
 * @param prices 收盤價
 * @param period 週期 (預設 14)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const changes: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }

  avgGain /= period;
  avgLoss /= period;

  rsi.push(NaN); // 第一個值無法計算

  for (let i = period; i < changes.length; i++) {
    if (changes[i] > 0) avgGain = (avgGain * (period - 1) + changes[i]) / period;
    else avgLoss = (avgLoss * (period - 1) + Math.abs(changes[i])) / period;

    const rs = avgGain / avgLoss;
    const rsiValue = 100 - 100 / (1 + rs);
    rsi.push(rsiValue);
  }

  return rsi;
}

/**
 * ATR 指標 (平均真實波幅)
 * @param highs 最高價
 * @param lows 最低價
 * @param closes 收盤價
 * @param period 週期 (預設 14)
 */
export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const tr: number[] = [];
  const atr: number[] = [];

  // 計算 True Range
  for (let i = 0; i < highs.length; i++) {
    let trValue: number;
    if (i === 0) {
      trValue = highs[i] - lows[i];
    } else {
      const hl = highs[i] - lows[i];
      const hc = Math.abs(highs[i] - closes[i - 1]);
      const lc = Math.abs(lows[i] - closes[i - 1]);
      trValue = Math.max(hl, hc, lc);
    }
    tr.push(trValue);
  }

  // 計算 ATR
  for (let i = 0; i < tr.length; i++) {
    if (i < period - 1) {
      atr.push(NaN);
    } else if (i === period - 1) {
      const sum = tr.slice(0, period).reduce((a, b) => a + b, 0);
      atr.push(sum / period);
    } else {
      const prevATR = atr[i - 1];
      const atrValue = (prevATR * (period - 1) + tr[i]) / period;
      atr.push(atrValue);
    }
  }

  return atr;
}

// ============ 摩擦成本計算 ============

/**
 * 計算買進的實際成本（包含手續費與低消）
 */
export function calculateBuyCost(
  quantity: number,
  price: number,
  isETF: boolean = true
): { totalCost: number; fee: number; actualCost: number } {
  const grossCost = quantity * price;
  const fee = Math.max(FRICTION_CONSTANTS.MIN_FEE, grossCost * FRICTION_CONSTANTS.BUY_FEE_RATE);
  const totalCost = grossCost + fee;
  return { totalCost, fee, actualCost: grossCost };
}

/**
 * 計算賣出的實際收益（扣除手續費與稅金）
 */
export function calculateSellProceeds(
  quantity: number,
  price: number,
  isETF: boolean = true
): { netProceeds: number; fee: number; tax: number; grossProceeds: number } {
  const grossProceeds = quantity * price;
  const fee = Math.max(FRICTION_CONSTANTS.MIN_FEE, grossProceeds * FRICTION_CONSTANTS.SELL_FEE_RATE);
  const taxRate = isETF ? FRICTION_CONSTANTS.ETF_TAX_RATE : FRICTION_CONSTANTS.STOCK_TAX_RATE;
  const tax = grossProceeds * taxRate;
  const netProceeds = grossProceeds - fee - tax;
  return { netProceeds, fee, tax, grossProceeds };
}

/**
 * 計算淨損益與報酬率
 */
export function calculateNetPnL(
  costBasis: number,
  currentPrice: number,
  quantity: number,
  isETF: boolean = true
): {
  unrealizedPnL: number;
  unrealizedReturn: number;
  netPnL: number;
  netReturn: number;
  sellProceeds: number;
} {
  const unrealizedPnL = (currentPrice - costBasis) * quantity;
  const unrealizedReturn = (unrealizedPnL / (costBasis * quantity)) * 100;

  const { netProceeds } = calculateSellProceeds(quantity, currentPrice, isETF);
  const totalCost = costBasis * quantity;
  const netPnL = netProceeds - totalCost;
  const netReturn = (netPnL / totalCost) * 100;

  return {
    unrealizedPnL,
    unrealizedReturn,
    netPnL,
    netReturn,
    sellProceeds: netProceeds,
  };
}

// ============ 風控邏輯 ============

/**
 * 計算 ATR 動態移動停利線
 * @param highPrice 前期最高價
 * @param atr ATR 值
 * @param multiplier ATR 倍數 (預設 2)
 * @param boxSupport 箱子支撐價
 */
export function calculateTrailingStopPrice(
  highPrice: number,
  atr: number,
  multiplier: number = 2,
  boxSupport: number = 0
): number {
  const stopPrice = highPrice - multiplier * atr;
  return Math.max(stopPrice, boxSupport);
}

/**
 * 評估現金部位風險
 */
export function evaluateCashRisk(cashRatio: number): {
  level: "safe" | "warning" | "danger";
  message: string;
  color: string;
} {
  if (cashRatio >= 0.2) {
    return { level: "safe", message: "現金充足，可靈活佈局", color: "green" };
  } else if (cashRatio >= 0.1) {
    return { level: "warning", message: "⚠️ 現金不足 20%，建議謹慎加碼", color: "yellow" };
  } else {
    return { level: "danger", message: "🚨 現金低於 10%，嚴禁一次性歐印！", color: "red" };
  }
}

/**
 * 評估融資過熱風險
 */
export function evaluateFinancingRisk(
  financingMarketValue: number,
  totalMarketValue: number
): { level: "safe" | "warning" | "danger"; message: string; color: string } {
  const ratio = financingMarketValue / totalMarketValue;

  if (ratio < 0.15) {
    return { level: "safe", message: "融資比例健康", color: "green" };
  } else if (ratio < 0.25) {
    return { level: "warning", message: "⚠️ 融資比例偏高，警惕高檔回檔", color: "yellow" };
  } else {
    return { level: "danger", message: "🔴 融資過熱！高檔融資暴衝量大不漲，不要進去送人頭！", color: "red" };
  }
}

/**
 * 評估均線排列（看漲/看跌/混亂）
 */
export function evaluateMAArrangement(
  ma5: number,
  ma10: number,
  ma20: number,
  ma60: number
): { signal: "bullish" | "bearish" | "neutral"; message: string } {
  if (ma5 > ma10 && ma10 > ma20 && ma20 > ma60) {
    return { signal: "bullish", message: "均線多頭排列，趨勢向上" };
  } else if (ma5 < ma10 && ma10 < ma20 && ma20 < ma60) {
    return { signal: "bearish", message: "均線空頭排列，趨勢向下" };
  } else {
    return { signal: "neutral", message: "均線混亂，等待方向確立" };
  }
}

/**
 * 評估 KD 交叉信號
 */
export function evaluateKDCross(
  kPrev: number,
  dPrev: number,
  kCurr: number,
  dCurr: number
): { signal: "golden" | "death" | "none"; message: string } {
  if (kPrev <= dPrev && kCurr > dCurr) {
    return { signal: "golden", message: "K 線上穿 D 線，黃金交叉" };
  } else if (kPrev >= dPrev && kCurr < dCurr) {
    return { signal: "death", message: "K 線下穿 D 線，死亡交叉" };
  } else {
    return { signal: "none", message: "無明顯交叉信號" };
  }
}

/**
 * 評估 RSI 位階
 */
export function evaluateRSI(rsi: number): { level: "overbought" | "oversold" | "neutral"; message: string } {
  if (rsi > 70) {
    return { level: "overbought", message: "RSI 超買，警惕回檔" };
  } else if (rsi < 30) {
    return { level: "oversold", message: "RSI 超賣，可考慮佈局" };
  } else {
    return { level: "neutral", message: "RSI 中性，無明顯信號" };
  }
}

// ============ 加碼梯次計算 ============

/**
 * 計算加碼梯次一（季線撐）
 */
export function calculateAdditionTier1(
  ma60: number,
  availableCash: number,
  isETF: boolean = true
): { quantity: number; orderPrice: number; totalCost: number; remainingCash: number } {
  const orderPrice = Math.floor(ma60 * 100) / 100; // 四捨五入到小數點後兩位
  const { totalCost } = calculateBuyCost(1, orderPrice, isETF);

  let maxQuantity = Math.floor(availableCash / totalCost);
  let actualTotalCost = 0;

  // 精確計算可買股數
  for (let q = maxQuantity; q >= 1; q--) {
    const { totalCost: cost } = calculateBuyCost(q, orderPrice, isETF);
    if (cost <= availableCash) {
      actualTotalCost = cost;
      maxQuantity = q;
      break;
    }
  }

  return {
    quantity: maxQuantity,
    orderPrice,
    totalCost: actualTotalCost,
    remainingCash: availableCash - actualTotalCost,
  };
}

/**
 * 計算加碼梯次二（布林下軌）
 */
export function calculateAdditionTier2(
  bollingerLower: number,
  availableCash: number,
  isETF: boolean = true
): { quantity: number; orderPrice: number; totalCost: number; remainingCash: number } {
  const orderPrice = Math.floor(bollingerLower * 100) / 100;
  const { totalCost } = calculateBuyCost(1, orderPrice, isETF);

  let maxQuantity = Math.floor(availableCash / totalCost);
  let actualTotalCost = 0;

  for (let q = maxQuantity; q >= 1; q--) {
    const { totalCost: cost } = calculateBuyCost(q, orderPrice, isETF);
    if (cost <= availableCash) {
      actualTotalCost = cost;
      maxQuantity = q;
      break;
    }
  }

  return {
    quantity: maxQuantity,
    orderPrice,
    totalCost: actualTotalCost,
    remainingCash: availableCash - actualTotalCost,
  };
}

/**
 * 計算獲利調節（部分減碼）
 */
export function calculateProfitTaking(
  currentPrice: number,
  quantity: number,
  availableCash: number,
  isETF: boolean = true
): { quantity: number; orderPrice: number; netProceeds: number; totalCash: number } {
  const orderPrice = currentPrice;
  const { netProceeds } = calculateSellProceeds(quantity, orderPrice, isETF);

  return {
    quantity,
    orderPrice,
    netProceeds,
    totalCash: availableCash + netProceeds,
  };
}
