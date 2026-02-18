import { useState } from "react";
import { ArrowUpDown, Eye, Image as ImageIcon } from "lucide-react";
import SimilarityBar from "./SimilarityBar";
import StatusBadge from "./StatusBadge";
import FilterToolbar, { type FilterConfig, type ActiveFilters } from "./FilterToolbar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface HazardRow {
  id: string;
  taskId: string;
  timestamp: string;
  pic: string;
  site: string;
  location: string;
  detailLocation: string;
  ketidaksesuaian: string;
  subKetidaksesuaian: string;
  clusterStatus: "Duplicate" | "Potential Duplicate" | "Duplicate by System";
  clusterSimilarity: number;
  clusterId: string;
}

const hazardData: HazardRow[] = [
  { id: "HR-2025-336-23917", taskId: "7316822", timestamp: "2025-12-13 07:45", pic: "Siti Rahayu", site: "BMO 1", location: "Hauling Road", detailLocation: "Gerbang Utama Site", ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", clusterStatus: "Duplicate", clusterSimilarity: 89, clusterId: "SCL-001" },
  { id: "HR-2025-336-23920", taskId: "7316825", timestamp: "2025-12-12 08:30", pic: "Bambang Sutrisno", site: "BMO 1", location: "Hauling Road", detailLocation: "Gerbang Utama Site", ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", clusterStatus: "Potential Duplicate", clusterSimilarity: 83, clusterId: "SCL-001" },
  { id: "HR-2025-336-23930", taskId: "7316830", timestamp: "2025-12-11 06:15", pic: "Eko Prasetyo", site: "BMO 1", location: "Hauling Road", detailLocation: "Gerbang Utama Site", ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", clusterStatus: "Duplicate", clusterSimilarity: 89, clusterId: "SCL-001" },
  { id: "HR-2025-336-23918", taskId: "7316823", timestamp: "2025-12-10 09:00", pic: "Agung Nugroho", site: "BMO 1", location: "Pit Area", detailLocation: "Pit 3 Hauling Rd", ketidaksesuaian: "Standar Road Maintenance", subKetidaksesuaian: "Kondisi jalan tidak layak operasi", clusterStatus: "Potential Duplicate", clusterSimilarity: 79, clusterId: "SCL-002" },
  { id: "HR-2025-336-23934", taskId: "7316834", timestamp: "2025-12-09 14:20", pic: "Suryadi Wijaya", site: "BMO 1", location: "Pit Area", detailLocation: "Pit 3 Hauling Rd", ketidaksesuaian: "Standar Road Maintenance", subKetidaksesuaian: "Kondisi jalan tidak layak operasi", clusterStatus: "Duplicate", clusterSimilarity: 85, clusterId: "SCL-002" },
  { id: "HR-2025-336-23950", taskId: "7316850", timestamp: "2025-12-08 10:45", pic: "Rizky Maulana", site: "BMO 1", location: "Pit Area", detailLocation: "Pit 2 Highwall", ketidaksesuaian: "Geotechnical Monitoring", subKetidaksesuaian: "Retakan/pergerakan tanah terdeteksi", clusterStatus: "Duplicate", clusterSimilarity: 91, clusterId: "SCL-003" },
  { id: "HR-2025-336-23951", taskId: "7316851", timestamp: "2025-12-07 07:30", pic: "Dian Pertiwi", site: "BMO 1", location: "Pit Area", detailLocation: "Pit 2 Highwall", ketidaksesuaian: "Geotechnical Monitoring", subKetidaksesuaian: "Retakan/pergerakan tanah terdeteksi", clusterStatus: "Potential Duplicate", clusterSimilarity: 88, clusterId: "SCL-003" },
  { id: "HR-2025-336-23960", taskId: "7316860", timestamp: "2025-12-06 13:10", pic: "Hendra Gunawan", site: "BMO 2", location: "Workshop", detailLocation: "Bay 3 Maintenance", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", clusterStatus: "Duplicate by System", clusterSimilarity: 65, clusterId: "SCL-004" },
  { id: "HR-2025-336-23961", taskId: "7316861", timestamp: "2025-12-05 08:50", pic: "Yusuf Hakim", site: "BMO 2", location: "Workshop", detailLocation: "Bay 5 Maintenance", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", clusterStatus: "Potential Duplicate", clusterSimilarity: 62, clusterId: "SCL-004" },
  { id: "HR-2025-336-23970", taskId: "7316870", timestamp: "2025-12-04 11:25", pic: "Wahyu Hidayat", site: "BMO 1", location: "Hauling Road", detailLocation: "Area Konstruksi Jl Utama", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan helm safety", clusterStatus: "Duplicate", clusterSimilarity: 78, clusterId: "SCL-005" },
  { id: "HR-2025-336-23971", taskId: "7316871", timestamp: "2025-12-03 15:40", pic: "Fitri Handayani", site: "BMO 1", location: "Hauling Road", detailLocation: "Area Konstruksi Jl Utama", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan helm safety", clusterStatus: "Duplicate by System", clusterSimilarity: 76, clusterId: "SCL-005" },
  { id: "HR-2025-336-23980", taskId: "7316880", timestamp: "2025-12-02 09:15", pic: "Ahmad Fadli", site: "BMO 1", location: "Warehouse", detailLocation: "Red Zone Jalan Akses", ketidaksesuaian: "Standar Road Maintenance", subKetidaksesuaian: "Drainase tersumbat material", clusterStatus: "Potential Duplicate", clusterSimilarity: 80, clusterId: "SCL-006" },
];

const SITES = [...new Set(hazardData.map((h) => h.site))];
const LOCATIONS = [...new Set(hazardData.map((h) => h.location))];
const DETAIL_LOCATIONS = [...new Set(hazardData.map((h) => h.detailLocation))];
const PICS = [...new Set(hazardData.map((h) => h.pic))];
const KETIDAKSESUAIANS = [...new Set(hazardData.map((h) => h.ketidaksesuaian))];
const SUB_KETIDAKSESUAIANS = [...new Set(hazardData.map((h) => h.subKetidaksesuaian))];
const CLUSTER_STATUSES = ["Duplicate", "Potential Duplicate", "Duplicate by System"];
const SIMILARITY_RANGES = ["<60", "60–69", "70–79", "80–89", "≥90"];

const matchRange = (val: number, range: string): boolean => {
  if (range === "<60") return val < 60;
  if (range === "60–69") return val >= 60 && val <= 69;
  if (range === "70–79") return val >= 70 && val <= 79;
  if (range === "80–89") return val >= 80 && val <= 89;
  if (range === "≥90") return val >= 90;
  return true;
};

interface HazardListTableProps {
  sharedFilters: ActiveFilters;
  onSharedFilterChange: (key: string, values: string[]) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onClearAll: () => void;
  onOpenCluster?: (clusterId: string, hazardId?: string) => void;
  onPreviewHazard?: (hazardId: string) => void;
}

const HazardListTable = ({
  sharedFilters,
  onSharedFilterChange,
  search,
  onSearchChange,
  onClearAll,
  onOpenCluster,
  onPreviewHazard,
}: HazardListTableProps) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("timestamp");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filterConfigs: FilterConfig[] = [
    { key: "pic", label: "PIC Perusahaan", type: "multi-select", options: PICS },
    { key: "site", label: "Site", type: "multi-select", options: SITES },
    { key: "location", label: "Lokasi", type: "multi-select", options: LOCATIONS },
    { key: "detailLocation", label: "Detail Lokasi", type: "multi-select", options: DETAIL_LOCATIONS },
    { key: "ketidaksesuaian", label: "Ketidaksesuaian", type: "multi-select", options: KETIDAKSESUAIANS },
    { key: "subKetidaksesuaian", label: "Sub Ketidaksesuaian", type: "multi-select", options: SUB_KETIDAKSESUAIANS },
    { key: "clusterStatus", label: "Status", type: "multi-select", options: CLUSTER_STATUSES },
    { key: "similarity", label: "Similarity", type: "range", options: SIMILARITY_RANGES },
  ];

  const filtered = hazardData.filter((h) => {
    if (search && !`${h.taskId} ${h.id} ${h.clusterId}`.toLowerCase().includes(search.toLowerCase())) return false;
    const sf = sharedFilters;
    if (sf.pic?.length > 0 && !sf.pic.includes(h.pic)) return false;
    if (sf.site?.length > 0 && !sf.site.includes(h.site)) return false;
    if (sf.location?.length > 0 && !sf.location.includes(h.location)) return false;
    if (sf.detailLocation?.length > 0 && !sf.detailLocation.includes(h.detailLocation)) return false;
    if (sf.ketidaksesuaian?.length > 0 && !sf.ketidaksesuaian.includes(h.ketidaksesuaian)) return false;
    if (sf.subKetidaksesuaian?.length > 0 && !sf.subKetidaksesuaian.includes(h.subKetidaksesuaian)) return false;
    if (sf.clusterStatus?.length > 0 && !sf.clusterStatus.includes(h.clusterStatus)) return false;
    if (sf.similarity?.length > 0 && !sf.similarity.some((r) => matchRange(h.clusterSimilarity, r))) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as any)[sortKey];
    const bv = (b as any)[sortKey];
    const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortAsc ? cmp : -cmp;
  });

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <th className="cursor-pointer group" onClick={() => handleSort(field)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? "opacity-100 text-primary" : "opacity-30"} group-hover:opacity-100`} />
      </span>
    </th>
  );

  const PlainHeader = ({ label }: { label: string }) => <th>{label}</th>;

  return (
    <div className="flex flex-col h-full">
      <FilterToolbar
        searchPlaceholder="Search task ID, hazard ID, cluster ID…"
        searchValue={search}
        onSearchChange={onSearchChange}
        filters={filterConfigs}
        activeFilters={sharedFilters}
        onFilterChange={onSharedFilterChange}
        onClearAll={onClearAll}
      />

      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <p className="text-sm">Tidak ada data yang cocok dengan filter ini.</p>
          <button onClick={onClearAll} className="px-4 py-1.5 rounded-full text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10">
            Clear All
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto border border-table-border rounded-md">
            <table className="spreadsheet-table">
              <thead>
                <tr>
                  <PlainHeader label="Task ID" />
                  <SortHeader label="Timestamp" field="timestamp" />
                  <PlainHeader label="PIC Perusahaan" />
                  <PlainHeader label="Site" />
                  <PlainHeader label="Lokasi" />
                  <PlainHeader label="Detail Location" />
                  <PlainHeader label="Ketidaksesuaian" />
                  <PlainHeader label="Sub Ketidaksesuaian" />
                  <PlainHeader label="Status" />
                  <PlainHeader label="Img" />
                  <SortHeader label="Similarity" field="clusterSimilarity" />
                  <PlainHeader label="Aksi" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => (
                  <tr
                    key={row.id}
                    className={selectedRow === row.id ? "selected" : ""}
                    onClick={() => setSelectedRow(row.id === selectedRow ? null : row.id)}
                  >
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenCluster?.(row.clusterId, row.id); }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {row.taskId}
                      </button>
                    </td>
                    <td className="text-xs">{row.timestamp}</td>
                    <td className="max-w-[120px]">
                      <Tooltip>
                        <TooltipTrigger asChild><span className="block truncate text-xs">{row.pic}</span></TooltipTrigger>
                        <TooltipContent className="text-xs">{row.pic}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="text-xs">{row.site}</td>
                    <td className="text-xs">{row.location}</td>
                    <td className="max-w-[120px]">
                      <Tooltip>
                        <TooltipTrigger asChild><span className="block truncate text-xs">{row.detailLocation}</span></TooltipTrigger>
                        <TooltipContent className="text-xs">{row.detailLocation}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="max-w-[140px]">
                      <Tooltip>
                        <TooltipTrigger asChild><span className="block truncate text-xs">{row.ketidaksesuaian}</span></TooltipTrigger>
                        <TooltipContent className="text-xs max-w-[260px]">{row.ketidaksesuaian}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="max-w-[140px]">
                      <Tooltip>
                        <TooltipTrigger asChild><span className="block truncate text-xs">{row.subKetidaksesuaian}</span></TooltipTrigger>
                        <TooltipContent className="text-xs max-w-[260px]">{row.subKetidaksesuaian}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td><StatusBadge status={row.clusterStatus} /></td>
                    <td>
                      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center border border-border">
                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </div>
                    </td>
                    <td><SimilarityBar value={row.clusterSimilarity} /></td>
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenCluster?.(row.clusterId, row.id); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end px-2 py-2 text-xs text-muted-foreground">
            Showing {sorted.length} rows · Selected: {selectedRow ? 1 : 0}
          </div>
        </>
      )}
    </div>
  );
};

export default HazardListTable;