/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Layout } from "./components/Layout";
import { Simulation } from "./components/Simulation";
import { Settings } from "./components/Settings";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && <Dashboard onNewSimulation={() => setActiveTab("simulation")} />}
      {activeTab === "simulation" && <Simulation />}
      {activeTab === "documents" && (
        <div className="flex items-center justify-center h-64 text-slate-500">
          決裁書出力機能は開発中です
        </div>
      )}
      {activeTab === "settings" && <Settings />}
    </Layout>
  );
}
