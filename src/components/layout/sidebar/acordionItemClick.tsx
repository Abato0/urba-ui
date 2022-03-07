import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AccordionDetails,
  colors,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";

interface IProps {
  eventClick: () => void;
  label: string;
  icon?: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      // fontWeight: theme.typography.fontWeightRegular,
    },
    trNode: {
      "&:hover": {
        background: colors.blueGrey[50],
      },
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.grey[400],
      margin: 2,

      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      paddingLeft: 20,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: 5,
      // alignItems: "center",
      // justifyContent: "center"
    },
    icon: {
      marginRight: 10,
      marginLeft: 8,
      maxHeight: 14,
    },
    label: {
      color: colors.grey[800],
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(12),
    },
  })
);

const ItemSidebar: React.FC<IProps> = ({ eventClick, label, icon }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.trNode}
      style={{ cursor: "pointer" }}
      onClick={eventClick}
    >
      <Typography className={classes.label} variant="body2">
        {" "}
        {icon && <FontAwesomeIcon icon={icon} className={classes.icon} />}{" "}
        {label}
      </Typography>
    </div>
  );
};

export default ItemSidebar;