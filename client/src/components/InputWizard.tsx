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
import { ChevronRight, ChevronLeft, Upload, FileCheck } from 'lucide-react';
import type { YunfengChipData } from '@/lib/types';

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
  yunfengChips: YunfengChipData;
}

const DEFAULT_DATA: WizardData = {
  symbol: '0050',
  quantity: 18313,
  costBasis: 82.97,
  availableCash: 100868,
  currentPrice: 103.0,
  brokerDiscount: 0.6,
  taxRate: 0.001,
  yunfengChips: {
    majorBrokerConcentration: 8.5,
    majorBrokerNetVolume: 1250,
    foreignNetBuy: 2300,
    investmentTrustNetBuy: 850,
    dealerNetBuy: -120,
    largeHolder400Ratio: 68.5,
    largeHolder1000Ratio: 52.3,
    largeHolderChangeTrend: 'accumulate',
  },
};

export function InputWizard({ onSubmit }: InputWizardProps) {
  const [step, setStep] = useState<'basic' | 'market' | 'friction' | 'chips'>('basic');
  const [data, setData] = useState<WizardData>(DEFAULT_DATA);

  const handleInputChange = (field: keyof WizardData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleChipChange = (field: keyof YunfengChipData, value: any) => {
    setData(prev => ({
      ...prev,
      yunfengChips: {
        ...prev.yunfengChips,
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step === 'basic') setStep('market');
    else if (step === 'market') setStep('friction');
    else if (step === 'friction') setStep('sinopac');
  };

  const handlePrev = () => {
    if (step === 'sinopac') setStep('friction');
    else if (step === 'friction') setStep('market');
    else if (step === 'market') setStep('basic');
  };

  const handleSubmit = () => {
    onSubmit?.(data);
  };

  return (
    <Card className="muscle-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl">肌肉書僮參數設定</CardTitle>
        <CardDescription>四步驟快速設定您的交易參數與永豐金籌碼數據</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="text-xs sm:text-sm">A 標的庫存</TabsTrigger>
            <TabsTrigger value="market" className="text-xs sm:text-sm">B 即時數據</TabsTrigger>
            <TabsTrigger value="friction" className="text-xs sm:text-sm">C 摩擦成本</TabsTrigger>
            <TabsTrigger value="chips" className="text-xs sm:text-sm">D 永豐金籌碼</TabsTrigger>
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

          {/* 步驟 D：永豐金籌碼數據與照片 */}
          <TabsContent value="sinopac" className="space-y-4">
            <div className="border border-accent/40 bg-accent/5 rounded-lg p-4 space-y-3">
              <p className="text-sm font-bold text-accent">📸 上傳永豐金 App 籌碼截圖 (選填)</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="bg-input border-border text-xs cursor-pointer"
              />
              {data.chipScreenshotUrl && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">截圖預覽：</p>
                  <img
                    src={data.chipScreenshotUrl}
                    alt="永豐金籌碼截圖"
                    className="max-h-40 rounded border border-border object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sinopacBrokerConcentration">分點主力集中度 (%)</Label>
                <Input
                  id="sinopacBrokerConcentration"
                  type="number"
                  step="0.1"
                  value={data.sinopacBrokerConcentration ?? ''}
                  onChange={(e) => handleInputChange('sinopacBrokerConcentration', parseFloat(e.target.value) || 0)}
                  placeholder="例: 12.5"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionalNetBuy">三大法人買賣超 (張)</Label>
                <Input
                  id="institutionalNetBuy"
                  type="number"
                  value={data.institutionalNetBuy ?? ''}
                  onChange={(e) => handleInputChange('institutionalNetBuy', parseInt(e.target.value) || 0)}
                  placeholder="例: 3500"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="majorHolderRatio">大戶持股比例 (%)</Label>
                <Input
                  id="majorHolderRatio"
                  type="number"
                  step="0.1"
                  value={data.majorHolderRatio ?? ''}
                  onChange={(e) => handleInputChange('majorHolderRatio', parseFloat(e.target.value) || 0)}
                  placeholder="例: 68.2"
          {/* 步驟 D：永豐金籌碼與分點數據 */}
          <TabsContent value="chips" className="space-y-4">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">📱 永豐金證券籌碼與分點填寫</p>
                <p className="text-xs text-muted-foreground">可由永豐金 App 籌碼頁面填入或一鍵模擬導入數據</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    yunfengChips: {
                      majorBrokerConcentration: 12.8,
                      majorBrokerNetVolume: 2450,
                      foreignNetBuy: 3200,
                      investmentTrustNetBuy: 1100,
                      dealerNetBuy: 350,
                      largeHolder400Ratio: 72.4,
                      largeHolder1000Ratio: 56.1,
                      largeHolderChangeTrend: 'accumulate',
                    }
                  }));
                }}
              >
                <FileCheck className="w-3.5 h-3.5" />
                帶入範例數據
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="majorBrokerConcentration">主力集中度 (%)</Label>
                <Input
                  id="majorBrokerConcentration"
                  type="number"
                  step="0.1"
                  value={data.yunfengChips.majorBrokerConcentration}
                  onChange={(e) => handleChipChange('majorBrokerConcentration', parseFloat(e.target.value) || 0)}
                  placeholder="12.8"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="majorBrokerNetVolume">主力買賣超 (張)</Label>
                <Input
                  id="majorBrokerNetVolume"
                  type="number"
                  value={data.yunfengChips.majorBrokerNetVolume}
                  onChange={(e) => handleChipChange('majorBrokerNetVolume', parseInt(e.target.value) || 0)}
                  placeholder="2450"
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="foreignNetBuy" className="text-xs">外資買賣超</Label>
                <Input
                  id="foreignNetBuy"
                  type="number"
                  value={data.yunfengChips.foreignNetBuy}
                  onChange={(e) => handleChipChange('foreignNetBuy', parseInt(e.target.value) || 0)}
                  className="bg-input border-border text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="investmentTrustNetBuy" className="text-xs">投信買賣超</Label>
                <Input
                  id="investmentTrustNetBuy"
                  type="number"
                  value={data.yunfengChips.investmentTrustNetBuy}
                  onChange={(e) => handleChipChange('investmentTrustNetBuy', parseInt(e.target.value) || 0)}
                  className="bg-input border-border text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dealerNetBuy" className="text-xs">自營商買賣超</Label>
                <Input
                  id="dealerNetBuy"
                  type="number"
                  value={data.yunfengChips.dealerNetBuy}
                  onChange={(e) => handleChipChange('dealerNetBuy', parseInt(e.target.value) || 0)}
                  className="bg-input border-border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="largeHolder400Ratio">400張大戶持股比率 (%)</Label>
                <Input
                  id="largeHolder400Ratio"
                  type="number"
                  step="0.1"
                  value={data.yunfengChips.largeHolder400Ratio}
                  onChange={(e) => handleChipChange('largeHolder400Ratio', parseFloat(e.target.value) || 0)}
                  placeholder="72.4"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="largeHolder1000Ratio">1000張大戶持股比率 (%)</Label>
                <Input
                  id="largeHolder1000Ratio"
                  type="number"
                  step="0.1"
                  value={data.yunfengChips.largeHolder1000Ratio}
                  onChange={(e) => handleChipChange('largeHolder1000Ratio', parseFloat(e.target.value) || 0)}
                  placeholder="56.1"
                  className="bg-input border-border"
                />
              </div>
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

          {step !== 'chips' ? (
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
              開始分析 (帶入永豐金籌碼)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
