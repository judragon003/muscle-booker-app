/**
 * 肌肉書僮儀表板首頁
 * 完整的台股波段風控決策系統
 */

import { useState } from 'react';
import { useDashboardState } from '@/hooks/useDashboardState';
import { InputWizard } from '@/components/InputWizard';
import { StatusBar } from '@/components/StatusBar';
import { IndicatorCards } from '@/components/IndicatorCards';
import { ActionCards } from '@/components/ActionCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const { state, loading, error, updateFromWizard, refresh } = useDashboardState();
  const [showWizard, setShowWizard] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-muted-foreground">正在初始化肌肉書僮儀表板...</p>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="muscle-card border-destructive/50 bg-destructive/10 max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              初始化失敗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error || '無法載入儀表板數據'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 頁面標題 */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent">💪 肌肉書僮</h1>
              <p className="text-muted-foreground mt-1">台股波段風控決策儀表板</p>
            </div>
            <button
              onClick={() => setShowWizard(!showWizard)}
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:shadow-lg hover:shadow-accent/50 transition-all font-semibold"
            >
              {showWizard ? '關閉設定' : '⚙️ 參數設定'}
            </button>
          </div>
        </div>
      </div>

      {/* 主容器 */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 參數輸入向導 */}
        {showWizard && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <InputWizard onSubmit={(wizardData) => {
              updateFromWizard(wizardData);
              setShowWizard(false);
            }} />
          </div>
        )}

        {/* 狀態欄 */}
        <StatusBar
          account={state.account}
          marketData={state.marketData}
          onRefresh={refresh}
          isLoading={loading}
        />

        {/* 風控指標卡片 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 風控指標</h2>
            <p className="text-muted-foreground">實時技術指標與風險評估</p>
          </div>
          <IndicatorCards
            riskIndicators={state.riskIndicators}
            marketData={state.marketData}
          />
        </div>

        {/* 現金風險警示 */}
        {state.riskIndicators.cashRisk.level !== 'safe' && (
          <Card className="muscle-card border-destructive/50 bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                {state.riskIndicators.cashRisk.message}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {state.riskIndicators.cashRisk.level === 'warning'
                  ? '建議在當前現金部位下，採用分梯次掛單策略，避免一次性投入過多資金。'
                  : '嚴禁一次性歐印！您的單早已經被監控了。請立即執行分梯加碼計畫，或考慮部分減碼落袋。'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 融資過熱警示 */}
        {state.riskIndicators.financingRisk.level === 'danger' && (
          <Card className="muscle-card border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                高檔融資暴衝！
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                融資市值比過高，市場風險加大。量大不漲是主力出貨信號，不要進去送人頭！建議嚴守 ATR 防守線，設定好停損點位。
              </p>
            </CardContent>
          </Card>
        )}

        {/* 交易建議卡片 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎯 交易建議</h2>
            <p className="text-muted-foreground">基於肌肉書僮風控邏輯的買賣決策</p>
          </div>
          <ActionCards actions={state.tradeActions} />
        </div>

        {/* 肌肉書僮心法 */}
        <Card className="muscle-card border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle>💡 肌肉書僮心法</CardTitle>
            <CardDescription>交易紀律與風控要點</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              ✅ <span className="font-semibold">數據導向</span>：經濟看數據，政治看風向。不要被情緒主導，嚴格按照指標執行。
            </p>
            <p>
              ✅ <span className="font-semibold">箱子戰術</span>：連續三日不創高確立箱頂，連續三日不創低確立箱底。
            </p>
            <p>
              ✅ <span className="font-semibold">ATR 防守</span>：1.5~2 倍 ATR 為移動停利線，收盤跌破即強制落袋，絕不鬆綁！
            </p>
            <p>
              ✅ <span className="font-semibold">嚴禁攤平</span>：高檔融資異常飆升且量大不漲，就是被監控信號。不要無腦逢低加碼！
            </p>
            <p>
              ✅ <span className="font-semibold">雙重過濾</span>：成交量 &gt; 1000 張、週轉率 3~7%、投量比、籌碼集中度。
            </p>
          </CardContent>
        </Card>

        {/* 頁腳 */}
        <div className="border-t border-border pt-8 pb-4 text-center text-xs text-muted-foreground">
          <p>肌肉書僮 © 2026 | 台股波段風控決策儀表板</p>
          <p className="mt-2">
            ⚠️ 免責聲明：本應用僅供參考，不構成投資建議。投資有風險，交易需謹慎。
          </p>
        </div>
      </div>
    </div>
  );
}
