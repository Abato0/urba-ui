import {
  Avatar,
  Button,
  colors,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faListAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
  gridContent: {
    // marginTop: "60px",
  },
  paperItem: {
    // minWidth: 250,
    // maxWidth: 300,
    display: "flex",
    flexDirection: "column",
    // justifyItems: "center",
    alignItems: "center",
  },
  cardItem: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    // justifyItems: "center",
    // alignContent: "center",
    alignItems: "center",
  },
  icon: {
    display: "flex",
    flexDirection: "column",
    // height: 70,
    // // borderRadius: "100%",
    // backgroundColor: colors.blueGrey[100],
    // padding:"20px",
  },
  List: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",

    marginLeft: "25px",
    // alignItems:
  },
  ListItem: {
    margin: "2px",
    // backgroundColor:"red",
    width: "100%",
  },
  titulo: {
    textAlign: "center",
    paddingTop: "12px",
  },
  iconButton: {
    height: 15,
  },
  avatar: {
    backgroundColor: colors.blueGrey[900],
    // color: "red"
  },
});

interface IProps {
  icon: any;
  titulo: string;
  onclickListado: () => void;
  onclickIngreso: () => void;
}

const CardItemHome: React.FC<IProps> = ({
  icon,
  titulo,
  onclickIngreso,
  onclickListado,
}) => {
  icon.icon;
  const classes = useStyles();
  return (
    <Paper className={classes.paperItem}>
      <Typography variant="h6" className={classes.titulo}>
        {titulo}
      </Typography>
      <div className={classes.cardItem}>
        <Avatar variant="circle" className={classes.avatar}>
          <FontAwesomeIcon className={classes.icon} icon={icon} />
        </Avatar>

        <div className={classes.List}>
          <Button
            startIcon={
              <FontAwesomeIcon
                icon={faListAlt}
                className={classes.iconButton}
                onClick={onclickListado}
              />
            }
            variant="text"
            className={classes.ListItem}
          >
            Listado
          </Button>
          <Button
            startIcon={
              <FontAwesomeIcon icon={faEdit} className={classes.iconButton} />
            }
            variant="text"
            className={classes.ListItem}
            onClick={onclickIngreso}
          >
            Ingreso
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default CardItemHome;
