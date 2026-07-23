/**
 * 肌肉書僮決策卡片
 * 模組三：買賣、調節與分梯加碼作戰路徑卡片
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TradeAction } from '@/lib/types';
import { Copy, AlertTriangle, TrendingUp, TrendingDown, Pause } from 'lucide-react';

interface ActionCardsProps {
  actions: TradeAction[];
}

export function ActionCards({ actions }: ActionCardsProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'profit_taking':
        return <TrendingDown className="w-5 h-5" />;
      case 'addition_tier1':
      case 'addition_tier2':
        return <TrendingUp className="w-5 h-5" />;
      case 'hold':
        return <Pause className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getActionBgColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500/10 border-red-500/30';
      case 'green':
        return 'bg-green-500/10 border-green-500/30';
      case 'blue':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'gray':
        return 'bg-gray-500/10 border-gray-500/30';
      default:
        return 'bg-accent/10 border-accent/30';
    }
  };

  const getActionTextColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-400';
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      case 'gray':
        return 'text-gray-400';
      default:
        return 'text-accent';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {actions.map((action, idx) => (
        <Card
          key={idx}
          className={`muscle-card border transition-all hover:shadow-xl ${getActionBgColor(action.color)}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-card/50 ${getActionTextColor(action.color)}`}>
                  {getActionIcon(action.type)}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{action.description}</p>

            {/* 數據展示 */}
            {action.type !== 'hold' && (
              <div className="bg-card/30 rounded-lg p-3 space-y-2">
                {action.orderPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">掛單價</span>
                    <span className="font-mono font-bold text-accent">
                      {action.orderPrice.toFixed(2)} 元
                    </span>
                  </div>
                )}

                {action.quantity && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">可買股數</span>
                    <span className="font-mono font-bold">
                      {action.quantity.toLocaleString()} 股
                    </span>
                  </div>
                )}

                {action.totalCost && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">扣款金額</span>
                    <span className="font-mono font-bold text-red-400">
                      NT$ {action.totalCost.toLocaleString('zh-TW', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                )}

                {action.netProceeds && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">淨實收</span>
                    <span className="font-mono font-bold text-green-400">
                      NT$ {action.netProceeds.toLocaleString('zh-TW', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                )}

                {action.remainingCash && (
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground font-semibold">剩餘現金</span>
                    <span className="font-mono font-bold text-accent">
                      NT$ {action.remainingCash.toLocaleString('zh-TW', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 風險警示 */}
            {action.type === 'profit_taking' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                <p className="text-xs text-red-400 font-semibold">
                  ⚠️ 獲利調節後，現金部位將增加。建議分梯次落袋，不要一次全部出場！
                </p>
              </div>
            )}

            {action.type === 'addition_tier1' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <p className="text-xs text-green-400 font-semibold">
                  💡 季線撐為中期支撐，適合分梯次加碼。配合 ATR 防守線使用效果更佳！
                </p>
              </div>
            )}

            {action.type === 'addition_tier2' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <p className="text-xs text-green-400 font-semibold">
                  💪 布林下軌為低檔支撐，此時加碼風險相對較低。但務必嚴守 ATR 防守線！
                </p>
              </div>
            )}

            {action.type === 'hold' && (
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-2">
                <p className="text-xs text-gray-400 font-semibold">
                  📊 當前市況無明顯買賣信號。耐心等待更好的佈局機會，不要無腦攤平！
                </p>
              </div>
            )}

            {/* 複製按鈕 */}
            {action.type !== 'hold' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 mt-4"
              >
                <Copy className="w-4 h-4" />
                複製掛單資訊
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
