/**
 * 肌肉書僮狀態欄
 * 儀表板頂部即時資訊展示
 */

import { Card } from '@/components/ui/card';
import type { Account, MarketData } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface StatusBarProps {
  account: Account;
  marketData: MarketData;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function StatusBar({ account, marketData, onRefresh, isLoading }: StatusBarProps) {
  const pnl = (marketData.currentPrice - account.positions[0].costBasis) * account.positions[0].quantity;
  const pnlPercent = ((marketData.currentPrice - account.positions[0].costBasis) / account.positions[0].costBasis) * 100;

  const getPnLColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="muscle-card w-full mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
        {/* 標的與現價 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">標的</p>
          <p className="text-lg font-bold mt-1">{marketData.symbol}</p>
          <p className="text-xs text-muted-foreground mt-1">{marketData.name}</p>
        </div>

        {/* 即時價 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">即時價</p>
          <p className="text-lg font-bold text-accent mt-1">{marketData.currentPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">元</p>
        </div>

        {/* 帳面損益 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">帳面損益</p>
          <p className={`text-lg font-bold mt-1 ${getPnLColor(pnl)}`}>
            {pnl > 0 ? '+' : ''}{pnl.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <p className={`text-xs mt-1 ${getPnLColor(pnl)}`}>
            ({pnlPercent > 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
          </p>
        </div>

        {/* 股票市值 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">股票市值</p>
          <p className="text-lg font-bold mt-1 text-accent">
            {(account.stockValue / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground mt-1">{account.stockRatio.toFixed(1)}%</p>
        </div>

        {/* 可用現金 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">可用現金</p>
          <p className="text-lg font-bold mt-1 text-accent">
            {(account.availableCash / 10000).toFixed(1)}萬
          </p>
          <p className="text-xs text-muted-foreground mt-1">{account.cashRatio.toFixed(1)}%</p>
        </div>

        {/* 總資產 */}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">總資產</p>
          <p className="text-lg font-bold mt-1 text-accent">
            {(account.totalAssets / 1000000).toFixed(2)}M
          </p>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs text-muted-foreground hover:text-accent mt-1 transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>
    </Card>
  );
}
