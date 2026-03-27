import { Building, Plus, ArrowRight, TrendingUp } from "lucide-react";

export function Dashboard({ onNewSimulation }: { onNewSimulation: () => void }) {
  const recentDeals = [
    { id: 1, name: "六本木レジデンス", price: 150000000, yield: 0.052, status: "検討中", date: "2026-03-15" },
    { id: 2, name: "新宿オフィスビル", price: 320000000, yield: 0.048, status: "決裁済", date: "2026-03-10" },
    { id: 3, name: "横浜アパートメント", price: 85000000, yield: 0.065, status: "見送り", date: "2026-03-05" },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">検討中案件</div>
            <div className="text-2xl font-bold text-slate-800">12<span className="text-sm font-normal text-slate-500 ml-1">件</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">平均ターゲット利回り</div>
            <div className="text-2xl font-bold text-slate-800">5.4<span className="text-sm font-normal text-slate-500 ml-1">%</span></div>
          </div>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">最近のシミュレーション</h2>
          <button 
            onClick={onNewSimulation}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="py-3 px-6 font-medium">物件名</th>
                <th className="py-3 px-6 font-medium">購入価格</th>
                <th className="py-3 px-6 font-medium">表面利回り</th>
                <th className="py-3 px-6 font-medium">ステータス</th>
                <th className="py-3 px-6 font-medium">最終更新日</th>
                <th className="py-3 px-6 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">{deal.name}</td>
                  <td className="py-4 px-6 text-slate-600">{(deal.price / 100000000).toFixed(1)}億円</td>
                  <td className="py-4 px-6 text-slate-600">{(deal.yield * 100).toFixed(2)}%</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deal.status === '検討中' ? 'bg-blue-100 text-blue-700' :
                      deal.status === '決裁済' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">{deal.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={onNewSimulation}
                      className="text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
