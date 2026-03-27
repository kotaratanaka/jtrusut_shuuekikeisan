import { useState } from "react";
import { Save, Building2, MapPin } from "lucide-react";

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-500" />
          投資基準マスタ (エリア別期待利回り)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-medium text-slate-500">エリア</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">ターゲットCap Rate (%)</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Exit Cap Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 text-slate-800">都心5区</td>
                <td className="py-3 px-4"><input type="number" defaultValue={4.5} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={5.0} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-800">東京23区</td>
                <td className="py-3 px-4"><input type="number" defaultValue={5.0} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={5.5} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-800">首都圏郊外</td>
                <td className="py-3 px-4"><input type="number" defaultValue={6.0} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={6.5} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-500" />
          構造別マスタ
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-medium text-slate-500">構造</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">法定耐用年数 (年)</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">再調達価格 (円/㎡)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 text-slate-800">RC (鉄筋コンクリート)</td>
                <td className="py-3 px-4"><input type="number" defaultValue={47} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={300000} className="w-32 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-800">S (鉄骨)</td>
                <td className="py-3 px-4"><input type="number" defaultValue={34} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={250000} className="w-32 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-800">W (木造)</td>
                <td className="py-3 px-4"><input type="number" defaultValue={22} className="w-24 border border-slate-200 rounded px-2 py-1" /></td>
                <td className="py-3 px-4"><input type="number" defaultValue={200000} className="w-32 border border-slate-200 rounded px-2 py-1" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center gap-2">
          <Save className="w-5 h-5" />
          設定を保存
        </button>
      </div>
    </div>
  );
}
