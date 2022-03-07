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
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import HomeIcon from "@material-ui/icons/Home";
import { Avatar, colors, Paper, Popover } from "@material-ui/core";
import { showSidebar } from "../../utils/states";
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks";
import Notificaciones from "../core/notificacion/notificaciones";

import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { EnlacesSidebar } from "./app-sidebar";

import Cookies from "js-cookie";
import getAuthToken from "../../auth/auth-token";
import { authMe } from "../../auth/auth-service";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,

      // minWidth: 900
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: "white",
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
      color: colors.lightGreen[400],
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "grey",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    toolbar: {
      // backgroundColor: colors.green[700],
      background: "linear-gradient(to right, #4e54c8, #8f94fb)",
      minWidth: theme.spacing(126),
    },

    appbar: {
      borderColor: "white",
      minWidth: "660px",

      // width: "100%",
    },

    icons: {},
  })
);

const NavBar: React.FC = ({ children }) => {
  const router = useRouter();
  const classes = useStyles();
  const [openSidebar, setOpenSidebar] = useRecoilState(showSidebar);

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const autho = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const result = await authMe(token);
        console.log("result:", result);
      }
      console.log("token: ", token);
    } catch (error) {
      console.log("error: ", (error as Error).message);
    }
  };

  const cerrarSession = () => {
    Cookies.remove("token");
    handleMenuClose();
    return router.push("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={autho}>Perfil</MenuItem>
      <MenuItem
        onClick={() =>
          router.push(EnlacesSidebar.usuario.cambioContrasena.route)
        }
      >
        Cambiar Contraseña
      </MenuItem>
      <MenuItem onClick={cerrarSession}>Cerrar Sesión</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="primary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem {...bindTrigger(popupState)}>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        variant="outlined"
        style={{ minWidth: openSidebar ? "660px" : "525px" }}
        className={classes.appbar}
      >
        <Toolbar className={classes.toolbar} variant="regular">
          <IconButton
            edge="start"
            className={classes.menuButton}
            // color="primary"
            // classes={classes.icons}
            // color={colors.blueGrey[400]}
            aria-label="open drawer"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="primary"
            // color={colors.blueGrey[400]}
            aria-label="open drawer"
            onClick={() =>
              router.push({
                pathname: String(EnlacesSidebar.home.route),
              })
            }
          >
            <HomeIcon />
          </IconButton>

          {/* <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography> */}

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton>
              <Avatar alt="Remy Sharp" src="/img/home/img_avatar2.png">
                {/* <FontAwesomeIcon  icon={faUser} /> */}
              </Avatar>
            </IconButton>
            <IconButton
              className={classes.menuButton}
              aria-label="show 4 new mails"

              //  color="black"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="show 17 new notifications"
              // color="primary"
              // color="black"
              className={classes.menuButton}
              {...bindTrigger(popupState)}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              className={classes.menuButton}
              // color="black"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="primary"
              // color="black"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        // style={{ maxHeight: 0, overflow: "auto" }}
        // onScroll={}
      >
        <Notificaciones />
      </Popover>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default NavBar;