import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Star, Calendar, User, MapPin, Globe, Copy, CheckCircle, XCircle, Clock, RefreshCw, Info, Image as ImageIcon, FileText, ClipboardList } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// --- Types ---
interface SimilarReport {
  id: string;
  fullId: string;
  date: string;
  pic: string;
  status: "Duplicate" | "Potential Duplicate" | "Duplicate by System";
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
  keterangan: string;
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
  representative: {
    fullId: string;
    timestamp: string;
    pic: string;
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
    representative: {
      fullId: "HR-2025-336-23917",
      timestamp: "2025-12-13T07:45:00Z",
      pic: "Siti Rahayu",
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
        id: "23930", fullId: "HR-2025-336-23930", date: "01 Des 2025", pic: "Eko Prasetyo",
        status: "Duplicate", description: "HD melaju 40 km/jam melewati area gerbang utama mengurangi…",
        similarity: 89, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "HD melaju 40 km/jam melewati area gerbang utama mengurangi kecepatan hanya saat melewati pos security.",
        imageSim: 72, textSim: 94, totalSim: 89, keterangan: "Gambar berpotensi sama, deskripsi mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23931", fullId: "HR-2025-336-23931", date: "30 Nov 2025", pic: "Suryadi Wijaya",
        status: "Duplicate", description: "Kendaraan LV melaju dengan kecepatan tinggi di area 30 km/jam tanpa…",
        similarity: 86, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Kendaraan LV melaju dengan kecepatan tinggi di area 30 km/jam tanpa mengurangi kecepatan sama sekali.",
        imageSim: 68, textSim: 91, totalSim: 86, keterangan: "Gambar cukup mirip, deskripsi sangat mirip",
        ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendara…", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", quickAction: "Warning Letter",
      },
      {
        id: "23932", fullId: "HR-2025-336-23932", date: "29 Nov 2025", pic: "Agung Nugroho",
        status: "Potential Duplicate", description: "Dump truck melintas gerbang dengan kecepatan 35 km/jam di zona 25 km/jam.",
        similarity: 84, autoConfirmSeconds: 58,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Dump truck melintas gerbang dengan kecepatan 35 km/jam di zona 25 km/jam.",
        imageSim: 60, textSim: 88, totalSim: 84, keterangan: "Gambar berbeda konteks, deskripsi mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23920", fullId: "HR-2025-336-23920", date: "02 Des 2025", pic: "Bambang Sutrisno",
        status: "Potential Duplicate", description: "Driver LV tidak menggunakan seatbelt saat melintas gerbang.",
        similarity: 83, autoConfirmSeconds: undefined,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "Driver LV tidak menggunakan seatbelt saat melintas gerbang.",
        imageSim: 55, textSim: 82, totalSim: 83, keterangan: "Gambar berbeda, deskripsi cukup mirip",
        ketidaksesuaian: "Kelayakan/Penggunaan Tools", subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools", quickAction: "Safety Briefing",
      },
      {
        id: "23940", fullId: "HR-2025-336-23940", date: "03 Des 2025", pic: "Siti Rahayu",
        status: "Duplicate by System", description: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
        similarity: 99, autoConfirmSeconds: 0,
        site: "BMO 1", location: "Hauling Road", detailLokasi: "Gerbang Utama Site", keteranganLokasi: "(B 65) Area Gerbang",
        deskripsi: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
        imageSim: 98, textSim: 100, totalSim: 99, keterangan: "Laporan identik – same reporter, Δt ≤ 5s",
        ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendara…", subKetidaksesuaian: "Tidak menggunakan APD sesuai standard", quickAction: "Warning Letter",
      },
    ],
  },
];

// Build cluster map for pagination
const clusterIds = ["SCL-001", "SCL-002", "SCL-003", "SCL-004", "SCL-005", "SCL-006", "SCL-007", "SCL-008"];

interface SemanticReviewProps {
  clusterId: string;
  onBack: () => void;
  compact?: boolean;
  selectedHazardId?: string;
}

const SemanticReview = ({ clusterId, onBack, compact = false, selectedHazardId }: SemanticReviewProps) => {
  const clusterIndex = clusterIds.indexOf(clusterId);
  const cluster = dummyClusters.find((c) => c.id === clusterId) ?? dummyClusters[0];

  // In compact mode, find the report matching selectedHazardId, or use first report
  const initialReportId = selectedHazardId
    ? cluster.reports.find((r) => r.fullId === selectedHazardId)?.id ?? cluster.reports[0]?.id ?? null
    : cluster.reports[0]?.id ?? null;

  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReportId);
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bukanExpandId, setBukanExpandId] = useState<string | null>(null);
  const [bukanReason, setBukanReason] = useState("");

  const selectedReport = cluster.reports.find((r) => r.id === selectedReportId) ?? null;

  const filteredReports = cluster.reports.filter((r) => {
    if (statusFilter === "Semua") return true;
    if (statusFilter === "Duplicate") return r.status === "Duplicate";
    if (statusFilter === "Potential") return r.status === "Potential Duplicate";
    if (statusFilter === "System") return r.status === "Duplicate by System";
    return true;
  });

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const simColor = (v: number) =>
    v >= 80 ? "text-destructive font-bold" : v >= 70 ? "text-bar-orange font-bold" : "text-muted-foreground font-semibold";

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
      fullId: string; timestamp: string; pic: string; site: string;
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

      {/* Image placeholder */}
      <div className="bg-secondary rounded-md aspect-[16/9] flex items-center justify-center border border-border">
        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
      </div>

      {/* Deskripsi Temuan */}
      <div className="rounded-md border border-border bg-card">
        <div className="px-3 py-2 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Deskripsi Temuan
          </span>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-xs leading-relaxed text-foreground">{data.deskripsi}</p>
        </div>
      </div>

      {/* Klasifikasi */}
      <div className="rounded-md border border-border bg-card">
        <div className="px-3 py-2 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <ClipboardList className="h-3 w-3" />
            Klasifikasi
          </span>
        </div>
        <div className="px-3 py-1">
          <MetaRow label="Ketidaksesuaian" value={data.ketidaksesuaian} />
          <MetaRow label="Sub Ketidaksesuaian" value={data.subKetidaksesuaian} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[11px] text-muted-foreground">Quick Action</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-foreground text-[10px] font-semibold">{data.quickAction}</span>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-md border border-border bg-card">
        <div className="px-3 py-2 border-b border-border bg-secondary/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3 w-3" />
            Metadata
          </span>
        </div>
        <div className="px-3 py-1">
          <MetaRow label="Timestamp" value={data.timestamp} />
          <MetaRow label="Pelapor / PIC" value={data.pic} />
          <MetaRow label="Site" value={data.site} />
          <MetaRow label="Lokasi" value={data.location} />
          <MetaRow label="Detail Lokasi" value={data.detailLokasi} />
          <MetaRow label="Keterangan Lokasi" value={data.keteranganLokasi} />
        </div>
      </div>

      {/* Similarity Breakdown (only for comparison) */}
      {showSimilarity && (
        <div className="rounded-md border border-border bg-card">
          <div className="px-3 py-2 border-b border-border bg-secondary/40">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <ClipboardList className="h-3 w-3" />
              Similarity Breakdown
            </span>
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
          <div className="px-3 py-2">
            <p className="text-[11px] text-muted-foreground italic">"{showSimilarity.keterangan}"</p>
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
              <p className="text-xs text-muted-foreground">{cluster.id} · {cluster.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Pagination */}
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

      {/* Metrics chips */}
      <div className="flex items-center gap-3 px-5 py-2 border-b border-border bg-card">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          ✦ Similarity {cluster.similarityAvg}%
        </span>
        <span className="text-xs text-muted-foreground">Total <strong className="text-foreground">{cluster.total}</strong></span>
        <span className="text-xs">·</span>
        <span className="text-xs text-destructive">Duplicate <strong>{cluster.duplicateCount}</strong></span>
        <span className="text-xs">·</span>
        <span className="text-xs text-pill-yellow-fg">Potential <strong>{cluster.potentialCount}</strong></span>
        <span className="text-xs">·</span>
        <span className="text-xs text-pill-blue-fg flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          System <strong>{cluster.systemCount}</strong>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[260px] text-xs">
              Auto-detected duplicate: high similarity + same reporter + timestamp delta ≤ 5s (or identical hash).
            </TooltipContent>
          </Tooltip>
        </span>
      </div>

      {/* Layout */}
      <div className="flex-1 min-h-0 flex">
        {/* LEFT — Representative */}
        <div className={`${compact ? "w-1/2" : "w-[380px] min-w-[320px]"} border-r border-border flex flex-col`}>
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
        <div className={`${compact ? "w-1/2" : "flex-1 min-w-[280px]"} ${compact ? "" : "border-r border-border"} flex flex-col`}>
          {selectedReport ? (
            <>
              <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between">
                <StatusBadge status={selectedReport.status} />
              </div>
              <ReportCard
                title="Laporan Pembanding"
                data={{
                  fullId: selectedReport.fullId,
                  timestamp: selectedReport.date,
                  pic: selectedReport.pic,
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
        <div className="w-[300px] min-w-[260px] flex flex-col bg-card">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-semibold">Laporan Mirip</h3>
            <span className="text-[11px] text-muted-foreground">{filteredReports.length} laporan</span>
          </div>

          {/* Filter */}
          <div className="px-3 py-1.5 border-b border-border">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-[11px] border border-border rounded-md px-2 py-1 bg-background text-foreground"
            >
              <option value="Semua">↕ Semua — Sort by Similarity</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Potential">Potential Duplicate</option>
              <option value="System">Duplicate by System</option>
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredReports.map((report) => {
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
                  <div className="flex gap-2">
                    {/* Thumbnail */}
                    <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                      <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-foreground">{report.fullId}</span>
                          <p className="text-[10px] text-muted-foreground">{report.date} · {report.pic}</p>
                        </div>
                        <span className={`text-xs font-bold ${simColor(report.similarity)}`}>
                          {report.similarity}%
                        </span>
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{report.description}</p>
                    </div>
                  </div>

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
