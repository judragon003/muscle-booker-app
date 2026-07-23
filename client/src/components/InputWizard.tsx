/**
 * 肌肉書僮互動式參數輸入卡片
 * 模組一：/grill-me 互動式參數輸入向導
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface InputWizardProps {
  onSubmit?: (data: WizardData) => void;
}

export interface WizardData {
  symbol: string;
  quantity: number;
  costBasis: number;
  availableCash: number;
  currentPrice: number;
  brokerDiscount: number;
  taxRate: number;
}

const DEFAULT_DATA: WizardData = {
  symbol: '0050',
  quantity: 18313,
  costBasis: 82.97,
  availableCash: 100868,
  currentPrice: 103.0,
  brokerDiscount: 0.6,
  taxRate: 0.001,
};

export function InputWizard({ onSubmit }: InputWizardProps) {
  const [step, setStep] = useState<'basic' | 'market' | 'friction'>('basic');
  const [data, setData] = useState<WizardData>(DEFAULT_DATA);

  const handleInputChange = (field: keyof WizardData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 'basic') setStep('market');
    else if (step === 'market') setStep('friction');
  };

  const handlePrev = () => {
    if (step === 'friction') setStep('market');
    else if (step === 'market') setStep('basic');
  };

  const handleSubmit = () => {
    onSubmit?.(data);
  };

  return (
    <Card className="muscle-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl">肌肉書僮參數設定</CardTitle>
        <CardDescription>三步驟快速設定您的交易參數</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic" className="text-sm">步驟 A 標的與庫存</TabsTrigger>
            <TabsTrigger value="market" className="text-sm">步驟 B 即時數據</TabsTrigger>
            <TabsTrigger value="friction" className="text-sm">步驟 C 摩擦成本</TabsTrigger>
          </TabsList>

          {/* 步驟 A：標的與庫存 */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">股票代號</Label>
              <Input
                id="symbol"
                value={data.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="例：0050"
                className="bg-input border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">持股股數</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={data.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  placeholder="18313"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costBasis">均價成本</Label>
                <Input
                  id="costBasis"
                  type="number"
                  step="0.01"
                  value={data.costBasis}
                  onChange={(e) => handleInputChange('costBasis', parseFloat(e.target.value) || 0)}
                  placeholder="82.97"
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCash">可用現金 (NT$)</Label>
              <Input
                id="availableCash"
                type="number"
                value={data.availableCash}
                onChange={(e) => handleInputChange('availableCash', parseInt(e.target.value) || 0)}
                placeholder="100868"
                className="bg-input border-border"
              />
            </div>
          </TabsContent>

          {/* 步驟 B：即時數據 */}
          <TabsContent value="market" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPrice">即時價 (NT$)</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                value={data.currentPrice}
                onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value) || 0)}
                placeholder="103.00"
                className="bg-input border-border text-lg font-bold text-accent"
              />
              <p className="text-xs text-muted-foreground mt-2">
                提示：此價格用於計算未實現損益與交易建議
              </p>
            </div>

            <div className="bg-card/50 border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">預計帳面損益</p>
              <p className="text-lg">
                <span className="text-accent font-bold">
                  NT$ {((data.currentPrice - data.costBasis) * data.quantity).toLocaleString('zh-TW', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="text-muted-foreground ml-2">
                  ({(((data.currentPrice - data.costBasis) / data.costBasis) * 100).toFixed(2)}%)
                </span>
              </p>
            </div>
          </TabsContent>

          {/* 步驟 C：摩擦成本 */}
          <TabsContent value="friction" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brokerDiscount">手續費折扣</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="brokerDiscount"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={data.brokerDiscount}
                  onChange={(e) => handleInputChange('brokerDiscount', parseFloat(e.target.value) || 0)}
                  placeholder="0.6"
                  className="bg-input border-border flex-1"
                />
                <span className="text-sm text-muted-foreground">折</span>
              </div>
              <p className="text-xs text-muted-foreground">
                預設 6 折 = 0.0855% (標準 0.1425% × 60%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">證交稅率</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="taxRate"
                  type="number"
                  step="0.0001"
                  value={data.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  placeholder="0.001"
                  className="bg-input border-border flex-1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ETF 0.1% | 個股 0.3%
              </p>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-destructive mb-2">重要提醒</p>
              <p className="text-xs text-muted-foreground">
                所有計算均已包含手續費低消 (NT$ 20) 與稅金。實際成交價格可能因市場波動而異。
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* 導航按鈕 */}
        <div className="flex justify-between gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 'basic'}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </Button>

          {step !== 'friction' ? (
            <Button
              onClick={handleNext}
              className="muscle-button-primary flex items-center gap-2 flex-1"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="muscle-button-primary flex-1 font-bold"
            >
              開始分析
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
