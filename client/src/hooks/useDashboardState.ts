/**
 * 肌肉書僮儀表板狀態管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import type { DashboardState, Account, MarketData, RiskIndicators, TradeAction } from '@/lib/types';
import type { WizardData } from '@/components/InputWizard';
import {
  generateSampleDashboardState,
  generateSampleMarketData,
  generateSampleAccount,
  generateRiskIndicators,
  generateTradeActions
} from '@/lib/sampleData';
import { calculateNetPnL } from '@/lib/calculations';
import { fetchRealStockData } from '@/lib/stockApi';

export function useDashboardState() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化狀態
  useEffect(() => {
    try {
      const initialState = generateSampleDashboardState();
      setState(initialState);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '初始化失敗');
      setLoading(false);
    }
  }, []);

  // 從 WizardData 更新狀態
  const updateFromWizard = useCallback((wizardData: WizardData) => {
    setLoading(true);
    try {
      const marketData = generateSampleMarketData();
      marketData.symbol = wizardData.symbol || '0050';
      marketData.currentPrice = wizardData.currentPrice || marketData.currentPrice;

      const quantity = wizardData.quantity;
      const costBasis = wizardData.costBasis;
      const availableCash = wizardData.availableCash;

      const stockValue = quantity * marketData.currentPrice;
      const totalAssets = stockValue + availableCash;
      const stockRatio = totalAssets > 0 ? (stockValue / totalAssets) * 100 : 0;
      const cashRatio = totalAssets > 0 ? (availableCash / totalAssets) * 100 : 0;

      const pnl = calculateNetPnL(costBasis, marketData.currentPrice, quantity, true);

      const account: Account = {
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

      const riskIndicators = generateRiskIndicators(account, marketData);
      const tradeActions = generateTradeActions(account, marketData, riskIndicators);

      setState({
        account,
        marketData,
        riskIndicators,
        tradeActions,
        lastUpdated: new Date(),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新帳戶信息
  const updateAccount = useCallback((account: Account) => {
    setState(prev => prev ? { ...prev, account, lastUpdated: new Date() } : null);
  }, []);

  // 更新市場數據
  const updateMarketData = useCallback((marketData: MarketData) => {
    setState(prev => prev ? { ...prev, marketData, lastUpdated: new Date() } : null);
  }, []);

  // 更新風控指標
  const updateRiskIndicators = useCallback((riskIndicators: RiskIndicators) => {
    setState(prev => prev ? { ...prev, riskIndicators, lastUpdated: new Date() } : null);
  }, []);

  // 更新交易建議
  const updateTradeActions = useCallback((tradeActions: TradeAction[]) => {
    setState(prev => prev ? { ...prev, tradeActions, lastUpdated: new Date() } : null);
  }, []);

  // 刷新整個狀態（抓取真實即時行情）
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const currentSymbol = state?.marketData.symbol || '0050';
      const realMarketData = await fetchRealStockData(currentSymbol);
      
      setState(prev => {
        if (!prev) return generateSampleDashboardState();
        const account = generateSampleAccount(realMarketData);
        const riskIndicators = generateRiskIndicators(account, realMarketData);
        const tradeActions = generateTradeActions(account, realMarketData, riskIndicators);
        return {
          account,
          marketData: realMarketData,
          riskIndicators,
          tradeActions,
          lastUpdated: new Date(),
        };
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失敗');
    } finally {
      setLoading(false);
    }
  }, [state?.marketData.symbol]);

  return {
    state,
    loading,
    error,
    updateFromWizard,
    updateAccount,
    updateMarketData,
    updateRiskIndicators,
    updateTradeActions,
    refresh,
  };
}

