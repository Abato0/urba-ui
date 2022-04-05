import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  colors,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import jsPDF from "jspdf";
import autoTable, { ColumnInput } from "jspdf-autotable";
import { head, split } from "ramda";
import { FC } from "react";

import { FilePdfBox as FilePdfBoxIcon } from "mdi-material-ui";

interface IProps {
  idTable: string;
  title: string;
  columns: string[];
  classes: string;
  orientacion?: "landscape" | "portrait";
}

export const ExportTablePdf: FC<IProps> = ({
  idTable,
  title,
  columns,
  classes,
  orientacion = "portrait",
}) => {
  const exportPdf = () => {
    const doc = new jsPDF({
      orientation: orientacion,
      // unit: "in",
      // format: [4, 2],
    });
    const date = new Date().toISOString();
    const dateStringISO = String(head(split("T", date)));

    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(10);
    // doc.text(dateStringISO, 170, 20);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(title, 80, 30);

    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(12);
    // doc.text("2021-12-30 - 2021-12-31", 90, 60);

    autoTable(doc, {
      html: `#${idTable}`,
      columns: columns,
      margin: {
        top: 50,
      },
    });

    doc.save(`${title}-${dateStringISO}.pdf`);
  };

  return (
    <>
      <Tooltip title="Exportar a Pdf">
        <IconButton onClick={exportPdf}>
          <FilePdfBoxIcon
            fontSize="large"
            style={{
              color: colors.red[800],
            }}
          />
        </IconButton>
      </Tooltip>
      {/* <Button
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
      </Button> */}
    </>
  );
};
