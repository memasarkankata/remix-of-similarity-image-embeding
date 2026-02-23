import { Eye, MapPin, AlertTriangle, Image as ImageIcon, Layers, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface ClusterCardData {
  id: string;
  name: string;
  count: number;
  similarity: number;
  site: string;
  location: string;
  detailLocation: string;
  classificationTitle: string;
  classificationSubtitle: string;
  quickAction: string;
  description: string;
  tags: string[];
  coordinates: string;
}

interface ClusterCardProps {
  data: ClusterCardData & {
    jumlahDuplicate?: number;
    jumlahPotentialDuplicate?: number;
    jumlahDuplicateBySystem?: number;
    jumlahWaiting?: number;
    waitingSeconds?: number;
  };
  countdown?: number;
  onClick: (clusterId: string) => void;
}

const simColor = (v: number) => {
  if (v >= 90) return "text-destructive";
  if (v >= 80) return "text-bar-orange";
  if (v >= 70) return "text-pill-yellow-fg";
  return "text-pill-green-fg";
};

const formatCountdown = (totalSec: number): string => {
  if (totalSec <= 0) return "";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const ClusterCard = ({ data, countdown = 0, onClick }: ClusterCardProps) => {
  const waitingCount = data.jumlahWaiting ?? 0;
  const stats = [
    { label: "Duplicate", value: data.jumlahDuplicate ?? 0 },
    { label: "Potential", value: data.jumlahPotentialDuplicate ?? 0 },
    { label: "By System", value: data.jumlahDuplicateBySystem ?? 0 },
    { label: "Waiting", value: waitingCount },
  ];

  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative bg-card border border-border rounded-lg cursor-pointer transition-all duration-150 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 group overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-muted flex items-center justify-center border border-border">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground tracking-tight">{data.id}</span>
              <span className="text-[11px] text-muted-foreground ml-2">{data.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className={`text-lg font-bold tabular-nums ${simColor(data.similarity)}`}>{data.similarity}%</span>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Similarity</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
              className="p-1.5 rounded border border-border bg-card hover:bg-secondary text-muted-foreground transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid - 4 boxes */}
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
        {stats.map((stat) => (
          <div key={stat.label} className="px-2 py-2.5 text-center">
            <p className="text-base font-bold tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium leading-tight mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Waiting countdown */}
      {waitingCount > 0 && countdown > 0 && (
        <div className="px-4 py-1.5 border-b border-border bg-pill-yellow-bg/30 flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-pill-yellow-fg" />
          <span className="text-[10px] font-medium text-pill-yellow-fg">Waiting</span>
          <span className="ml-auto text-[11px] font-bold font-mono tabular-nums text-pill-yellow-fg">{formatCountdown(countdown)}</span>
        </div>
      )}

      {/* Body — image left, info right */}
      <div className="px-4 py-3">
        <div className="flex gap-3">
          {/* Image */}
          <div className="h-20 w-20 rounded bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
            <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
          </div>

          {/* Info stack */}
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{data.site} · {data.location} · {data.detailLocation}</span>
            </div>

            {/* Classification */}
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-3 w-3 text-pill-yellow-fg flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground leading-tight truncate">{data.classificationTitle}</p>
                <p className="text-[10px] text-muted-foreground truncate">{data.classificationSubtitle}</p>
              </div>
            </div>

            {/* Description */}
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{data.description}</p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] text-xs">{data.description}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterCard;
