/**
 * 肌肉書僮指標燈號卡片
 * 模組二：技術指標運算與燈號卡片
 */

import { Card, CardContent } from '@/components/ui/card';
import type { RiskIndicators, MarketData } from '@/lib/types';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface IndicatorCardsProps {
  riskIndicators: RiskIndicators;
  marketData: MarketData;
}

export function IndicatorCards({ riskIndicators, marketData }: IndicatorCardsProps) {
  const getIndicatorColor = (level: string) => {
    switch (level) {
      case 'safe':
      case 'bullish':
      case 'golden':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'warning':
      case 'neutral':
      case 'none':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'danger':
      case 'bearish':
      case 'death':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'overbought':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'oversold':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusLight = (level: string) => {
    switch (level) {
      case 'safe':
      case 'bullish':
      case 'golden':
      case 'oversold':
        return '🟢';
      case 'warning':
      case 'neutral':
      case 'none':
        return '🟡';
      case 'danger':
      case 'bearish':
      case 'death':
      case 'overbought':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* 現金風險指標 */}
      <Card className={`muscle-card border ${getIndicatorColor(riskIndicators.cashRisk.level)}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">現金風險</p>
              <p className="text-2xl font-bold mt-1">{getStatusLight(riskIndicators.cashRisk.level)}</p>
            </div>
            <AlertCircle className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">{riskIndicators.cashRisk.message}</p>
          <p className="text-xs text-muted-foreground mt-2">現金佔比 {((marketData.volume * marketData.currentPrice) / 1000000).toFixed(1)}%</p>
        </CardContent>
      </Card>

      {/* 融資風險指標 */}
      <Card className={`muscle-card border ${getIndicatorColor(riskIndicators.financingRisk.level)}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">融資風險</p>
              <p className="text-2xl font-bold mt-1">{getStatusLight(riskIndicators.financingRisk.level)}</p>
            </div>
            <TrendingUp className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">{riskIndicators.financingRisk.message}</p>
          <p className="text-xs text-muted-foreground mt-2">融資餘額 {marketData.financingBalance.toLocaleString()} 張</p>
        </CardContent>
      </Card>

      {/* 均線排列指標 */}
      <Card className={`muscle-card border ${getIndicatorColor(riskIndicators.maArrangement.signal)}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">均線排列</p>
              <p className="text-2xl font-bold mt-1">{getStatusLight(riskIndicators.maArrangement.signal)}</p>
            </div>
            <TrendingUp className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">{riskIndicators.maArrangement.message}</p>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>MA5: {marketData.ma5.toFixed(2)} | MA10: {marketData.ma10.toFixed(2)}</p>\n            <p>MA20: {marketData.ma20.toFixed(2)} | MA60: {marketData.ma60.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* KD 交叉指標 */}
      <Card className={`muscle-card border ${getIndicatorColor(riskIndicators.kdCross.signal)}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">KD 交叉</p>
              <p className="text-2xl font-bold mt-1">{getStatusLight(riskIndicators.kdCross.signal)}</p>
            </div>
            <Zap className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">{riskIndicators.kdCross.message}</p>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>K: {marketData.k.toFixed(2)} | D: {marketData.d.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* RSI 位階指標 */}
      <Card className={`muscle-card border ${getIndicatorColor(riskIndicators.rsiLevel.level)}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">RSI 位階</p>
              <p className="text-2xl font-bold mt-1">{getStatusLight(riskIndicators.rsiLevel.level)}</p>
            </div>
            <TrendingUp className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">{riskIndicators.rsiLevel.message}</p>
          <div className="text-xs text-muted-foreground mt-2">
            <div className="w-full bg-card/50 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.min(marketData.rsi, 100)}%` }}
              />
            </div>
            <p className="mt-1">RSI: {marketData.rsi.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* ATR 動態停利線 */}
      <Card className="muscle-card border border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">ATR 防守線</p>
              <p className="text-2xl font-bold mt-1 text-accent">🛡️</p>
            </div>
            <AlertCircle className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium">ATR 動態移動停利線</p>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>防守價: {riskIndicators.atrTrailingStop.toFixed(2)} 元</p>
            <p>ATR(14): {marketData.atr.toFixed(2)}</p>
            <p className="text-accent font-semibold mt-2">收盤跌破即強制落袋！</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
