import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// --- Types ---
export interface FilterConfig {
  key: string;
  label: string;
  type: "multi-select" | "range";
  options: string[];
  disabled?: boolean;
  disabledTooltip?: string;
}

export interface ActiveFilters {
  [key: string]: string[];
}

export interface FilterToolbarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  activeFilters: ActiveFilters;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAll: () => void;
  children?: React.ReactNode;
}

// --- Multi-select dropdown ---
const MultiSelectDropdown = ({
  config,
  selected,
  onChange,
}: {
  config: FilterConfig;
  selected: string[];
  onChange: (values: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOptions = config.options.filter((o) =>
    o.toLowerCase().includes(localSearch.toLowerCase())
  );

  const toggle = (val: string) => {
    onChange(
      selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    );
  };

  const isActive = selected.length > 0;
  const label = isActive ? `${config.label} (${selected.length})` : config.label;

  if (config.disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-card text-muted-foreground/50 border-border cursor-not-allowed"
            disabled
          >
            {config.label}
            <ChevronDown className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {config.disabledTooltip || "Filter tidak tersedia di tampilan ini."}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          isActive
            ? "bg-accent text-accent-foreground border-primary/30"
            : "bg-card text-muted-foreground border-border hover:bg-secondary"
        }`}
      >
        {label}
        {isActive ? (
          <X
            className="h-3 w-3 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg min-w-[200px] max-h-[260px] flex flex-col">
          {config.options.length > 5 && (
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder="Cari..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full text-xs px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
          <div className="overflow-y-auto p-1">
            {filteredOptions.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer hover:bg-secondary rounded"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="rounded border-border"
                />
                <span>{opt}</span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <p className="text-xs text-muted-foreground px-3 py-2">Tidak ditemukan</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterToolbar = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  children,
}: FilterToolbarProps) => {
  const hasActiveFilters =
    searchValue.length > 0 ||
    Object.values(activeFilters).some((v) => v.length > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap py-3 px-1">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-3 py-1.5 text-xs rounded-full border border-border bg-card focus:outline-none focus:ring-1 focus:ring-ring w-60"
        />
      </div>

      {/* Filter chips */}
      {filters.map((f) => (
        <MultiSelectDropdown
          key={f.key}
          config={f}
          selected={activeFilters[f.key] || []}
          onChange={(vals) => onFilterChange(f.key, vals)}
        />
      ))}

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
        >
          <X className="h-3 w-3" />
          Clear All
        </button>
      )}

      {children}
    </div>
  );
};

export default FilterToolbar;
