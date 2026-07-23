/**
 * 肌肉書僮儀表板狀態管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import type { DashboardState, Account, MarketData, RiskIndicators, TradeAction } from '@/lib/types';
import { generateSampleDashboardState } from '@/lib/sampleData';

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

  // 刷新整個狀態
  const refresh = useCallback(() => {
    setLoading(true);
    try {
      const newState = generateSampleDashboardState();
      setState(newState);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    state,
    loading,
    error,
    updateAccount,
    updateMarketData,
    updateRiskIndicators,
    updateTradeActions,
    refresh,
  };
}
