import React from "react";
import {
  alpha,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { colors } from "@material-ui/core";
import { showSidebar } from "../../utils/states";
import { useRecoilState, useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      // backgroundColor: colors.blueGrey[400],
      backgroundColor: "black",
      // margin:"10px",
      // paddingRight: theme.spacing(3)
    },
    grow: {
      flexGrow: 1,
      minWidth: "620px",
      // backgroundColor: colors.blueGrey[50]
    },
    menuButton: {
      marginRight: theme.spacing(3),
    },
  })
);
const NavBar: React.FC = ({ children }) => {
  const classes = useStyles();
  const [ShowSidebar, setShowSidebar] = useRecoilState(showSidebar);

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setShowSidebar(!ShowSidebar);
              console.log("Show: ", ShowSidebar);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default NavBar;
