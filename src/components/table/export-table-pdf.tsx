import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, colors, Typography } from "@material-ui/core";
import jsPDF from "jspdf";
import autoTable, { ColumnInput } from "jspdf-autotable";
import { head, split } from "ramda";
import { FC } from "react";

interface IProps {
  idTable: string;
  title: string;
  columns: string[];
  classes: string;
}

export const ExportTablePdf: FC<IProps> = ({
  idTable,
  title,
  columns,
  classes,
}) => {
  const exportPdf = () => {
    const doc = new jsPDF();
    const date = new Date().toISOString();
    const dateStringISO = String(head(split("T", date)));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(dateStringISO, 170, 20);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(title, 80, 50);

    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(12);
    // doc.text("2021-12-30 - 2021-12-31", 90, 60);

    autoTable(doc, {
      html: `#${idTable}`,
      columns: columns,
      margin: {
        top: 80,
      },
    });

    doc.save(`${title}-${dateStringISO}.pdf`);
  };

  return (
    <Button
      className={classes}
      variant="contained"
      // color="secondary"
      // title="Export PDF"
      startIcon={<FontAwesomeIcon icon={faFilePdf} />}
      style={{
        backgroundColor: colors.red[800],
      }}
      onClick={exportPdf}
    >
      <Typography
        variant="button"
        style={{ fontSize: 11, fontFamily: "Roboto" }}
      >
        Exportar a Pdf
      </Typography>
    </Button>
  );
};
