import { Download } from "lucide-react";
import Button from "./Button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CustomToaster from "./CustomToaster";
type Props = {
  headers: Record<string, string>;
  rows: Record<string, any>[];
  dataDef?: string;
};

const ExcelDownloadButton = ({ headers, rows, dataDef = "data" }: Props) => {
  const handleDownloadExcel = () => {
    try {
      if (rows.length === 0) throw new Error("No data to download");
      const worksheetData = [
        Object.keys(headers),
        ...rows.map((row) => Object.values(headers).map((h) => row[h])),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, dataDef);

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const date = new Date().toLocaleString();
      saveAs(blob, `${dataDef.toUpperCase()}_${date}.xlsx`);
      toast(<CustomToaster type="success" message="File Downloaded" />);
    } catch (error: any) {
      toast(
        <CustomToaster
          type="error"
          message={error.message || "Download Error"}
        />
      );
    }
  };
  return (
    <Button onClick={handleDownloadExcel}>
      <Download size={20} />
    </Button>
  );
};

export default ExcelDownloadButton;
