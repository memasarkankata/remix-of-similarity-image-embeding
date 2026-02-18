import { X } from "lucide-react";

interface ClusterDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  cluster: {
    id: string;
    name: string;
    count: number;
    similarity: number;
    status: string;
    site: string;
    location: string;
    description: string;
  } | null;
}

const hazardItems = [
  { id: "36-23917", desc: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam." },
  { id: "36-23920", desc: "Driver LV tidak menggunakan seatbelt saat melintas gerbang." },
  { id: "36-23930", desc: "HD melaju 40 km/jam melewati area gerbang utama." },
  { id: "36-23931", desc: "Kendaraan LV melaju dengan kecepatan tinggi di area 30 km/jam." },
  { id: "36-23932", desc: "Dump truck melintas gerbang dengan kecepatan 35 km/jam." },
];

const ClusterDetailDrawer = ({ open, onClose, cluster }: ClusterDetailDrawerProps) => {
  if (!open || !cluster) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-card border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-sm">Cluster Detail</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cluster ID</span>
            <span className="font-medium text-primary">{cluster.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Nama Cluster</span>
            <span className="font-medium">{cluster.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{cluster.status}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Similarity Avg</span>
            <span className="font-medium">{cluster.similarity}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Site</span>
            <span className="font-medium">{cluster.site}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lokasi</span>
            <span className="font-medium">{cluster.location}</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
            Hazards in Cluster ({cluster.count})
          </h4>
          <div className="space-y-2">
            {hazardItems.slice(0, cluster.count).map((h) => (
              <div
                key={h.id}
                className="p-2.5 rounded border border-border bg-secondary/50 text-xs hover:bg-secondary cursor-pointer"
              >
                <span className="font-medium text-primary">{h.id}</span>
                <p className="text-muted-foreground mt-1 line-clamp-2">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterDetailDrawer;
