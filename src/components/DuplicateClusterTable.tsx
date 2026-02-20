import { useState, useEffect } from "react";
import { ArrowUpDown, Eye, TableProperties, LayoutGrid, ChevronDown, Clock, Image as ImageIcon } from "lucide-react";
import SimilarityBar from "./SimilarityBar";
import FilterToolbar, { type FilterConfig, type ActiveFilters } from "./FilterToolbar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import ClusterCard, { type ClusterCardData } from "./ClusterCard";

export interface ClusterRowData extends ClusterCardData {
  detailLocation: string;
  ketidaksesuaian: string;
  subKetidaksesuaian: string;
  jumlahDuplicate: number;
  jumlahPotentialDuplicate: number;
  jumlahDuplicateBySystem: number;
  jumlahWaiting: number;
  /** Waiting countdown in seconds — 0 means no active waiting */
  waitingSeconds: number;
}

const clusterData: ClusterRowData[] = [
  { id: "SCL-001", name: "Pelanggaran Kecepatan Area Gerbang", count: 6, similarity: 87, site: "BMO 1", location: "Hauling Road", detailLocation: "Gerbang Utama Site", classificationTitle: "DDP: Kelayakan dan Pengoperasian Kendaraan / Unit", classificationSubtitle: "Tidak menggunakan APD sesuai standard", quickAction: "Warning Letter", description: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.", tags: ["GCL-001", "LCL-001", "SCL-001"], coordinates: "-3.7893, 114.7631", ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", jumlahDuplicate: 2, jumlahPotentialDuplicate: 2, jumlahDuplicateBySystem: 1, jumlahWaiting: 1, waitingSeconds: 5832 },
  { id: "SCL-002", name: "Kondisi Jalan Berlubang Pit 3", count: 5, similarity: 82, site: "BMO 1", location: "Pit Area", detailLocation: "Pit 3 Section A", classificationTitle: "Standar Road Management", classificationSubtitle: "Drainase tersumbat pada jalan angkut", quickAction: "Road Maintenance", description: "Terdapat lubang berdiameter 50cm di hauling road pit 3.", tags: ["GCL-002", "LCL-002", "SCL-002"], coordinates: "-3.7912, 114.7645", ketidaksesuaian: "Standar Road Maintenance", subKetidaksesuaian: "Kondisi jalan tidak layak operasi", jumlahDuplicate: 2, jumlahPotentialDuplicate: 1, jumlahDuplicateBySystem: 1, jumlahWaiting: 1, waitingSeconds: 3420 },
  { id: "SCL-003", name: "Retakan Highwall Pit 2", count: 5, similarity: 91, site: "BMO 1", location: "Pit Area", detailLocation: "Highwall Pit 2", classificationTitle: "Bahaya Geoteknik", classificationSubtitle: "Retakan pada highwall", quickAction: "Area Closure", description: "Terdapat retakan di highwall yang berpotensi longsor.", tags: ["GCL-003", "LCL-003", "SCL-003"], coordinates: "-3.7856, 114.7589", ketidaksesuaian: "Geotechnical Monitoring", subKetidaksesuaian: "Retakan/pergerakan tanah terdeteksi", jumlahDuplicate: 2, jumlahPotentialDuplicate: 2, jumlahDuplicateBySystem: 0, jumlahWaiting: 2, waitingSeconds: 7140 },
  { id: "SCL-004", name: "APD Tidak Lengkap Workshop", count: 6, similarity: 65, site: "BMO 2", location: "Workshop", detailLocation: "Workshop Utama", classificationTitle: "Perlengkapan APD", classificationSubtitle: "APD tidak lengkap saat bekerja", quickAction: "Safety Briefing", description: "Operator HD tidak menggunakan safety vest.", tags: ["GCL-004", "LCL-004", "SCL-004"], coordinates: "-3.7934, 114.7678", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", jumlahDuplicate: 3, jumlahPotentialDuplicate: 1, jumlahDuplicateBySystem: 1, jumlahWaiting: 0, waitingSeconds: 0 },
  { id: "SCL-005", name: "Helm Safety Area Konstruksi", count: 6, similarity: 78, site: "BMO 1", location: "Hauling Road", detailLocation: "Area Konstruksi Jalan", classificationTitle: "DDP: Kelayakan dan Pengoperasian Kendaraan / Unit", classificationSubtitle: "Tidak menggunakan APD sesuai standard", quickAction: "Fatigue Test", description: "Pekerja tidak menggunakan helm saat berada di area konstruksi.", tags: ["GCL-005", "LCL-005", "SCL-005"], coordinates: "-3.7901, 114.7612", ketidaksesuaian: "Perlengkapan APD", subKetidaksesuaian: "Tidak menggunakan helm safety", jumlahDuplicate: 2, jumlahPotentialDuplicate: 1, jumlahDuplicateBySystem: 2, jumlahWaiting: 1, waitingSeconds: 1560 },
  { id: "SCL-006", name: "Drainase Tersumbat Red Zone", count: 4, similarity: 80, site: "BMO 1", location: "Warehouse", detailLocation: "Red Zone Area", classificationTitle: "Standar Road Management", classificationSubtitle: "Drainase tersumbat material", quickAction: "Road Maintenance", description: "Drainase tersumbat material di red zone.", tags: ["GCL-006", "LCL-006", "SCL-006"], coordinates: "-3.7878, 114.7701", ketidaksesuaian: "Standar Road Maintenance", subKetidaksesuaian: "Drainase tersumbat material", jumlahDuplicate: 1, jumlahPotentialDuplicate: 2, jumlahDuplicateBySystem: 0, jumlahWaiting: 1, waitingSeconds: 420 },
  { id: "SCL-007", name: "Rambu Lalu Lintas Rusak Pit 1", count: 4, similarity: 73, site: "BMO 1", location: "Pit Area", detailLocation: "Pit 1 Entrance", classificationTitle: "Rambu dan Marka", classificationSubtitle: "Rambu tidak terpasang/rusak", quickAction: "Road Maintenance", description: "Rambu batas kecepatan 25 km/jam di entrance pit 1 roboh.", tags: ["GCL-007", "LCL-007", "SCL-007"], coordinates: "-3.7845, 114.7555", ketidaksesuaian: "Rambu dan Marka", subKetidaksesuaian: "Rambu tidak terpasang/rusak", jumlahDuplicate: 2, jumlahPotentialDuplicate: 1, jumlahDuplicateBySystem: 0, jumlahWaiting: 0, waitingSeconds: 0 },
  { id: "SCL-008", name: "Kebocoran Oli Area Fueling", count: 7, similarity: 88, site: "BMO 2", location: "Workshop", detailLocation: "Fueling Station", classificationTitle: "Tumpahan B3", classificationSubtitle: "Kebocoran oli/solar pada unit", quickAction: "Area Closure", description: "Terdapat kebocoran oli dari excavator saat proses fueling.", tags: ["GCL-008", "LCL-008", "SCL-008"], coordinates: "-3.7960, 114.7690", ketidaksesuaian: "Tumpahan B3", subKetidaksesuaian: "Kebocoran oli/solar pada unit", jumlahDuplicate: 3, jumlahPotentialDuplicate: 2, jumlahDuplicateBySystem: 1, jumlahWaiting: 1, waitingSeconds: 2280 },
];

const SITES = [...new Set(clusterData.map((c) => c.site))];
const LOCATIONS = [...new Set(clusterData.map((c) => c.location))];
const DETAIL_LOCATIONS = [...new Set(clusterData.map((c) => c.detailLocation))];
const KETIDAKSESUAIANS = [...new Set(clusterData.map((c) => c.ketidaksesuaian))];
const SUB_KETIDAKSESUAIANS = [...new Set(clusterData.map((c) => c.subKetidaksesuaian))];
const SIMILARITY_RANGES = ["<60", "60–69", "70–79", "80–89", "≥90"];
const JUMLAH_RANGES = ["1–3", "4–6", "7–10", ">10"];

interface DuplicateClusterTableProps {
  sharedFilters: ActiveFilters;
  onSharedFilterChange: (key: string, values: string[]) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onClearAll: () => void;
  onOpenSemanticReview?: (clusterId: string) => void;
}

const matchRange = (val: number, range: string): boolean => {
  if (range === "<60") return val < 60;
  if (range === "60–69") return val >= 60 && val <= 69;
  if (range === "70–79") return val >= 70 && val <= 79;
  if (range === "80–89") return val >= 80 && val <= 89;
  if (range === "≥90") return val >= 90;
  if (range === "1–3") return val >= 1 && val <= 3;
  if (range === "4–6") return val >= 4 && val <= 6;
  if (range === "7–10") return val >= 7 && val <= 10;
  if (range === ">10") return val > 10;
  return true;
};

type SortField = "similarity" | "count" | "jumlahDuplicate" | "jumlahPotentialDuplicate" | "jumlahDuplicateBySystem" | "jumlahWaiting";

const SORT_OPTIONS: { label: string; field: SortField }[] = [
  { label: "Similarity ↓", field: "similarity" },
  { label: "Duplicate ↓", field: "jumlahDuplicate" },
  { label: "Potential ↓", field: "jumlahPotentialDuplicate" },
  { label: "By System ↓", field: "jumlahDuplicateBySystem" },
  { label: "Waiting ↓", field: "jumlahWaiting" },
];

/** Format seconds to h:mm:ss or mm:ss */
const formatCountdown = (totalSec: number): string => {
  if (totalSec <= 0) return "";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const DuplicateClusterTable = ({
  sharedFilters,
  onSharedFilterChange,
  search,
  onSearchChange,
  onClearAll,
  onOpenSemanticReview,
}: DuplicateClusterTableProps) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortField>("similarity");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [tick, setTick] = useState(0);

  // Countdown timer — tick every second
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: SortField) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filterConfigs: FilterConfig[] = [
    { key: "site", label: "Site", type: "multi-select", options: SITES },
    { key: "location", label: "Lokasi", type: "multi-select", options: LOCATIONS },
    { key: "detailLocation", label: "Detail Lokasi", type: "multi-select", options: DETAIL_LOCATIONS },
    { key: "ketidaksesuaian", label: "Ketidaksesuaian", type: "multi-select", options: KETIDAKSESUAIANS },
    { key: "subKetidaksesuaian", label: "Sub Ketidaksesuaian", type: "multi-select", options: SUB_KETIDAKSESUAIANS },
    { key: "jumlahHazard", label: "Jumlah Hazard", type: "range", options: JUMLAH_RANGES },
    { key: "jumlahDuplicate", label: "Duplicate", type: "range", options: JUMLAH_RANGES },
    { key: "jumlahPotentialDuplicate", label: "Potential", type: "range", options: JUMLAH_RANGES },
    { key: "jumlahDuplicateBySystem", label: "By System", type: "range", options: JUMLAH_RANGES },
    { key: "jumlahWaiting", label: "Waiting", type: "range", options: JUMLAH_RANGES },
  ];

  const filtered = clusterData.filter((c) => {
    if (search && !`${c.id} ${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    const sf = sharedFilters;
    if (sf.site?.length > 0 && !sf.site.includes(c.site)) return false;
    if (sf.location?.length > 0 && !sf.location.includes(c.location)) return false;
    if (sf.detailLocation?.length > 0 && !sf.detailLocation.includes(c.detailLocation)) return false;
    if (sf.ketidaksesuaian?.length > 0 && !sf.ketidaksesuaian.includes(c.ketidaksesuaian)) return false;
    if (sf.subKetidaksesuaian?.length > 0 && !sf.subKetidaksesuaian.includes(c.subKetidaksesuaian)) return false;
    if (sf.similarity?.length > 0 && !sf.similarity.some((r) => matchRange(c.similarity, r))) return false;
    if (sf.jumlahHazard?.length > 0 && !sf.jumlahHazard.some((r) => matchRange(c.count, r))) return false;
    if (sf.jumlahDuplicate?.length > 0 && !sf.jumlahDuplicate.some((r) => matchRange(c.jumlahDuplicate, r))) return false;
    if (sf.jumlahPotentialDuplicate?.length > 0 && !sf.jumlahPotentialDuplicate.some((r) => matchRange(c.jumlahPotentialDuplicate, r))) return false;
    if (sf.jumlahDuplicateBySystem?.length > 0 && !sf.jumlahDuplicateBySystem.some((r) => matchRange(c.jumlahDuplicateBySystem, r))) return false;
    if (sf.jumlahWaiting?.length > 0 && !sf.jumlahWaiting.some((r) => matchRange(c.jumlahWaiting, r))) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const getCountdown = (row: ClusterRowData): number => {
    const remaining = row.waitingSeconds - tick;
    return remaining > 0 ? remaining : 0;
  };

  const SortHeader = ({ label, field }: { label: string; field: SortField }) => (
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
        searchPlaceholder="Search SCL ID, nama cluster, deskripsi…"
        searchValue={search}
        onSearchChange={onSearchChange}
        filters={filterConfigs}
        activeFilters={sharedFilters}
        onFilterChange={onSharedFilterChange}
        onClearAll={onClearAll}
      >
        <div className="flex items-center gap-2 ml-auto">
          {/* Sort dropdown — only visible in card/grid view */}
          {viewMode === "card" && (
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Sort: {SORT_OPTIONS.find((o) => o.field === sortKey)?.label}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              {sortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setSortDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-40 bg-card border border-border rounded-md shadow-lg py-1 min-w-[140px]">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.field}
                        onClick={() => { setSortKey(opt.field); setSortAsc(false); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors ${sortKey === opt.field ? "font-semibold text-primary" : "text-foreground"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-0.5 p-0.5 bg-secondary rounded-md">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${viewMode === "table" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Table View"
            >
              <TableProperties className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded transition-colors ${viewMode === "card" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </FilterToolbar>

      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <p className="text-sm">Tidak ada data yang cocok dengan filter ini.</p>
          <button onClick={onClearAll} className="px-4 py-1.5 rounded-full text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10">
            Clear All
          </button>
        </div>
      ) : viewMode === "table" ? (
        <>
          <div className="flex-1 overflow-auto border border-table-border rounded-md">
            <table className="spreadsheet-table">
              <thead>
                <tr>
                  <PlainHeader label="Cluster ID" />
                  <PlainHeader label="Site" />
                  <PlainHeader label="Lokasi" />
                  <PlainHeader label="Detail Lokasi" />
                  <PlainHeader label="Ketidaksesuaian" />
                  <PlainHeader label="Sub Ketidaksesuaian" />
                  <SortHeader label="Duplicate" field="jumlahDuplicate" />
                  <SortHeader label="Potential" field="jumlahPotentialDuplicate" />
                  <SortHeader label="By System" field="jumlahDuplicateBySystem" />
                  <SortHeader label="Waiting" field="jumlahWaiting" />
                  <SortHeader label="Similarity" field="similarity" />
                  <PlainHeader label="View" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => {
                  const countdown = getCountdown(row);
                  return (
                    <tr
                      key={row.id}
                      className={selectedRow === row.id ? "selected" : ""}
                      onClick={() => setSelectedRow(row.id === selectedRow ? null : row.id)}
                    >
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); onOpenSemanticReview?.(row.id); }}
                          className="font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          {row.id}
                        </button>
                      </td>
                      <td className="text-xs">{row.site}</td>
                      <td className="text-xs">{row.location}</td>
                      <td className="text-xs max-w-[120px]">
                        <Tooltip>
                          <TooltipTrigger asChild><span className="block truncate">{row.detailLocation}</span></TooltipTrigger>
                          <TooltipContent className="text-xs">{row.detailLocation}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="text-xs max-w-[140px]">
                        <Tooltip>
                          <TooltipTrigger asChild><span className="block truncate">{row.ketidaksesuaian}</span></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-[260px]">{row.ketidaksesuaian}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="text-xs max-w-[140px]">
                        <Tooltip>
                          <TooltipTrigger asChild><span className="block truncate">{row.subKetidaksesuaian}</span></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-[260px]">{row.subKetidaksesuaian}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="text-center text-xs font-medium">{row.jumlahDuplicate}</td>
                      <td className="text-center text-xs font-medium">{row.jumlahPotentialDuplicate}</td>
                      <td className="text-center text-xs font-medium">{row.jumlahDuplicateBySystem}</td>
                      <td className="text-center text-xs">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">{row.jumlahWaiting}</span>
                          {row.jumlahWaiting > 0 && countdown > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-pill-yellow-fg font-mono tabular-nums">
                              <Clock className="h-2.5 w-2.5" />
                              {formatCountdown(countdown)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td><SimilarityBar value={row.similarity} /></td>
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); onOpenSemanticReview?.(row.id); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end px-2 py-2 text-xs text-muted-foreground">
            Showing {sorted.length} rows · Selected: {selectedRow ? 1 : 0}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-auto">
          <p className="text-xs text-muted-foreground mb-3">
            Menampilkan {sorted.length} dari {clusterData.length} cluster
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {sorted.map((row) => (
              <ClusterCard
                key={row.id}
                data={row}
                countdown={getCountdown(row)}
                onClick={(id) => onOpenSemanticReview?.(id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DuplicateClusterTable;
