import { Eye, MapPin, AlertTriangle, Image as ImageIcon, Layers } from "lucide-react";
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
  data: ClusterCardData;
  onClick: (clusterId: string) => void;
}

const simColor = (v: number) => {
  if (v >= 90) return "text-destructive";
  if (v >= 80) return "text-bar-orange";
  if (v >= 70) return "text-pill-yellow-fg";
  return "text-pill-green-fg";
};

const tagColor = (tag: string) => {
  if (tag.startsWith("GCL")) return "bg-pill-blue-bg text-pill-blue-fg";
  if (tag.startsWith("LCL")) return "bg-pill-yellow-bg text-pill-yellow-fg";
  return "bg-pill-purple-bg text-pill-purple-fg";
};

const ClusterCard = ({ data, onClick }: ClusterCardProps) => {
  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 group"
    >
      {/* Eye icon top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
        className="absolute top-3 right-3 p-1 rounded hover:bg-secondary text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <Layers className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{data.id}</span>
              <span className="text-xs text-muted-foreground">· {data.count} laporan</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${simColor(data.similarity)}`}>{data.similarity}%</span>
          <p className="text-[10px] text-muted-foreground">Similarity</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 mb-3">
        {data.tags.map((tag) => (
          <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tagColor(tag)}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Location row */}
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{data.site} · {data.location} · {data.detailLocation}</span>
        </div>
        <span className="text-[10px]">{data.coordinates}</span>
      </div>

      {/* Classification block */}
      <div className="flex gap-3 mb-3">
        <div className="h-16 w-16 rounded bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
          <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-pill-yellow-fg flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight truncate">{data.classificationTitle}</p>
              <p className="text-[11px] text-muted-foreground truncate">{data.classificationSubtitle}</p>
            </div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded border border-pill-green-fg/30 text-pill-green-fg text-[10px] font-semibold">
            {data.quickAction}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="border border-border rounded p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[300px] text-xs">{data.description}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ClusterCard;
