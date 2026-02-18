import { useState } from "react";
import DuplicateClusterTable from "./DuplicateClusterTable";
import HazardListTable from "./HazardListTable";
import { type ActiveFilters } from "./FilterToolbar";

interface DuplicateTabProps {
  onSwitchToCluster?: (clusterId: string, hazardId?: string, compact?: boolean) => void;
}

const DuplicateTab = ({ onSwitchToCluster }: DuplicateTabProps) => {
  const [subTab, setSubTab] = useState<"cluster" | "list">("cluster");

  // Shared filters persist across sub-tabs
  const [sharedFilters, setSharedFilters] = useState<ActiveFilters>({});
  const [clusterSearch, setClusterSearch] = useState("");
  const [hazardSearch, setHazardSearch] = useState("");

  const handleSharedFilterChange = (key: string, values: string[]) => {
    setSharedFilters((prev) => ({ ...prev, [key]: values }));
  };

  const handleClearAll = () => {
    setSharedFilters({});
    setClusterSearch("");
    setHazardSearch("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Segmented control */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg w-fit mb-3">
        <button
          onClick={() => setSubTab("cluster")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === "cluster"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Duplicate Cluster
        </button>
        <button
          onClick={() => setSubTab("list")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === "list"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          List Hazard
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {subTab === "cluster" ? (
          <DuplicateClusterTable
            sharedFilters={sharedFilters}
            onSharedFilterChange={handleSharedFilterChange}
            search={clusterSearch}
            onSearchChange={setClusterSearch}
            onClearAll={handleClearAll}
            onOpenSemanticReview={onSwitchToCluster}
          />
        ) : (
          <HazardListTable
            sharedFilters={sharedFilters}
            onSharedFilterChange={handleSharedFilterChange}
            search={hazardSearch}
            onSearchChange={setHazardSearch}
            onClearAll={handleClearAll}
            onOpenCluster={(clusterId, hazardId) => onSwitchToCluster?.(clusterId, hazardId, true)}
          />
        )}
      </div>
    </div>
  );
};

export default DuplicateTab;
