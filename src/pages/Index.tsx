import { useState } from "react";
import { LayoutGrid, RefreshCw, User } from "lucide-react";
import EvaluationTab from "../components/EvaluationTab";
import DuplicateTab from "../components/DuplicateTab";
import SemanticReview from "../components/SemanticReview";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"evaluation" | "duplicate">("evaluation");
  const [semanticClusterId, setSemanticClusterId] = useState<string | null>(null);
  const [semanticHazardId, setSemanticHazardId] = useState<string | undefined>(undefined);
  const [semanticCompact, setSemanticCompact] = useState(false);
  const [semanticFromListHazard, setSemanticFromListHazard] = useState(false);

  const handleOpenSemanticReview = (clusterId: string, hazardId?: string, compact?: boolean) => {
    setSemanticClusterId(clusterId);
    setSemanticHazardId(hazardId);
    setSemanticCompact(compact ?? false);
    setSemanticFromListHazard(compact ?? false);
  };

  const handleNavigateToCluster = (clusterId: string) => {
    setSemanticClusterId(clusterId);
    setSemanticHazardId(undefined);
    setSemanticCompact(false);
    setSemanticFromListHazard(false);
  };

  const handleClosePanel = () => {
    setSemanticClusterId(null);
    setSemanticHazardId(undefined);
    setSemanticCompact(false);
    setSemanticFromListHazard(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-2.5 bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/20 h-7 w-7" />
              <div>
                <h1 className="text-sm font-bold leading-tight">BEATS Hazard Reporting System</h1>
                <p className="text-[11px] opacity-80">Evaluator Dashboard v2.0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center gap-1.5 text-xs opacity-80 hover:opacity-100">
                <RefreshCw className="h-3.5 w-3.5" />
                Sync Hazards
              </button>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-foreground/20">Evaluator</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">FAUZAN AJI</span>
                <div className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <div className="flex items-center gap-6 px-5 py-1 border-b border-border bg-card">
            <div className="flex items-center gap-1 py-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("evaluation")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "evaluation"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Evaluation
              </button>
              <button
                onClick={() => setActiveTab("duplicate")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "duplicate"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Duplicate
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 min-h-0 p-5">
            <div className="h-full bg-card rounded-lg border border-border p-4 flex flex-col">
              {activeTab === "evaluation" ? (
                <EvaluationTab />
              ) : (
                <DuplicateTab onSwitchToCluster={handleOpenSemanticReview} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Left Side Panel for Semantic Review */}
      {semanticClusterId && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
            onClick={handleClosePanel}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border shadow-2xl animate-in slide-in-from-left duration-300 ${
              semanticCompact
                ? "w-[960px] max-w-[90vw]"
                : "w-[1280px] max-w-[96vw]"
            }`}
          >
            <SemanticReview
              clusterId={semanticClusterId}
              onBack={handleClosePanel}
              compact={semanticCompact}
              selectedHazardId={semanticHazardId}
              fromListHazard={semanticFromListHazard}
              onNavigateToCluster={handleNavigateToCluster}
            />
          </div>
        </>
      )}
    </SidebarProvider>
  );
};

export default Index;
