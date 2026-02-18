import { X } from "lucide-react";

interface HazardDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenCluster?: (clusterId: string) => void;
  hazard: {
    id: string;
    timestamp: string;
    site: string;
    location: string;
    description: string;
    status: string;
    cluster: string;
    similarity: number;
  } | null;
}

const HazardDetailDrawer = ({ open, onClose, onOpenCluster, hazard }: HazardDetailDrawerProps) => {
  if (!open || !hazard) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-card border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-sm">Hazard Detail</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Hazard ID</span>
            <span className="font-medium text-primary">{hazard.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Timestamp</span>
            <span className="font-medium">{hazard.timestamp}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Site</span>
            <span className="font-medium">{hazard.site}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lokasi</span>
            <span className="font-medium">{hazard.location}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{hazard.status}</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
            Deskripsi Lengkap
          </h4>
          <p className="text-xs leading-relaxed">{hazard.description}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
            Cluster Info
          </h4>
          <div className="p-3 rounded border border-border bg-secondary/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-pill-purple-bg text-pill-purple-fg">
                {hazard.cluster}
              </span>
              <span className="text-xs text-muted-foreground">Similarity: {hazard.similarity}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Hazard ini terdeteksi sebagai duplikat berdasarkan analisis semantik terhadap deskripsi dan konteks lokasi yang serupa dalam cluster.
            </p>
            {onOpenCluster && (
              <button
                onClick={() => onOpenCluster(hazard.cluster)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Open cluster →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HazardDetailDrawer;
