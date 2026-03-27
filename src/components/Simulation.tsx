import React, { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw, ArrowRight, Calculator } from "lucide-react";
import { DealData } from "../../server/calcEngine";

const initialData: DealData = {
  property: {
    landArea: 100,
    buildingArea: 300,
    builtYear: 2010,
    structure: "RC",
    residentialRatio: 1.0,
  },
  rentRoll: {
    totalRentMonthly: 1000000,
    vacancyRate: 0.05,
  },
  expenses: {
    managementFeeRate: 0.0,
    repairFundMonthly: 50000,
    propertyTaxAnnual: 300000,
    otherExpensesAnnual: 100000,
  },
  transaction: {
    purchasePrice: 1100000000,
    brokerageFeeRate: 0.03,
    registrationFee: 500000,
    acquisitionTax: 1000000,
    consultingFee: 32868000,
    renovationCost: 0,
  },
  financing: {
    loanAmount: 1000000000,
    interestRate: 0.03,
    loanTermYears: 1,
    amortizationYears: 15,
    loanAdminFee: 11000000,
  },
  investmentParams: {
    targetCapRate: 0.05,
    exitCapRate: 0.03,
    holdingPeriodYears: 1,
  },
};

export function Simulation() {
  const [data, setData] = useState<DealData>(initialData);
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const calculate = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      setResults(resData);
    } catch (error) {
      console.error("Calculation failed", error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [data]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const ocrData = await response.json();
      
      // Update state with OCR data
      setData((prev) => ({
        ...prev,
        property: { ...prev.property, ...ocrData.property },
        rentRoll: { ...prev.rentRoll, totalRentMonthly: ocrData.rentRoll.totalRent },
      }));
      setOcrStatus("success");
    } catch (error) {
      console.error("OCR failed", error);
      setOcrStatus("error");
    }
  };

  const handleInputChange = (category: keyof DealData, field: string, value: number | string) => {
    setData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column: Inputs */}
      <div className="xl:col-span-2 space-y-6">
        {/* OCR Upload Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              資料アップロード (OCR解析)
            </h2>
            {ocrStatus === "uploading" && <span className="text-sm text-blue-500 flex items-center gap-1"><RefreshCw className="w-4 h-4 animate-spin" /> 解析中...</span>}
            {ocrStatus === "success" && <span className="text-sm text-emerald-500 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 読取完了</span>}
            {ocrStatus === "error" && <span className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> エラー</span>}
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".pdf,image/*" />
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">物件概要書・レントロールをドラッグ＆ドロップ</p>
            <p className="text-slate-400 text-sm mt-1">またはクリックしてファイルを選択</p>
          </div>
        </div>

        {/* Input Forms */}
        <div className="space-y-8">
          {/* Auto-extracted Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-slate-800">自動抽出項目 <span className="text-sm font-normal text-slate-500">(物件概要書・レントロール)</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Details */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">OCR対象</div>
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">物件詳細</h4>
                <div className="space-y-4">
                  <InputField label="土地面積 (㎡)" value={data.property.landArea} onChange={(v) => handleInputChange("property", "landArea", Number(v))} />
                  <InputField label="建物面積 (㎡)" value={data.property.buildingArea} onChange={(v) => handleInputChange("property", "buildingArea", Number(v))} />
                  <InputField label="築年" value={data.property.builtYear} onChange={(v) => handleInputChange("property", "builtYear", Number(v))} />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">構造</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={data.property.structure} onChange={(e) => handleInputChange("property", "structure", e.target.value)}>
                      <option value="RC">RC (鉄筋コンクリート)</option>
                      <option value="S">S (鉄骨)</option>
                      <option value="W">W (木造)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rent Roll */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">OCR対象</div>
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">賃料・経費</h4>
                <div className="space-y-4">
                  <InputField label="月額総賃料 (円)" value={data.rentRoll.totalRentMonthly} onChange={(v) => handleInputChange("rentRoll", "totalRentMonthly", Number(v))} />
                  <InputField label="月額修繕積立金 (円)" value={data.expenses.repairFundMonthly} onChange={(v) => handleInputChange("expenses", "repairFundMonthly", Number(v))} />
                  <InputField label="年間固定資産税 (円)" value={data.expenses.propertyTaxAnnual} onChange={(v) => handleInputChange("expenses", "propertyTaxAnnual", Number(v))} />
                  <InputField label="その他年間経費 (円)" value={data.expenses.otherExpensesAnnual} onChange={(v) => handleInputChange("expenses", "otherExpensesAnnual", Number(v))} />
                </div>
              </div>
            </div>
          </div>

          {/* Manual Input Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-slate-800">手動入力項目 <span className="text-sm font-normal text-slate-500">(投資戦略・条件)</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Terms */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">要入力</div>
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">取引条件・費用</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">購入価格 (円)</label>
                      {results && (
                        <button 
                          onClick={() => handleInputChange("transaction", "purchasePrice", results.kpis.incomeApproachValue)}
                          className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 transition-colors"
                        >
                          逆算 (収益価格を適用)
                        </button>
                      )}
                    </div>
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                      value={data.transaction.purchasePrice}
                      onChange={(e) => handleInputChange("transaction", "purchasePrice", Number(e.target.value))}
                    />
                  </div>
                  <InputField label="コンサルフィー (円)" value={data.transaction.consultingFee} onChange={(v) => handleInputChange("transaction", "consultingFee", Number(v))} />
                  <InputField label="リフォーム費 (円)" value={data.transaction.renovationCost} onChange={(v) => handleInputChange("transaction", "renovationCost", Number(v))} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="仲介手数料率 (%)" value={data.transaction.brokerageFeeRate * 100} onChange={(v) => handleInputChange("transaction", "brokerageFeeRate", Number(v) / 100)} />
                    <InputField label="登記費用 (円)" value={data.transaction.registrationFee} onChange={(v) => handleInputChange("transaction", "registrationFee", Number(v))} />
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">要入力</div>
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">融資条件</h4>
                <div className="space-y-4">
                  <InputField label="借入金額 (円)" value={data.financing.loanAmount} onChange={(v) => handleInputChange("financing", "loanAmount", Number(v))} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="金利 (%)" value={data.financing.interestRate * 100} onChange={(v) => handleInputChange("financing", "interestRate", Number(v) / 100)} />
                    <InputField label="借入期間 (年)" value={data.financing.loanTermYears} onChange={(v) => handleInputChange("financing", "loanTermYears", Number(v))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="アモチ期間 (年)" value={data.financing.amortizationYears} onChange={(v) => handleInputChange("financing", "amortizationYears", Number(v))} />
                    <InputField label="融資事務手数料 (円)" value={data.financing.loanAdminFee} onChange={(v) => handleInputChange("financing", "loanAdminFee", Number(v))} />
                  </div>
                </div>
              </div>

              {/* Investment Strategy */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden md:col-span-2">
                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">要入力</div>
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">投資戦略・運用方針</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <InputField label="ターゲットCap Rate (%)" value={data.investmentParams.targetCapRate * 100} onChange={(v) => handleInputChange("investmentParams", "targetCapRate", Number(v) / 100)} />
                    <InputField label="Exit Cap Rate (%)" value={data.investmentParams.exitCapRate * 100} onChange={(v) => handleInputChange("investmentParams", "exitCapRate", Number(v) / 100)} />
                    <InputField label="保有期間 (年)" value={data.investmentParams.holdingPeriodYears} onChange={(v) => handleInputChange("investmentParams", "holdingPeriodYears", Number(v))} />
                  </div>
                  <div className="space-y-4">
                    <InputField label="空室率 (%)" value={data.rentRoll.vacancyRate * 100} onChange={(v) => handleInputChange("rentRoll", "vacancyRate", Number(v) / 100)} />
                    <InputField label="PM費率 (%)" value={data.expenses.managementFeeRate * 100} onChange={(v) => handleInputChange("expenses", "managementFeeRate", Number(v) / 100)} />
                    <InputField label="居住用比率 (%)" value={data.property.residentialRatio * 100} onChange={(v) => handleInputChange("property", "residentialRatio", Number(v) / 100)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg sticky top-24">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            シミュレーション結果
          </h2>
          
          {isCalculating && !results ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Key KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <KpiCard label="収益価格 (Cap法)" value={formatCurrency(results.kpis.incomeApproachValue)} />
                <KpiCard label="NOI (純運営収益)" value={formatCurrency(results.kpis.noi)} />
                <KpiCard label="表面利回り" value={formatPercent(results.kpis.grossYield)} highlight />
                <KpiCard label="FCR (実質利回り)" value={formatPercent(results.kpis.fcr)} highlight />
                <KpiCard label="CCR (自己資本配当率)" value={formatPercent(results.kpis.ccr)} highlight />
                <KpiCard label="IRR (内部収益率)" value={formatPercent(results.kpis.irr)} highlight />
              </div>

              {/* Cash Flow Summary */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-3">年間キャッシュフロー</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">有効総収入 (EGI)</span>
                    <span>{formatCurrency(results.kpis.effectiveGrossIncomeAnnual)}</span>
                  </div>
                  <div className="flex justify-between text-red-300">
                    <span>運営経費 (Opex)</span>
                    <span>-{formatCurrency(results.kpis.totalOperatingExpensesAnnual)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-slate-700 pt-2">
                    <span>NOI</span>
                    <span>{formatCurrency(results.kpis.noi)}</span>
                  </div>
                  <div className="flex justify-between text-red-300">
                    <span>年間返済額 (ADS)</span>
                    <span>-{formatCurrency(results.kpis.annualDebtService)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-400 border-t border-slate-700 pt-2">
                    <span>税引前CF (CFBT)</span>
                    <span>{formatCurrency(results.kpis.cfbt)}</span>
                  </div>
                </div>
              </div>

              {/* Sensitivity Matrix */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 overflow-x-auto">
                <h3 className="text-sm font-medium text-slate-400 mb-3">感応度分析 (収益価格)</h3>
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr>
                      <th className="text-left font-normal text-slate-500 pb-2">空室率 \ Cap</th>
                      {results.sensitivityMatrix.capRates.map((c: number, i: number) => (
                        <th key={i} className="font-normal text-slate-300 pb-2">{formatPercent(c)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.sensitivityMatrix.matrix.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="text-left font-medium text-slate-400 py-2 px-1 border-b border-slate-700/50">{formatPercent(row.vacancyRate)}</td>
                        {row.values.map((v: number, j: number) => {
                          const diff = v - data.transaction.purchasePrice;
                          const diffPercent = diff / data.transaction.purchasePrice;
                          
                          let bgClass = "bg-slate-800/50";
                          let textClass = "text-slate-300";
                          
                          if (diffPercent > 0.1) {
                            bgClass = "bg-emerald-500/20";
                            textClass = "text-emerald-300 font-medium";
                          } else if (diffPercent > 0) {
                            bgClass = "bg-emerald-500/10";
                            textClass = "text-emerald-400";
                          } else if (diffPercent > -0.1) {
                            bgClass = "bg-red-500/10";
                            textClass = "text-red-400";
                          } else {
                            bgClass = "bg-red-500/20";
                            textClass = "text-red-300 font-medium";
                          }

                          return (
                            <td key={j} className={`py-2 px-2 border-b border-slate-700/50 ${bgClass} ${textClass} transition-colors`}>
                              {formatCurrencyShort(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  保存する
                </button>
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  決裁書を出力 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: number | string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{label}</label>
      <input
        type="number"
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function KpiCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800 border-slate-700'}`}>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
    </div>
  );
}

// Formatters
function formatCurrency(value: number) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value);
}

function formatCurrencyShort(value: number) {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}億円`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万円`;
  return formatCurrency(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}
