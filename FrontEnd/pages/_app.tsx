import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import Store from "../Store/Index";
import MobileBottomNavigation from "../Components/Layouts/BottomNav";
import { useMediaQuery } from "@mui/material";
import MainModal from "../Components/Utils/Modal";
import EditModal from "../Components/Utils/EditModal";
import Notify from "../Components/Utils/SnackBar";
import RequestModal from "../Components/Utils/Admin/RequestModal";
import AddAdminModal from "../Components/Utils/Admin/AddAdminModal";
import RatingModal from "../Components/Utils/User/RatingModal";
import DeleteModal from "../Components/Utils/Admin/DeleteModal";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import React from "react";
import Router from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import ContextProvider from "../Store/context/ContextProvider";
import TermModal from "../Components/Utils/Seller/TermModal";
// import DeleteSeller from "../Components/Utils/Admin/DeleteSeller";fz
import PayoutModal from "../Components/Utils/Admin/PayoutModal";
import { Analytics } from "@vercel/analytics/react";
import "../config/i18n";
import ContextApi from "../Store/context/ContextApi";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import SEO from "../next-seo.config";
import { DefaultSeo } from "next-seo";
import {useAutoLogout} from "../hooks/useAutoLogout";
import SellerPayoutModal from "../Components/Utils/Seller/SellerPayoutModal";

function MyApp({ Component, pageProps }: AppProps) {
  const customTheme = createTheme({
    typography: {
      fontFamily: "Quicksand",
      fontWeightBold: 700,
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
    },
    components: {
      MuiCircularProgress: {
        defaultProps: {
          size: "1.2rem"
        },
      },
    }
  });
  const client = new QueryClient();
  const isMobile = useMediaQuery("(max-width: 600px)");
  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    //add the event handler on mount
    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);
    return () => {
      // remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);
    useAutoLogout()
  // let nIntervalId;
  // const { i18n, t } = useTranslation();
  // const router = useRouter();

  // const onFocusFunction = () => {
  //   console.log("focused");
  //   clearInterval(nIntervalId);
  //   nIntervalId = null;
  // };

  // const onBlurFunction = () => {
  //   console.log("blured");
  //   if (!nIntervalId && localStorage.getItem("token")) {
  //     nIntervalId = setInterval(handleLogout, 1000*60*30);
  //   }
  // };

  // const handleLogouts = React.useContext(ContextApi).handleLogout;
  // const handleLogout = () => {
  //   handleLogouts();
  //   localStorage.setItem("currentLanguage", i18n.language);
  //   router.push("/login");
  // };
  // React.useEffect(() => {
  //   onFocusFunction();

  //   window.addEventListener("focus", onFocusFunction);
  //   window.addEventListener("blur", onBlurFunction);

  //   return () => {
  //     onBlurFunction();

  //     window.removeEventListener("focus", onFocusFunction);
  //     window.removeEventListener("blur", onBlurFunction);
  //   };
  // }, []);

  return (
    <Provider store={Store}>
      <ContextProvider>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={customTheme}>
            <DefaultSeo {...SEO} />
            <MainModal />
            <Notify />
            <EditModal />
            <DeleteModal />
            <PayoutModal />
            {/*<DeleteSeller/>*/}
            <RequestModal />
            <Analytics />
            <AddAdminModal />
            <TermModal />
            <RatingModal />
            <SellerPayoutModal/>
            <Component {...pageProps} />
            {isMobile && <MobileBottomNavigation />}
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </ContextProvider>
    </Provider>
  );
}

export default MyApp;
