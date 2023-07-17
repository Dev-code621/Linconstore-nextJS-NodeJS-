import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Card,
  Divider,
  FormControl,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircleOutlined,
  FavoriteBorder,
  NotificationsOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { useGetAllCategories, useGetCart } from "../../hooks/useDataFetch";
import { useCallback, useContext, useEffect, useState } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { TCart } from "../../Helpers/Types";
import Avatar from "@mui/material/Avatar";
import { useTranslation } from "react-i18next";
let isFirst = false
type ICat = {
  title: string;
  _id: string;
};

export default function Nav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { i18n, t } = useTranslation();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (url: string) => {
    // router.push(url)
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const handleRoute = (url: string) => {
    if (isLoggedIn) {
      return router.push(url);
    }

    router.push("/login");
  };
  const [category, setCategory] = React.useState("All categories");

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
      <MenuItem onClick={() => router.push("/account")}>Account</MenuItem>
    </Menu>
  );
  const [search, setSearch] = useState<string>("");
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [search]
  );
  const [allCategories, setAllCategories] = useState<ICat[]>([]);
  const onSuccess = (data: ICat[]) => {
    setAllCategories(data);
  };
  useGetAllCategories(onSuccess);
  const searchProducts = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let id: string = "";
      if (category !== "All categories") {
        const newData = allCategories;
        const filteredData = newData.find((value) => value.title === category);
        id = filteredData!._id;
      }
      0;
      if (search.length === 0) return;
      router.push(`/search/${search + "&" + id}`);
      setSearch("");
    },
    [search]
  );
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    localStorage.setItem("currentLanguage", i18n.language);
    router.push("/login");
  };
  const cartChange = useContext(ContextApi).cartChange;
  const [cartLength, setCartLength] = useState<number>(0);
  const onCartSuccess = (data: TCart) => {
    setCartLength(data?.products?.length);
  };
  const handleRefetchContext = useContext(ContextApi).handleRefetch;
  const { refetch } = useGetCart(onCartSuccess);

  useEffect(() => {
    handleRefetchContext()
    const token = localStorage.getItem('token');
    if(!token) return 
    const timeout = setTimeout(() => {
      isFirst= true
      refetch()
    },400)
    return () => clearTimeout(timeout)
  }, [])
  const handleRefetchCart = () => {
    refetch();
  };
  useEffect(() => {

    const timeout = setTimeout(() => {
      if (isLoggedIn && isFirst) {
        refetch();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [cartChange]);
  const mobileMenuId = "primary-search-account-menu-mobile";
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
        <IconButton
          size="large"
          className={"navHover"}
          aria-label="show 17 new notifications"
          color="inherit"
        >
          {/*<Badge badgeContent={17} color="error">*/}
          {/*    <NotificationsIcon />*/}
          {/*</Badge>*/}
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
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
  const matches: boolean = useMediaQuery("(max-width:180px)");
  const router = useRouter();
  return (
    <>
      <AppBar position="sticky" className={"nav"}>
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            aria-label="open drawer"
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
            onClick={() => router.push("/")}
          >
            <img
              width={70}
              height={50}
              src={"/assets/img/bothword-store.png"}
              alt={"picture for icon"}
            />
          </IconButton>
          <Box sx={{ flexGrow: { sm: 0.4 } }} />
          {/* make a search box rounded */}
          <form onSubmit={searchProducts} className="search__bar__header">
              <FormControl
                sx={{
                  border: "none",
                  m: 1,
                  minWidth: { xs: 140, sm: 140, md: 135, lg: 115 },
                  display: 'block', /* Set the default display to block */

                  '@media (max-width: 500px)': {
                    display: 'none', /* Hide on mobile devices */
                  },
                }}
                size="medium"
              >
                <Select
                  className={"select"}
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={category}
                  sx={{
                    border: "0px",
                    "& fieldset": {
                      border: "none !important",
                      outline: "none !important",
                    },
                  }}
                  variant={"outlined"}
                  onChange={handleChange}
                >
                  <MenuItem value="All categories">
                    <Typography mt={0.3} variant={"body2"}>
                      All Categories
                    </Typography>
                  </MenuItem>
                  {allCategories?.length > 0 && allCategories.map((category, index) => (
                    <MenuItem key={index} value={category.title}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder={t("nav.search_title")}
            />
            <IconButton type={"submit"} className={"searchIcon"}>
              {" "}
              <SearchIcon />
            </IconButton>
          </form>
          <Box sx={{ flexGrow: { md: 0.2 } }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isLoggedIn && (
              <Button
                className={"myButton"}
                onClick={() => handleLogout()}
                variant={"outlined"}
                sx={{
                  mt: 0.5,
                  width: "100%",
                  background: "transparent",
                  height: "100%",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mx: 1,
                }}
              >
                {t("nav.logout")}
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                className={"myButton"}
                onClick={() => router.push("/login")}
                variant={"outlined"}
                sx={{
                  mt: 0.5,
                  width: "100%",
                  height: "100%",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: "transparent",
                  // height: "40px",
                  mx: 1,
                }}
              >
                {t("nav.signIn")}
              </Button>
            )}
            <IconButton
              size="large"
              aria-label="Your shopping cart"
              color="inherit"
              sx={{ color: "black" }}
              onClick={() => handleRoute("/cart")}
            >
              <Badge badgeContent={cartLength} color="error">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="Your shopping cart"
              color="inherit"
              sx={{ color: "black" }}
              onClick={() => handleRoute("/wishlist")}
            >
              <FavoriteBorder />
            </IconButton>
            <IconButton
              className={"navHover"}
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ color: "black" }}
            >
              {/*<Badge badgeContent={17} color="error">*/}
              <NotificationsOutlined />
              {/*</Badge>*/}
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ color: "black" }}
            >
              <AccountCircleOutlined />
            </IconButton>
            {/*<Card sx={{maxWidth: 400, my:2, p:1}} className={'max1'}>*/}
            {/*    <Box sx={{display:'flex', gap:2, p:1}}>*/}
            {/*        <Avatar  variant={'circular'}>HR</Avatar>*/}
            {/*        <Stack spacing={0.4}>*/}
            {/*            <Typography variant={'h6'}>Admin</Typography>*/}
            {/*            <Typography component={'h6'} gutterBottom variant={'subtitle2'}>*/}
            {/*                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, vel?*/}
            {/*            </Typography>*/}
            {/*        </Stack>*/}
            {/*    </Box>*/}
            {/*    <Divider/>*/}
            {/*</Card>*/}
          </Box>
          {!matches && (
            <Box sx={{ display: { ml: 2, xs: "flex", md: "none" } }}>
              <IconButton
                className={"navHover"}
                size="small"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{ color: "black" }}
              >
                {/*<Badge badgeContent={17} color="error">*/}
                <NotificationsIcon />
                {/*</Badge>*/}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
