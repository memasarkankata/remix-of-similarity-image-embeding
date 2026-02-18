import { useState } from "react";
import { ArrowUpDown, Eye, Search, ChevronDown } from "lucide-react";

const evalData = [
  { id: 7316822, timestamp: "2025-09-18 08:14", pic: "PT Multi Ardecon", site: "BMO 2", lokasi: "Marine", detailLoc: "Pembangunan …", ketidaksesuaian: "Pembelian, …", subKetidaksesuaian: "Penyimpanan bahan …", description: "Kaleng Thiner ditemukan tanpa label di area penyimpanan bahan kimia.", tbc: "6. Pengamanan", pspp: "1. Deviasi Prosedur", gr: "1. Deviasi Prosedur" },
  { id: 7316406, timestamp: "2025-09-18 07:52", pic: "PT Serasi …", site: "BMO 1", lokasi: "Office", detailLoc: "Office Cokelat", ketidaksesuaian: "DDP : Kelayakan da…", subKetidaksesuaian: "Tidak menggunakan …", description: "Wilnat kurang 1 unit pada…", tbc: "10. Tools Tidak L…", pspp: "10. Tools Tidak L…", gr: "10. Tools Tidak L…" },
  { id: 7316563, timestamp: "2025-09-18 07:41", pic: "PT Pamapersad…", site: "BMO 2", lokasi: "Workshop", detailLoc: "Bays Champions", ketidaksesuaian: "Kelayakan/Pengun…", subKetidaksesuaian: "Kesesuaian …", description: "Ditemukan Lock out tag o…", tbc: "7. LOTO", pspp: "7. LOTO", gr: "7. LOTO" },
  { id: 7316441, timestamp: "2025-09-18 07:33", pic: "PT Berau Coal", site: "BMO 2", lokasi: "Warehouse", detailLoc: "Gudang Handa…", ketidaksesuaian: "Pengelolaan Sampah", subKetidaksesuaian: "[ENV] Sampah …", description: "Sampah bertumpuk di ar…", tbc: "2. Housekeeping", pspp: "2. Housekeeping", gr: "2. Housekeeping" },
  { id: 7316163, timestamp: "2025-09-18 07:20", pic: "PT Aristec …", site: "BMO 2", lokasi: "Marine", detailLoc: "Sump/void", ketidaksesuaian: "Perlengkapan_Mesi…", subKetidaksesuaian: "Pelepasan komponen…", description: "Box battery tidak terpasa…", tbc: "11. Bahaya Elekt…", pspp: "11. Bahaya Elekt…", gr: "11. Bahaya Elekt…" },
  { id: 7316601, timestamp: "2025-09-18 07:11", pic: "PT Berau Coal", site: "LMO", lokasi: "Office", detailLoc: "Akses Masuk …", ketidaksesuaian: "Kelengkapan tang…", subKetidaksesuaian: "Alat Tanggap Darura…", description: "P2h unit dan alat tanggap…", tbc: "15. Deviasi Lainnya", pspp: "15. Deviasi Lainnya", gr: "15. Deviasi Lainnya" },
  { id: 7315941, timestamp: "2025-09-18 06:55", pic: "PT Bukit Makmu…", site: "LMO", lokasi: "Workshop", detailLoc: "Area …", ketidaksesuaian: "Perlengkapan_Mesi…", subKetidaksesuaian: "Penyesuaian/…", description: "Di temukan tyre aus mele…", tbc: "10. Tools Tidak L…", pspp: "10. Tools Tidak L…", gr: "10. Tools Tidak L…" },
  { id: 7316617, timestamp: "2025-09-18 06:40", pic: "PT Kaltim …", site: "BMO 1", lokasi: "Warehouse", detailLoc: "Red Zone Jalan …", ketidaksesuaian: "Standar Road …", subKetidaksesuaian: "Drainase tersumbat …", description: "Windrow tersumbat mater…", tbc: "8. Deviasi Road …", pspp: "8. Deviasi Road …", gr: "8. Deviasi Road …" },
  { id: 7315805, timestamp: "2025-09-18 06:30", pic: "PT Bukit Makmu…", site: "BMO 2", lokasi: "Marine", detailLoc: "(B7) JL Lavender", ketidaksesuaian: "Perawatan Jalan", subKetidaksesuaian: "Boulder", description: "Terdapat tumpahan mater…", tbc: "9. Kesesuaian", pspp: "9. Kesesuaian", gr: "9. Kesesuaian" },
];

const EvaluationTab = () => {
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = evalData.filter((r) =>
    `${r.id} ${r.description} ${r.pic}`.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as any)[sortKey];
    const bv = (b as any)[sortKey];
    const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortAsc ? cmp : -cmp;
  });

  const selectedData = selectedRow !== null ? evalData.find((r) => r.id === selectedRow) : null;

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <th className="cursor-pointer group" onClick={() => handleSort(field)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100" />
      </span>
    </th>
  );

  const FilterChip = ({ label }: { label: string }) => (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card text-muted-foreground border border-border hover:bg-secondary">
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-1">Tabel Labeling</h2>
      {/* Filter toolbar */}
      <div className="flex items-center gap-2 flex-wrap py-3 px-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Task ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-full border border-border bg-card focus:outline-none focus:ring-1 focus:ring-ring w-48"
          />
        </div>
        <FilterChip label="Site" />
        <FilterChip label="Lokasi" />
        <FilterChip label="Ketidaksesuaian" />
        <FilterChip label="Sub Ketidaksesuaian" />
        <FilterChip label="TBC" />
        <FilterChip label="PSPP" />
        <FilterChip label="GR" />
        <FilterChip label="Confidence" />
        <FilterChip label="Time Left" />
      </div>

      {/* Selected row info bar */}
      {selectedData && (
        <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-accent rounded-md text-xs">
          <span className="font-semibold text-primary bg-card px-2 py-0.5 rounded">{selectedData.id}</span>
          <span className="text-muted-foreground">Description:</span>
          <span className="truncate">{selectedData.description}</span>
          <span className="ml-auto text-muted-foreground">{selectedData.site} · {selectedData.lokasi}</span>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto border border-table-border rounded-md">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="w-8 text-center">#</th>
              <SortHeader label="Task ID" field="id" />
              <SortHeader label="Timestamp" field="timestamp" />
              <SortHeader label="PIC Perusahaan" field="pic" />
              <SortHeader label="Site" field="site" />
              <SortHeader label="Lokasi" field="lokasi" />
              <th>Detail Location</th>
              <th>Ketidaksesuaian</th>
              <th>Sub Ketidaksesuaian</th>
              <th>Description</th>
              <th>TBC</th>
              <th>PSPP</th>
              <th>GR</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.id}
                className={selectedRow === row.id ? "selected" : ""}
                onClick={() => setSelectedRow(row.id === selectedRow ? null : row.id)}
              >
                <td className="text-center text-muted-foreground">{i + 1}</td>
                <td className="font-medium text-primary">{row.id}</td>
                <td>{row.timestamp}</td>
                <td className="max-w-[130px] truncate">{row.pic}</td>
                <td>{row.site}</td>
                <td>{row.lokasi}</td>
                <td className="max-w-[120px] truncate">{row.detailLoc}</td>
                <td className="max-w-[130px] truncate">{row.ketidaksesuaian}</td>
                <td className="max-w-[140px] truncate">{row.subKetidaksesuaian}</td>
                <td className="max-w-[200px] truncate">{row.description}</td>
                <td className="max-w-[120px] truncate text-xs">{row.tbc}</td>
                <td className="max-w-[120px] truncate text-xs">{row.pspp}</td>
                <td className="max-w-[120px] truncate text-xs">{row.gr}</td>
                <td>
                  <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end px-2 py-2 text-xs text-muted-foreground">
        Showing {sorted.length} rows · Selected: {selectedRow ? 1 : 0}
      </div>
    </div>
  );
};

export default EvaluationTab;
