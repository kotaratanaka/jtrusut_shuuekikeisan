import { ReactNode } from "react";
import { Building, LayoutDashboard, Calculator, Settings, FileText } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const navItems = [
    { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { id: "simulation", label: "シミュレーション", icon: Calculator },
    { id: "documents", label: "決裁書出力", icon: FileText },
    { id: "settings", label: "マスタ設定", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800">
          <Building className="w-6 h-6 text-emerald-400" />
          <span>REIS Pro</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-slate-500 border-t border-slate-800">
          &copy; 2026 REIS Systems
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
              KT
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
