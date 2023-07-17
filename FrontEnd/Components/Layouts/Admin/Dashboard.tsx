import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Head from "next/head";
import { useRouter } from "next/router";
import GenNav from "../GenNav";
import StoreHeader from "../../Seller/StoreHeader";
import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function DashboardContent({ children }: any) {
  const router = useRouter();
  const isMatches = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width : 600px)");
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.back();
    }
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "100vh !important",
          overflowY: "hidden",
        }}
      >
        <GenNav mode={false} admin={true} />
        <Box sx={{ display: "flex" }}>
          {!isMobile && (
            <Drawer variant="permanent" open={!isMatches}>
              <Divider />
              <List component="nav">
                {menuItems.map((item, index) => (
                  <ListItemButton
                    onClick={() => router.push(item.path)}
                    selected={router.pathname === item.path}
                    key={index}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
          )}
          <Box
            component="main"
            sx={{
              marginTop: 1,
              flexGrow: 1,
              height: "96.3vh",
              overflow: "auto",
            }}
          >
            <Container maxWidth="xl" sx={{ mb: 2 }}>
              {children}
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard({ children }: any) {
  return (
    <>
      <Head>
        <title>Lincon</title>
        <meta name="Welcome to my store" content="Jack Store" />
        {/*<link rel="icon" href="/favicon.png" />*/}
      </Head>
      <DashboardContent> {children} </DashboardContent>
    </>
  );
}

export const menuItems = [
  {
    text: "Home",
    path: "/admin",
  },
  {
    text: "Products",
    path: "/admin/products",
  },
  {
    text: "Store Payout",
    path: "/admin/store",
  },
  {
    text: "Sellers",
    path: "/admin/sellers",
  },
  {
    text: "Users",
    path: "/admin/users",
  },
  {
    text: "Admins",
    path: "/admin/admins",
  },
  {
    text: "Ratings ",
    path: "/admin/ratings",
  },
  {
    text: "Messages ",
    path: "/admin/messages",
  },
  {
    text: "Feedback ",
    path: "/admin/feedback",
  },
  {
    text: "Verification",
    path: "/admin/verification",
  },
  {
    text: "Refund request",
    path: "/admin/refund",
  },
];
