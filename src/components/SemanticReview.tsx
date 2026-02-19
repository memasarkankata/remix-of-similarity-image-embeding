import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Star, Copy, CheckCircle, XCircle, Clock, RefreshCw, Info, Image as ImageIcon, FileText, MapPin, Users, ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// --- Types ---
interface SimilarReport {
  id: string;
  fullId: string;
  date: string;
  timestamp: string;
  pic: string;
  picPerusahaan: string;
  status: "Duplicate" | "Potential Duplicate" | "Duplicate by System" | "Confirmed" | "Waiting";
  description: string;
  similarity: number;
  autoConfirmSeconds?: number;
  site: string;
  location: string;
  detailLokasi: string;
  keteranganLokasi: string;
  deskripsi: string;
  imageSim: number;
  textSim: number;
  totalSim: number;
  simLabel: "Gambar mirip" | "Text mirip" | "Gambar dan text mirip";
  ketidaksesuaian: string;
  subKetidaksesuaian: string;
  quickAction: string;
}

interface ClusterInfo {
  id: string;
  name: string;
  similarityAvg: number;
  total: number;
  duplicateCount: number;
  potentialCount: number;
  systemCount: number;
  waitingCount: number;
  representative: {
    fullId: string;
    timestamp: string;
    pic: string;
    picPerusahaan: string;
    site: string;
    location: string;
    detailLokasi: string;
    keteranganLokasi: string;
    deskripsi: string;
    ketidaksesuaian: string;
    subKetidaksesuaian: string;
    quickAction: string;
  };
  reports: SimilarReport[];
}

// --- Dummy data ---
const dummyClusters: ClusterInfo[] = [
  {
    id: "SCL-001",
    name: "Pelanggaran Kecepatan Area Gerbang",
    similarityAvg: 87,
    total: 6,
    duplicateCount: 2,
    potentialCount: 3,
    systemCount: 1,
    waitingCount: 1,
    representative: {
      fullId: "HR-2025-336-23917",
      timestamp: "2025-12-13 07:45",
      pic: "Siti Rahayu",
      picPerusahaan: "PT Berau Coal",
      site: "BMO 1",
      location: "Hauling Road",
      detailLokasi: "Gerbang Utama Site",
      keteranganLokasi: "(B 65) Area Gerbang",
      deskripsi: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendara…",
      subKetidaksesuaian: "Tidak menggunakan APD sesuai standard",
      quickAction: "Warning Letter",
    },
    reports: [
      {
        id: "23930", fullId: "HR-2025-336-23930", date: "01 Des 2025", timestamp: "08:12",
        pic: "Eko Prasetyo", picPerusahaan: "PT Pamapersada",
        status: "Duplicate", description: "HD melaju 40 km/jam melewati area gerbang utama mengurangi…",
        similarity: 89, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "HD melaju 40 km/jam melewati area gerbang utama mengurangi kecepatan hanya saat melewati pos security.",
        imageSim: 72, textSim: 94, totalSim: 89, simLabel: "Gambar dan text mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23931", fullId: "HR-2025-336-23931", date: "30 Nov 2025", timestamp: "14:30",
        pic: "Suryadi Wijaya", picPerusahaan: "PT Berau Coal",
        status: "Duplicate", description: "Kendaraan LV melaju dengan kecepatan tinggi di area 30 km/jam tanpa…",
        similarity: 86, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Kendaraan LV melaju dengan kecepatan tinggi di area 30 km/jam tanpa mengurangi kecepatan sama sekali.",
        imageSim: 68, textSim: 91, totalSim: 86, simLabel: "Text mirip",
        ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendara…", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", quickAction: "Warning Letter",
      },
      {
        id: "23932", fullId: "HR-2025-336-23932", date: "29 Nov 2025", timestamp: "09:55",
        pic: "Agung Nugroho", picPerusahaan: "PT Pamapersada",
        status: "Potential Duplicate", description: "Dump truck melintas gerbang dengan kecepatan 35 km/jam di zona 25 km/jam.",
        similarity: 84, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Dump truck melintas gerbang dengan kecepatan 35 km/jam di zona 25 km/jam.",
        imageSim: 60, textSim: 88, totalSim: 84, simLabel: "Text mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23920", fullId: "HR-2025-336-23920", date: "02 Des 2025", timestamp: "11:20",
        pic: "Bambang Sutrisno", picPerusahaan: "PT Berau Coal",
        status: "Waiting", description: "Driver LV tidak menggunakan seatbelt saat melintas gerbang.",
        similarity: 83, autoConfirmSeconds: undefined,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Driver LV tidak menggunakan seatbelt saat melintas gerbang.",
        imageSim: 55, textSim: 82, totalSim: 83, simLabel: "Gambar mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23940", fullId: "HR-2025-336-23940", date: "03 Des 2025", timestamp: "07:45",
        pic: "Siti Rahayu", picPerusahaan: "PT Berau Coal",
        status: "Duplicate by System", description: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
        similarity: 99, autoConfirmSeconds: 0,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
        imageSim: 98, textSim: 100, totalSim: 99, simLabel: "Gambar dan text mirip",
        ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendara…", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", quickAction: "Warning Letter",
      },
    ],
  },
];

const clusterIds = ["SCL-001", "SCL-002", "SCL-003", "SCL-004", "SCL-005", "SCL-006", "SCL-007", "SCL-008"];

interface SemanticReviewProps {
  clusterId: string;
  onBack: () => void;
  compact?: boolean;
  selectedHazardId?: string;
  /** When opened from List Hazard, show cluster name and allow navigating to cluster semantic review */
  fromListHazard?: boolean;
  onNavigateToCluster?: (clusterId: string) => void;
}

const SemanticReview = ({ clusterId, onBack, compact = false, selectedHazardId, fromListHazard = false, onNavigateToCluster }: SemanticReviewProps) => {
  const clusterIndex = clusterIds.indexOf(clusterId);
  const cluster = dummyClusters.find((c) => c.id === clusterId) ?? dummyClusters[0];

  const initialReportId = selectedHazardId
    ? cluster.reports.find((r) => r.fullId === selectedHazardId)?.id ?? cluster.reports[0]?.id ?? null
    : cluster.reports[0]?.id ?? null;

  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReportId);
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bukanExpandId, setBukanExpandId] = useState<string | null>(null);
  const [bukanReason, setBukanReason] = useState("");

  const selectedReport = cluster.reports.find((r) => r.id === selectedReportId) ?? null;

  const filteredReports = cluster.reports.filter((r) => {
    if (statusFilter === "Semua") return true;
    if (statusFilter === "Duplicate") return r.status === "Duplicate";
    if (statusFilter === "Potential") return r.status === "Potential Duplicate";
    if (statusFilter === "System") return r.status === "Duplicate by System";
    if (statusFilter === "Confirmed") return r.status === "Confirmed";
    if (statusFilter === "Waiting") return r.status === "Waiting";
    return true;
  });

  const sortedReports = [...filteredReports].sort((a, b) =>
    sortOrder === "desc" ? b.similarity - a.similarity : a.similarity - b.similarity
  );

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const simColor = (v: number) =>
    v >= 80 ? "text-destructive font-bold" : v >= 70 ? "text-bar-orange font-bold" : "text-muted-foreground font-semibold";

  const simLabelStyle = (label: string) => {
    if (label === "Gambar dan text mirip") return "bg-destructive/10 text-destructive border-destructive/20";
    if (label === "Text mirip") return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-muted-foreground border-border";
  };

  // --- Metadata Row ---
  const MetaRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
    </div>
  );

  // --- Report Card (Left or Middle) ---
  const ReportCard = ({ title, badge, data, showSimilarity }: {
    title: string;
    badge?: React.ReactNode;
    data: {
      fullId: string; timestamp: string; pic: string; picPerusahaan: string; site: string;
      location: string; detailLokasi: string; keteranganLokasi: string;
      deskripsi: string; ketidaksesuaian: string; subKetidaksesuaian: string; quickAction: string;
    };
    showSimilarity?: SimilarReport | null;
  }) => (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-3">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {badge}
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        </div>
        <button
          onClick={() => copyId(data.fullId)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-primary/30 bg-primary/5 text-primary text-[10px] font-semibold hover:bg-primary/10 transition-colors"
        >
          {data.fullId}
          {copiedId === data.fullId ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      {/* Image placeholder - fixed height */}
      <div className="bg-secondary rounded-md h-[160px] flex items-center justify-center border border-border flex-shrink-0">
        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
      </div>

      {/* Deskripsi Temuan - fixed height with truncation */}
      <div className="rounded-md border border-border bg-card flex-shrink-0">
        <div className="px-3 py-2 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Deskripsi Temuan
          </span>
        </div>
        <div className="px-3 py-2.5 h-[52px] overflow-hidden">
          <p className="text-xs leading-relaxed text-foreground line-clamp-2">{data.deskripsi}</p>
        </div>
      </div>

      {/* Klasifikasi - no section title, just rows */}
      <div className="rounded-md border border-border bg-card flex-shrink-0">
        <div className="px-3 py-1">
          <MetaRow label="Ketidaksesuaian" value={data.ketidaksesuaian} />
          <MetaRow label="Sub Ketidaksesuaian" value={data.subKetidaksesuaian} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[11px] text-muted-foreground">Quick Action</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-foreground text-[10px] font-semibold">{data.quickAction}</span>
          </div>
        </div>
      </div>

      {/* Metadata — Lokasi section */}
      <div className="rounded-md border border-border bg-card flex-shrink-0">
        <div className="px-3 py-1.5 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Lokasi
          </span>
        </div>
        <div className="px-3 py-1">
          <MetaRow label="Site" value={data.site} />
          <MetaRow label="Lokasi" value={data.location} />
          <MetaRow label="Detail Lokasi" value={data.detailLokasi} />
          <MetaRow label="Keterangan" value={data.keteranganLokasi} />
        </div>
      </div>

      {/* Metadata — Pelapor section */}
      <div className="rounded-md border border-border bg-card flex-shrink-0">
        <div className="px-3 py-1.5 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            Pelapor
          </span>
        </div>
        <div className="px-3 py-1">
          <MetaRow label="Timestamp" value={data.timestamp} />
          <MetaRow label="Pelapor / PIC" value={data.pic} />
          <MetaRow label="PIC Perusahaan" value={data.picPerusahaan} />
        </div>
      </div>

      {/* Similarity Breakdown (only for comparison) */}
      {showSimilarity && (
        <div className="rounded-md border border-border bg-card flex-shrink-0">
          <div className="px-3 py-2 border-b border-border bg-secondary/40">
            <span className="text-[11px] font-semibold text-muted-foreground">Similarity Breakdown</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <div className="px-3 py-2.5 text-center">
              <p className={`text-sm font-bold tabular-nums ${simColor(showSimilarity.imageSim)}`}>{showSimilarity.imageSim}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Image</p>
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className={`text-sm font-bold tabular-nums ${simColor(showSimilarity.textSim)}`}>{showSimilarity.textSim}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Text</p>
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className={`text-sm font-bold tabular-nums ${simColor(showSimilarity.totalSim)}`}>{showSimilarity.totalSim}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Total</p>
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold ${simLabelStyle(showSimilarity.simLabel)}`}>
              {showSimilarity.simLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Semantic Review</h2>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">{cluster.id}</p>
                {fromListHazard && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <button
                      onClick={() => onNavigateToCluster?.(cluster.id)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {cluster.name}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button className="p-1 rounded hover:bg-secondary disabled:opacity-30" disabled={clusterIndex <= 0}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[30px] text-center font-medium">{clusterIndex + 1} / {clusterIds.length}</span>
            <button className="p-1 rounded hover:bg-secondary disabled:opacity-30" disabled={clusterIndex >= clusterIds.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onBack} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics bar — enterprise style */}
      <div className="grid grid-cols-5 divide-x divide-border border-b border-border bg-card">
        <div className="px-4 py-2.5 text-center">
          <p className="text-lg font-bold text-foreground tabular-nums">{cluster.similarityAvg}%</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Similarity</p>
        </div>
        <div className="px-4 py-2.5 text-center">
          <p className="text-lg font-bold text-destructive tabular-nums">{cluster.duplicateCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Duplicate</p>
        </div>
        <div className="px-4 py-2.5 text-center">
          <p className="text-lg font-bold text-foreground tabular-nums">{cluster.potentialCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Potential</p>
        </div>
        <div className="px-4 py-2.5 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">{cluster.systemCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">System</p>
        </div>
        <div className="px-4 py-2.5 text-center">
          <p className="text-lg font-bold text-foreground tabular-nums">{cluster.waitingCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Waiting</p>
        </div>
      </div>

      {/* Layout */}
      <div className="flex-1 min-h-0 flex">
        {/* LEFT — Representative */}
        <div className={`${compact ? "w-1/2" : "flex-1"} border-r border-border flex flex-col`}>
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
              <Star className="h-3 w-3" /> Representative
            </span>
          </div>
          <ReportCard
            title="Laporan Utama"
            data={cluster.representative}
          />
        </div>

        {/* MIDDLE — Comparison */}
        <div className={`${compact ? "w-1/2" : "flex-1"} ${compact ? "" : "border-r border-border"} flex flex-col`}>
          {selectedReport ? (
            <>
              <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between">
                <StatusBadge status={selectedReport.status} />
              </div>
              <ReportCard
                title="Laporan Pembanding"
                data={{
                  fullId: selectedReport.fullId,
                  timestamp: `${selectedReport.date} ${selectedReport.timestamp}`,
                  pic: selectedReport.pic,
                  picPerusahaan: selectedReport.picPerusahaan,
                  site: selectedReport.site,
                  location: selectedReport.location,
                  detailLokasi: selectedReport.detailLokasi,
                  keteranganLokasi: selectedReport.keteranganLokasi,
                  deskripsi: selectedReport.deskripsi,
                  ketidaksesuaian: selectedReport.ketidaksesuaian,
                  subKetidaksesuaian: selectedReport.subKetidaksesuaian,
                  quickAction: selectedReport.quickAction,
                }}
                showSimilarity={selectedReport}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Pilih laporan dari daftar di sebelah kanan
            </div>
          )}
        </div>

        {/* RIGHT — Similar Reports (hidden in compact mode) */}
        {!compact && (
        <div className="w-[360px] min-w-[320px] flex flex-col bg-card">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-semibold">Laporan Mirip</h3>
            <span className="text-[11px] text-muted-foreground">{sortedReports.length} laporan</span>
          </div>

          {/* Sort + Filter bar */}
          <div className="px-3 py-1.5 border-b border-border flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background text-foreground"
              >
                <option value="desc">Similarity ↓</option>
                <option value="asc">Similarity ↑</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background text-foreground"
              >
                <option value="Semua">Semua</option>
                <option value="Duplicate">Duplicate</option>
                <option value="Potential">Potential</option>
                <option value="System">By System</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sortedReports.map((report) => {
              const isSelected = selectedReportId === report.id;
              const isBukanExpanded = bukanExpandId === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`rounded-lg border p-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  {/* ID + similarity */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-foreground">{report.fullId}</span>
                    <span className={`text-xs font-bold ${simColor(report.similarity)}`}>
                      {report.similarity}%
                    </span>
                  </div>

                  {/* Image + description side by side */}
                  <div className="flex gap-2 mb-1.5">
                    <div className="h-14 w-14 rounded bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                      <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-3 flex-1">{report.description}</p>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                    <span>{report.date} {report.timestamp}</span>
                    <span>·</span>
                    <span>{report.picPerusahaan}</span>
                  </div>

                  <StatusBadge status={report.status} />

                  {/* Auto-confirm countdown */}
                  {report.autoConfirmSeconds !== undefined && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Auto-confirm</span>
                      <span className="ml-auto font-medium">{Math.floor(report.autoConfirmSeconds / 60)}:{String(report.autoConfirmSeconds % 60).padStart(2, "0")}</span>
                    </div>
                  )}
                  {report.autoConfirmSeconds !== undefined && (
                    <div className="h-1 rounded-full bg-secondary mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(5, (report.autoConfirmSeconds / 60) * 100)}%` }} />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-2.5">
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border border-pill-green-fg/30 bg-pill-green-bg text-pill-green-fg text-xs font-semibold hover:opacity-80 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Duplicate
                    </button>
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border border-destructive/30 bg-pill-red-bg text-pill-red-fg text-xs font-semibold hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBukanExpandId(isBukanExpanded ? null : report.id);
                        setBukanReason("");
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Bukan
                    </button>
                  </div>

                  {/* Inline "Bukan Duplicate" reason */}
                  {isBukanExpanded && (
                    <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={bukanReason}
                        onChange={(e) => setBukanReason(e.target.value)}
                        placeholder="Alasan bukan duplicate…"
                        className="w-full text-xs border border-border rounded-md p-2 bg-background text-foreground resize-none h-16"
                      />
                      <button className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Cluster dibuat oleh AI · 17 Feb 2026
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default SemanticReview;
