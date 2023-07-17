import Head from "next/head";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ShopCard from "../Utils/ShopCard";
import Grid from "@mui/material/Grid";
import ShopOverviewCard from "../Utils/ShopOverviewCard";
import SellerStoreTable from "../Utils/SellerStoreTable";
import SellersReputation from "../Utils/SellersReputation";
import { ArrowBack, StarOutline } from "@mui/icons-material";
import { numberWithCommas } from "../../Helpers/utils";
import { useRouter } from "next/router";
import {
  useGetSellerOrderStats,
  useGetSellerRecentOrder,
  useGetSellerStats,
  useGetSellerTopProducts,
  useGetStore,
} from "../../hooks/useDataFetch";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";

type Stats = {
  value: number;
  title: string;
};
interface Idata {
  totalVisitors: number;
  totalProducts: number;
  totalSales: number;
  totalExpenses: number;
  totalOrders: number;
}

interface IMonthlyStats {
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
}
interface Iutil {
  util: {
    sellerRate: number;
  };
}
const Shop: React.FC = () => {
  const isMatches: boolean = useMediaQuery("(max-width: 370px)");
  const isMatched: boolean = useMediaQuery("(max-width: 470px)");

  const [stats, setStats] = useState<Stats[]>([]);
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );
  const [rate, setRate] = useState<number>(rateDispatch ? rateDispatch : 1);

  useEffect(() => {
    const initialRate: string = localStorage.getItem("sellerRate");
    if (!rateDispatch) {
      setRate(parseInt(initialRate));
    }
  }, [rateDispatch]);
  const onSuccess = (data: Idata) => {
    const { totalSales: initialSales } = data;
    const totalSales = Number((initialSales / rate).toFixed(2));
    const shopStat: Stats[] = [
      {
        value: data.totalVisitors,
        title: "Store Likes",
      },
      {
        value: numberWithCommas(totalSales) as unknown as number,
        title: "Gross Sales",
      },
      {
        value: data.totalOrders,
        title: "Pending Orders",
      },
      {
        value: data.totalProducts,
        title: "Total Products",
      },
    ];
    setStats(shopStat);
  };
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const {
    data: sellerStats,
    isLoading: statsIsLoading,
    isFetched: statsIsFetched,
      refetch: statRefetch
  } = useGetSellerStats(onSuccess);
  useTokenRefetch(statRefetch)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const onSellerRecentOrderSuccess = (data : any) => {
    setRecentOrders(data)
  }
  const {
    isLoading: ordersIsLoading,
    isFetched: ordersIsFetched,
      refetch: recentRefetch
  } = useGetSellerRecentOrder(onSellerRecentOrderSuccess);
  useTokenRefetch(recentRefetch)
  const {
    data: topProducts,
    isLoading: topIsLoading,
    isFetched,
      refetch: sellerProductRefetch
  } = useGetSellerTopProducts();
  useTokenRefetch(sellerProductRefetch)
  const [orderStats, setOrderStats] = useState<number[]>([]);
  const onStatSuccess = (data: IMonthlyStats) => {
    if (orderStats.length > 0) return
    const newData: number[] = [];
    newData.push(
      data.day1 * rate,
      data.day2 * rate,
      data.day3 * rate,
      data.day4 * rate,
      data.day5 * rate,
      data.day6 * rate,
      data.day7 * rate
    );
    setOrderStats((prevState) => [...prevState, ...newData]);
  };
  const onStoreSuccess = () => {};

  const { data, isFetched: isFetchedStore, refetch: refetchStore } = useGetStore(onStoreSuccess);
  useTokenRefetch(refetchStore)
  const { isLoading: isStating , refetch} = useGetSellerOrderStats(onStatSuccess);
  useTokenRefetch(refetch)
  return (
    <>
      <Head>
        <title>Store Statistics | Seller's Dashboard Linconstore</title>
        <meta
          name={"Store Statistics"}
          content={"These are the stats of your shop"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Container component="main" maxWidth={"lg"}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
          <Typography textAlign={"center"} variant="h6">
            {t("seller.store_stats.title")}
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 3,
            marginBottom: 3,
            display: "flex",
            p: 2,
            flexDirection: "column",
            // alignItems: 'center',
            justifyContents: "center",
          }}
        >
          <Stack sx={{ alignItems: "center" }}>
            {orderStats.length > 0 && <ShopCard chart={orderStats} />}
          </Stack>
          <Stack mt={1}>
            {stats.length > 0 && (
              <>
                <Typography variant={"h6"}>
                  {t("seller.store_stats.overview_title")}
                </Typography>
                <Grid container spacing={isMatches ? 1 : 4}>
                  {stats.map((item, index) => (
                    <Grid
                      key={index}
                      item
                      xs={isMatched ? 12 : 6}
                      md={4}
                      lg={3}
                    >
                      <ShopOverviewCard
                        title={item.title}
                        value={item.value}
                        index={index}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Stack>
          {isFetched && topProducts?.length === 0 && (
            <Typography variant={"body1"} textAlign={"center"}>
              {t("seller.store_stats.no_products")}
            </Typography>
          )}
          {topIsLoading && <CircularProgress />}
          {/* {isFetched && topProducts?.length > 0 && (
            <SellerStoreTable
              products={topProducts}
              title={t("seller.store_stats.top_product")}
            />
          )} */}
          {/*<Stack my={1}>*/}
          {/*  <Typography gutterBottom variant={"h6"}>*/}
          {/*    {t("seller.store_stats.reputation_title")}*/}
          {/*  </Typography>*/}

            {/*<Paper elevation={4} sx={{ p: 1 }}>*/}
            {/*  <Stack direction={"row"} spacing={1}>*/}
            {/*    <StarOutline />*/}
            {/*    {isFetchedStore && data?.reputation && (*/}
            {/*      <SellersReputation value={data?.reputation} />*/}
            {/*    )}*/}
            {/*  </Stack>*/}
            {/*</Paper>*/}
          {/*</Stack>*/}
          {/*<Stack>*/}
          {/*    <Typography variant={'h6'} my={1}>*/}
          {/*        Top Buyers*/}
          {/*    </Typography>*/}
          {/*    <Stack direction="row" spacing={2}>*/}
          {/*        {!isMobile && <>*/}
          {/*            <Avatar sx={{width: 76, height: 76}}*/}
          {/*                    alt="Remy Sharp" src="https://mui.com/static/images/avatar/7.jpg"/>*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*            alt="Travis Howard" src="https://mui.com/static/images/avatar/1.jpg" />*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*            alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg" />*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*            alt="Cindy Baker" src="https://mui.com/static/images/avatar/3.jpg" />*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*            alt="Cindy Baker" src="https://mui.com/static/images/avatar/5.jpg" />*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*            alt="Cindy Baker" src="https://mui.com/static/images/avatar/6.jpg" />*/}
          {/*            <Avatar   sx={{width: 76, height: 76}}*/}
          {/*                      alt="Cindy Baker" src="https://mui.com/static/images/avatar/4.jpg" />*/}
          {/*        </>*/}
          {/*        }*/}
          {/*        {isMobile && <AvatarGroup total={7} spacing={0}>*/}
          {/*            <Avatar sx={{width: 76, height: 76}}*/}
          {/*                    alt="Remy Sharp" src="https://mui.com/static/images/avatar/7.jpg"/>*/}
          {/*            <Avatar sx={{width: 76, height: 76}}*/}
          {/*                    alt="Travis Howard" src="https://mui.com/static/images/avatar/1.jpg"/>*/}
          {/*            <Avatar sx={{width: 76, height: 76}}*/}
          {/*                    alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg"/>*/}
          {/*        </AvatarGroup>*/}
          {/*        }*/}
          {/*    </Stack>*/}
          {/*</Stack>*/}
          {ordersIsLoading && <CircularProgress />}
          {ordersIsFetched && recentOrders?.length === 0 && (
            <Typography variant={"body1"} textAlign={"center"}>
              {t("seller.store_stats.no_orders")}
            </Typography>
          )}
          {ordersIsFetched && recentOrders?.length > 0 && (
            <SellerStoreTable products={recentOrders} title={"Recent Orders"} />
          )}
        </Box>
      </Container>
    </>
  );
};
export default Shop;
