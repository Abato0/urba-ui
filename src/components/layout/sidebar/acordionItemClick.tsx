import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AccordionDetails,
  Button,
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
        background: colors.deepPurple[50],
      },
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.deepPurple[400],
      margin: 2,
      color:colors.deepPurple[400],

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
      // marginRight: 10,
      // marginLeft: 8,
      // maxHeight: 14,
    },
    label: {
      color: colors.deepPurple[800],
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(12),
    },
  })
);

const ItemSidebar: React.FC<IProps> = ({ eventClick, label, icon }) => {
  const classes = useStyles();
  return (
    <Button
      variant="outlined"
      className={classes.trNode}
      style={{ cursor: "pointer" }}
      onClick={eventClick}

      // startIcon={<FontAwesomeIcon icon={icon} className={classes.icon} />}
    >
      <Typography className={classes.label} variant="body2">
        {" "}
        {/* {icon && <FontAwesomeIcon icon={icon} className={classes.icon} />}{" "} */}
        {label}
      </Typography>
    </Button>
  );
};

export default ItemSidebar;
