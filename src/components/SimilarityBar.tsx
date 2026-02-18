interface SimilarityBarProps {
  value: number;
}

const SimilarityBar = ({ value }: SimilarityBarProps) => {
  const barColor =
    value >= 80
      ? "bg-bar-red"
      : value >= 70
      ? "bg-bar-orange"
      : "bg-bar-grey";

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground w-8 text-right">
        {value}%
      </span>
    </div>
  );
};

export default SimilarityBar;
