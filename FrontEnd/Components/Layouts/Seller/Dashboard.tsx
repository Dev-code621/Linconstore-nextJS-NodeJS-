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
import {CircularProgress, useMediaQuery} from "@mui/material";
import { useContext, useEffect } from "react";
import ContextApi from "../../../Store/context/ContextApi";
import {useGetSellerInfo, useGetStore} from "../../../hooks/useDataFetch";
import { handleRateChange } from "../../../Helpers/Exchange";
import { useDispatch } from "react-redux";
import { saveSellerRate } from "../../../Store/Utils";
import { saveCurrency } from "../../../Store/Currency";
import { useTranslation } from "react-i18next";

const drawerWidth: number = 240;

interface IStore {
  currency: string;
}
type TSeller = {
  isActive: boolean;
  _id:string
};

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
export const currencies: { value: string; label: string }[] = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "Pounds",
    label: "£",
  },
];
function DashboardContent({ children }: any) {
  const { t } = useTranslation();

  const menuItems = [
    {
      text: t("seller.menuItem.home"),
      path: "/seller",
    },
    {
      text: t("seller.menuItem.orders_placed"),
      path: "/seller/orderplaced",
    },
    {
      text: t("seller.menuItem.orders_processed"),
      path: "/seller/orderprocessed",
    },
    {
      text: t("seller.menuItem.orders_shipped"),
      path: "/seller/ordershipped",
    },
    {
      text: t("seller.menuItem.store_statistics"),
      path: "/seller/stats",
    },
    {
      text: t("seller.menuItem.manage_ads"),
      path: "/seller/ads",
    },
    {
      text: t("seller.menuItem.business_plan"),
      path: "/seller/business",
    },
    {
      text: t("seller.menuItem.modify_Store"),
      path: "/seller/modify",
    },
    {
      text: t("seller.menuItem.add_product"),
      path: "/seller/post",
    },
    {
      text: t("seller.menuItem.store_expense"),
      path: "/seller/expenses",
    },
    {
      text: t("seller.menuItem.messages"),
      path: "/seller/messages",
    },
    {
      text: t("seller.menuItem.refund_request"),
      path: "/seller/refund",
    },
  ];
  const dispatch = useDispatch();
  const onSuccess = async (data: IStore) => {
    const currency = currencies.find((x) => x.value === data.currency);
    dispatch(saveCurrency({ currency: currency.label }));
    const response: number = await handleRateChange(data.currency);
    dispatch(saveSellerRate({ sellerRate: response }));
    localStorage.setItem("sellerRate", String(response));
  };
  const { data, refetch } = useGetStore(onSuccess);
  const handleSellerActive = useContext(ContextApi).handleSellerActive;
  const onSellerInfoSuccess = (data : TSeller) => {
    handleSellerActive(data.isActive)
  }
  const {refetch: refetchSellerInfo, isError, error} =  useGetSellerInfo(onSellerInfoSuccess)

  useEffect(() => {
    const clearMe = setTimeout(() => {
      refetch();
      refetchSellerInfo()
    }, 2000);

    return () => clearTimeout(clearMe);
  }, []);
  useEffect(() => {
      if (isError) {
        if (error.response){
          const statusCode = error.response.status;
        if (statusCode === 401){
          router.push('/')
        }
        }
      }
  },[isError])
  const router = useRouter();
  const isMatches = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width : 600px)");
  const verifySeller = useContext(ContextApi).isUserLoggedIn;

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
        <GenNav admin={false} mode={true} />
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
              backgroundColor: "#f3f2f2 !important",
            }}
          >
            <Container
              maxWidth="xl"
              sx={{ mb: 7, backgroundColor: "#f3f2f2" }}
            >
              {router.pathname == "/seller/modify" && (
                data ? <>
                      <StoreHeader
                          title={data?.name}
                          logo={data?.logo}
                          summary={data?.summary}
                          location={data?.location}
                          createdAt={data?.createdAt}
                      />
                    </>
                     :
                    <CircularProgress/>

              )}
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
      {/* <Head>
        <title>Orders | Seller's Dashboard Linconstore</title>
        <meta name="Welcome to my store" content="Jack Store" />
      </Head> */}
      <DashboardContent> {children} </DashboardContent>
    </>
  );
}
