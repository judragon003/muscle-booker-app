import { describe, it, expect } from 'vitest';
import {
  calculateSMA,
  calculateBollingerBands,
  calculateKD,
  calculateRSI,
  calculateATR,
  calculateBuyCost,
  calculateSellProceeds,
  calculateNetPnL,
  calculateTrailingStopPrice,
  evaluateCashRisk,
  evaluateFinancingRisk,
  evaluateMAArrangement,
  evaluateKDCross,
  evaluateRSI,
  evaluateYunfengChipRisk,
} from './calculations';

describe('💪 肌肉書僮 - 核心算力單元測試 (Unit Tests)', () => {
  describe('一、 技術指標計算測試', () => {
    it('應正確計算簡單移動平均數 (SMA)', () => {
      const prices = [10, 20, 30, 40, 50];
      const sma3 = calculateSMA(prices, 3);
      expect(sma3[0]).toBeNaN();
      expect(sma3[1]).toBeNaN();
      expect(sma3[2]).toBe(20); // (10+20+30)/3 = 20
      expect(sma3[4]).toBe(40); // (30+40+50)/3 = 40
    });

    it('應正確計算布林通道 (Bollinger Bands)', () => {
      const prices = Array.from({ length: 25 }, (_, i) => 100 + i);
      const bb = calculateBollingerBands(prices, 20, 2);
      expect(bb.length).toBe(25);
      const last = bb[bb.length - 1];
      expect(last.upper).toBeGreaterThan(last.middle);
      expect(last.lower).toBeLessThan(last.middle);
      expect(last.bandwidth).toBeCloseTo(last.upper - last.lower);
    });

    it('應正確計算 KD 隨機指標', () => {
      const highs = [105, 107, 108, 110, 109, 112, 115, 114, 116, 118];
      const lows = [95, 96, 97, 99, 98, 100, 102, 101, 103, 105];
      const closes = [100, 102, 105, 104, 106, 108, 110, 109, 112, 114];
      const kd = calculateKD(highs, lows, closes, 9, 3);
      expect(kd.k.length).toBe(closes.length);
      expect(kd.d.length).toBe(closes.length);
      const lastK = kd.k[kd.k.length - 1];
      expect(lastK).toBeGreaterThanOrEqual(0);
      expect(lastK).toBeLessThanOrEqual(100);
    });

    it('應正確計算 RSI 相對強弱指標', () => {
      const prices = [10, 12, 11, 13, 15, 14, 16, 18, 17, 19, 21, 20, 22, 24, 23, 25];
      const rsi = calculateRSI(prices, 14);
      const lastRSI = rsi[rsi.length - 1];
      expect(lastRSI).toBeGreaterThan(50);
      expect(lastRSI).toBeLessThanOrEqual(100);
    });

    it('應正確計算 ATR 平均真實波幅', () => {
      const highs = Array.from({ length: 20 }, () => 105);
      const lows = Array.from({ length: 20 }, () => 95);
      const closes = Array.from({ length: 20 }, () => 100);
      const atr = calculateATR(highs, lows, closes, 14);
      const lastATR = atr[atr.length - 1];
      expect(lastATR).toBeGreaterThan(0);
    });
  });

  describe('二、 摩擦成本與損益計算測試', () => {
    it('買進交易應符合手續費 6 折與 NT$20 最低門檻低消', () => {
      // 買 10 股 @ 10 元 = 100 元，計算手續費 100 * 0.0855% = 0.0855 元 < 20 元，應觸發低消 20 元
      const result = calculateBuyCost(10, 10, true);
      expect(result.fee).toBe(20);
      expect(result.totalCost).toBe(120);

      // 大額交易：10,000 股 @ 100 元 = 1,000,000 元，手續費 1,000,000 * 0.001425 * 0.6 = 855 元
      const largeResult = calculateBuyCost(10000, 100, true);
      expect(largeResult.fee).toBeCloseTo(855);
      expect(largeResult.totalCost).toBeCloseTo(1000855);
    });

    it('賣出交易應正確扣除手續費與證交稅 (ETF 0.1% vs 個股 0.3%)', () => {
      // ETF 賣出：10,000 股 @ 100 元 = 1,000,000 元
      const etfSell = calculateSellProceeds(10000, 100, true);
      expect(etfSell.tax).toBe(1000); // 0.1% ETF 稅
      expect(etfSell.fee).toBeCloseTo(855);
      expect(etfSell.netProceeds).toBeCloseTo(1000000 - 855 - 1000);

      // 個股賣出
      const stockSell = calculateSellProceeds(10000, 100, false);
      expect(stockSell.tax).toBe(3000); // 0.3% 個股稅
    });

    it('應正確計算淨損益與報酬率 (Net PnL)', () => {
      const pnl = calculateNetPnL(80, 100, 1000, true);
      expect(pnl.unrealizedPnL).toBe(20000);
      expect(pnl.unrealizedReturn).toBe(25);
      expect(pnl.netPnL).toBeLessThan(20000); // 扣除摩擦成本後應略少於帳面損益
    });
  });

  describe('三、 風控指標評估測試', () => {
    it('現金比例評估：小於 10% 應引發 danger 警示', () => {
      expect(evaluateCashRisk(0.25).level).toBe('safe');
      expect(evaluateCashRisk(0.15).level).toBe('warning');
      expect(evaluateCashRisk(0.05).level).toBe('danger');
    });

    it('融資比例評估：大於 25% 應回傳融資過熱警示', () => {
      expect(evaluateFinancingRisk(10000, 100000).level).toBe('safe');
      expect(evaluateFinancingRisk(30000, 100000).level).toBe('danger');
    });

    it('均線排列評估：MA5 > MA10 > MA20 > MA60 應回傳多頭排列', () => {
      const result = evaluateMAArrangement(100, 90, 80, 70);
      expect(result.signal).toBe('bullish');
    });

    it('KD 交叉評估：前一根 K <= D 且當前 K > D 應為黃金交叉', () => {
      const result = evaluateKDCross(40, 45, 50, 48);
      expect(result.signal).toBe('golden');
    });

    it('ATR 動態移動停利價應取 (最高價 - N*ATR) 與箱體支撐的大值', () => {
      const stopPrice = calculateTrailingStopPrice(120, 5, 2, 100);
      // 120 - 2*5 = 110 > 100 支撐
      expect(stopPrice).toBe(110);
    });

    it('永豐金籌碼評估：主力集中度負向且法人賣超應回傳 bearish 且收緊 ATR 防守倍數', () => {
      const bearishChips = {
        majorBrokerConcentration: -5.5,
        majorBrokerNetVolume: -1000,
        foreignNetBuy: -500,
        investmentTrustNetBuy: -300,
        dealerNetBuy: 0,
        largeHolder400Ratio: 60,
        largeHolder1000Ratio: 45,
        largeHolderChangeTrend: 'distribute' as const,
      };
      const result = evaluateYunfengChipRisk(bearishChips);
      expect(result.level).toBe('bearish');
      expect(result.atrMultiplier).toBe(1.25);
    });
  });
});
