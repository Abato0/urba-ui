import React from "react";
import {
  Button,
  createStyles,
  Fab,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
} from "@material-ui/core";
import { Row } from "react-table";

import { EyeCircle } from "mdi-material-ui";

interface IProps {
  className?: string;
  onSeeImg: any;
  row: Row;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(2),
    },
    absolute: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
  })
);

const VisualizarActionsCell: React.FC<IProps> = ({
  onSeeImg,
  row,
  className,
}) => {
  const classes = useStyles();

  return (
    <Tooltip className={className} placement="top" title="Visualizar">
      <IconButton
        color="secondary"
        onClick={() => onSeeImg(row.original)}
        className={classes.fab}
      >
        <EyeCircle />
      </IconButton>
    </Tooltip>
  );
};

export default VisualizarActionsCell;
