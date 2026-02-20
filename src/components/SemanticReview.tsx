import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Star, Copy, CheckCircle, XCircle, Clock, RefreshCw, FileText, MapPin, Users, ArrowUpDown, Filter } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import hazardImg1 from "@/assets/dummy-hazard-1.jpg";
import hazardImg2 from "@/assets/dummy-hazard-2.jpg";
import hazardImg3 from "@/assets/dummy-hazard-3.jpg";
import hazardImg4 from "@/assets/dummy-hazard-4.jpg";
import hazardImg5 from "@/assets/dummy-hazard-5.jpg";

const HAZARD_IMAGES = [hazardImg1, hazardImg2, hazardImg3, hazardImg4, hazardImg5];
const getHazardImage = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return HAZARD_IMAGES[Math.abs(hash) % HAZARD_IMAGES.length];
};

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
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bukanExpandId, setBukanExpandId] = useState<string | null>(null);
  const [bukanReason, setBukanReason] = useState("");

  const selectedReport = cluster.reports.find((r) => r.id === selectedReportId) ?? null;

  const filteredReports = cluster.reports.filter((r) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Annotated") return r.status === "Duplicate" || r.status === "Potential Duplicate";
    if (statusFilter === "Auto-confirm") return r.status === "Duplicate by System" || r.status === "Confirmed";
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

  const FILTER_OPTIONS = [
    { key: "All", label: "All" },
    { key: "Annotated", label: "Annotated by Human" },
    { key: "Auto-confirm", label: "Auto-confirm" },
    { key: "Waiting", label: "Waiting" },
  ];

  const MetaRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
    </div>
  );

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
    <div className="flex flex-col h-full overflow-y-auto subtle-scroll p-4 space-y-3">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {badge}
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        </div>
        <button
          onClick={() => copyId(data.fullId)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-card text-foreground text-[10px] font-semibold hover:bg-secondary transition-colors"
        >
          {data.fullId}
          {copiedId === data.fullId ? <CheckCircle className="h-3 w-3 text-pill-green-fg" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
        </button>
      </div>

      {/* Image */}
      <div className="rounded-md h-[160px] flex-shrink-0 overflow-hidden border border-border">
        <img src={getHazardImage(data.fullId)} alt="Hazard" className="w-full h-full object-cover" />
      </div>

      {/* Deskripsi Temuan */}
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

      {/* Klasifikasi */}
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

      {/* Lokasi */}
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

      {/* Pelapor */}
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

      {/* Similarity Breakdown */}
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

      {/* Metrics bar */}
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

        {/* RIGHT — Similar Reports */}
        {!compact && (
        <div className="w-[360px] min-w-[320px] flex flex-col bg-card">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-semibold">Laporan Mirip</h3>
            <span className="text-[11px] text-muted-foreground">{sortedReports.length} laporan</span>
          </div>

          {/* Sort icon + Filter tabs */}
          <div className="px-3 py-1.5 border-b border-border flex items-center gap-2">
            {/* Sort toggle — icon only */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className={`p-1 rounded hover:bg-secondary transition-colors ${sortOrder === "asc" ? "text-primary" : "text-muted-foreground"}`}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-[10px]">Similarity {sortOrder === "desc" ? "↓ Tinggi ke Rendah" : "↑ Rendah ke Tinggi"}</TooltipContent>
            </Tooltip>

            <div className="h-3.5 w-px bg-border" />

            {/* Filter tabs */}
            <div className="flex items-center gap-1 flex-1 overflow-x-auto subtle-scroll">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key)}
                  className={`whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                    statusFilter === opt.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto subtle-scroll p-2 space-y-1.5">
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

                  {/* Image + description */}
                  <div className="flex gap-2 mb-1.5">
                    <div className="h-14 w-14 rounded flex-shrink-0 border border-border overflow-hidden">
                      <img src={getHazardImage(report.fullId)} alt="Hazard" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-3 flex-1">{report.description}</p>
                  </div>

                  {/* Metadata */}
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

                  {/* Bukan reason */}
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
