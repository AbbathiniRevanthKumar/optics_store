import { ArrowLeft, ArrowRight, Edit, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import ExcelDownloadButton from "./ExcelDownloadButton";

type Props = {
  headers: Record<string, string>;
  rows: Record<string, any>[];
  pageSize?: number;
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
  actions?: boolean;
  height?: string; // optional fixed height (e.g., "h-96")
  dataType?: string;
};

const TableGrid = ({
  headers = {},
  rows = [],
  pageSize = 5,
  onEdit,
  onDelete,
  actions = false,
  height = "h-62  md:h-78 lg:h-72",
  dataType = "data", // default height
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rows, searchQuery]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows =
    filteredRows.length > 0
      ? filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : [];

  return (
    <div>
      {/* Search & Actions */}
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-2">
        {/* Left Side Placeholder */}
        <div></div>

        {/* Right Side */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:justify-end md:gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 w-full md:w-48 text-sm text-text-primary rounded-lg border border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
          />
          <div
            className="flex items-center justify-center bg-primary hover:bg-primary-hover text-text-primary  rounded-lg transition "
            title="Click to download the Excel file"
          >
            <ExcelDownloadButton
              headers={headers}
              rows={rows}
              dataDef={dataType}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg bg-active/2 backdrop-blur-lg pb-4 md:pb-0  ${height}`}
      >
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="sticky top-0 bg-primary-hover/60 backdrop-blur-lg">
            <tr>
              {Object.keys(headers).map((header: string, idx: number) => (
                <th
                  key={idx}
                  className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-text-primary uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
              {actions && (
                <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition hover:bg-border/60 cursor-pointer border-b-2 border-border"
                >
                  {Object.values(headers).map((header, idy) => (
                    <td
                      key={idy}
                      className="px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm text-text-secondary whitespace-nowrap"
                    >
                      {row[header] ?? "-"}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-2 py-2 md:px-4 md:py-3 flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(row)}
                        className="text-primary/80 hover:text-primary transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete?.(row)}
                        className="text-error/80 hover:text-error transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    actions
                      ? Object.keys(headers).length + 1
                      : Object.keys(headers).length
                  }
                  className="text-center text-text-secondary py-6 md:py-8"
                >
                  No data to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* Pagination + Total Rows */}
      <div className="flex flex-col md:flex-row items-center md:justify-between md:items-center gap-2 p-4">
        {/* Total Rows */}
        <div className="text-sm text-text-secondary  md:text-start">
          showing {Math.min((currentPage - 1) * pageSize + 1, rows.length)} to{" "}
          {Math.min(currentPage * pageSize, rows.length)} of {rows.length}
        </div>

        {/* Mobile: Prev | Page | Next */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg text-sm transition
      ${
        currentPage === 1
          ? "bg-cards/100 text-text-secondary cursor-not-allowed"
          : "bg-primary text-text-primary hover:bg-primary-hover"
      }`}
          >
            Prev
          </button>
          <span className="text-sm font-medium text-text-primary">
            {Math.min(currentPage,totalPages)} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded-lg text-sm transition
      ${
        (currentPage === totalPages  || totalPages === 0)
          ? "bg-cards/100 text-text-secondary cursor-not-allowed"
          : "bg-primary text-text-primary hover:bg-primary-hover"
      }`}
          >
            Next
          </button>
        </div>

        {/* Desktop: full pagination */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition
      ${
        currentPage === 1
          ? "bg-cards/100 text-text-secondary cursor-not-allowed"
          : "bg-primary text-text-primary hover:bg-primary-hover active:bg-active"
      }`}
          >
            <ArrowLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition
        ${
          currentPage === page
            ? "bg-primary text-white"
            : "bg-cards/60 text-text-primary hover:bg-primary-hover hover:text-white"
        }`}
            >
              {page}
            </button>
          ))}
      
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={totalPages===0 || currentPage === totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition
      ${
        currentPage === totalPages || totalPages === 0
          ? "bg-cards/100 text-text-secondary cursor-not-allowed"
          : "bg-primary text-text-primary hover:bg-primary-hover active:bg-active"
      }`}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableGrid;
