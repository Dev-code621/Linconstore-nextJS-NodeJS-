import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useMediaQuery } from "@mui/material";
import { HelpOutline, NotificationsOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";

interface Imode {
  mode: boolean;
  admin: boolean;
}

const GenNav: React.FC<Imode> = ({ mode, admin }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { i18n ,t } = useTranslation();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
    </Menu>
  );
  //mobile
  const mobileMenuId = "help";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="Need Help" color="inherit">
          <HelpOutline />
        </IconButton>
      </MenuItem>
    </Menu>
  );
  const isLoggedIN = useContext(ContextApi).isLoggedIn;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isLoggedIN);
  useEffect(() => {
    const isLogged = localStorage.getItem("token");
    const isAdminLoggedin = localStorage.getItem("adminToken")
    if (isLogged || isAdminLoggedin) {
      setIsLoggedIn(true);
    }
  }, []);
  const isAdminLoggedIn = useContext(ContextApi).isAdminLoggedIn;
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    localStorage.setItem("currentLanguage", i18n.language);
    router.push("/login");
  };
  const matches: boolean = useMediaQuery("(max-width:180px)");
  const router = useRouter();
  const handleSellerBack = (): string => {
    const pathname = router.pathname;
    if (pathname.includes("/seller")) return "Go to Homepage";
    return "Sign In";
  };
  const handleSellerRoute = () => {
    const pathname = router.pathname;
    if (pathname.includes("/seller")) return router.push("/");
    router.push("/login");
  };
  return (
    <>
      <AppBar
        sx={{ maxHeight: "10vh", zIndex: "10" }}
        position="sticky"
        className={"nav"}
      >
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push("/")}
          >
            <img
              width={70}
              height={50}
              src={"/assets/img/bothword-store.png"}
              alt={"bothword picture"}
            />
          </IconButton>
          {mode && (
            <Typography variant={"h4"} sx={{ color: "#000", mt: 2 }}>
              {t("genNav.seller")}
            </Typography>
          )}
          {admin && (
            <Typography variant={"h4"} sx={{ color: "#000", mt: 2 }}>
              {t("genNav.admin")}
            </Typography>
          )}
          <Box sx={{ flexGrow: { sm: 1 } }} />
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {isLoggedIn && (
              <Button
                className={"myButton"}
                onClick={() => handleLogout()}
                variant={"outlined"}
                sx={{
                  mt: 0.5,
                  width: "100px",
                  background: "transparent",
                  height: "40px",
                  mx: 1,
                }}
              >
                {t("genNav.logout")}
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                className={"myButton"}
                onClick={handleSellerRoute}
                variant={"outlined"}
                sx={{
                  mt: 0.5,
                  width: "auto",
                  background: "transparent",
                  height: "40px",
                  mx: 1,
                }}
              >
                {handleSellerBack()}
              </Button>
            )}
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ color: "black" }}
            >
              <HelpOutline />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
          {!matches && (
            <Box sx={{ display: { ml: 2, xs: "flex", sm: "none" } }}>
              <IconButton
                size="small"
                aria-label=""
                color="inherit"
                sx={{ color: "black" }}
              >
                <HelpOutline />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
};
export default GenNav;
