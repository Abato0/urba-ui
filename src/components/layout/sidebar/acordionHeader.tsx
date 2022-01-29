import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  colors,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    trNode: {
      "&:hover": {
        background: colors.blueGrey[50],
      },
      width: "100%",
      height: "100%",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    icon: {
      // // marginTop: 8,
      marginRight: 10,
      marginLeft: 8,
      maxHeight: 16,
    },
  })
);

interface IProps {
  label: string;
  icon?: any;
}

const AcordionHeader: React.FC<IProps> = ({ label, children, icon }) => {
  const classes = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {icon && <FontAwesomeIcon icon={icon} className={classes.icon} />}
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.container}>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default AcordionHeader;
