interface StatusBadgeProps {
  status: string;
  variant?: "red" | "yellow" | "green" | "purple" | "blue";
}

const variantMap: Record<string, string> = {
  red: "bg-pill-red-bg text-pill-red-fg",
  yellow: "bg-pill-yellow-bg text-pill-yellow-fg",
  green: "bg-pill-green-bg text-pill-green-fg",
  purple: "bg-pill-purple-bg text-pill-purple-fg",
  blue: "bg-pill-blue-bg text-pill-blue-fg",
};

const autoVariant = (status: string): string => {
  const s = status.toLowerCase();
  if (s.includes("by system")) return "blue";
  if (s.includes("kuat") || s === "duplicate") return "red";
  if (s.includes("mungkin") || s.includes("potential")) return "yellow";
  if (s.includes("selesai") || s.includes("done")) return "green";
  return "purple";
};

const StatusBadge = ({ status, variant }: StatusBadgeProps) => {
  const v = variant ?? autoVariant(status);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${variantMap[v]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
