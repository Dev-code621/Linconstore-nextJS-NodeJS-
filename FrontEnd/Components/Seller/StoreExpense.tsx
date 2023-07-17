import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  ArrowBack,
  CreditCard,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import { numberWithCommas } from "../../Helpers/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import ExpenseCard from "../Utils/ExpenseCard";
import SellersActivity from "../Utils/SellersActivity";
import CardManagement from "./CardManagement";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../Store/Stepper";
import Transfer from "./Transfer";
import Billing from "./Billing";
import Button from "@mui/material/Button";
import {
  useGetSellerDeliveredOrders,
  useGetSellerInfo,
  useGetSellerLink, useGetSellerRequestMessage,
  useGetStore,
  useGetStoreActivity,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import {useRefresh, useTokenRefetch} from "../../hooks/useRefresh";
import {ISellerRequestMes} from "../../Helpers/Types";
import {openSellerPayoutModal} from "../../Store/Modal";

type TSeller = {
  isActive: boolean;
  _id:string
};
type TProduct = {
  photo: string[];
  title: string;
};
type IStore = {
  bill: number;
  type: string;
  name: string,
  createdAt: Date;
  productId: TProduct;
};
interface IActivity {
  totalBill: number;
  activity: IStore[];
}
export interface Idata {
  icon: any;
  title: string;
}
type TStore = {
  currency: string;
};
type TLink = {
  url: string;
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type stepper = {
  stepper: {
    step: number;
  };
};
const StoreExpense: React.FC = () => {
  const stepper = useSelector((state: stepper) => state.stepper.step);
  const { t } = useTranslation();
  const data: Idata[] = [
    {
      icon: <FontAwesomeIcon fontSize={"large"} icon={faMoneyBillTransfer} />,
      title: "Transfer",
    },
  ];
  const [seller, setSeller] = useState<TSeller>();
  const onSuccess = (data: TSeller) => {
    setSeller(data);
  };


  useEffect(() => {
    if (!seller?.isActive){
      refreshRequest()
    }
  },[seller])

  const [message, setMessage] = useState<string>('')
  const onSellerRequestSuccess = (data: ISellerRequestMes) => {
    setMessage(data.message)
  }
  const {isSuccess, refetch: refreshRequest} = useGetSellerRequestMessage(onSellerRequestSuccess)
  const { isLoading, isFetched, refetch: refresh } = useGetSellerInfo(onSuccess);
  useTokenRefetch(refresh)
  // const [currency, setCurrency] = useState<string>('');
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
    const [isShow, setIsShow] = useState<boolean>(false)
  const onStoreSuccess = (data: TStore) => {
    // setCurrency(data.currency)
  };
  const dispatch = useDispatch();
  const router = useRouter();
  useGetStore(onStoreSuccess);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [activities, setActivities] = useState<IStore[]>([]);
  const onActivitySuccess = (data: IActivity) => {
    setTotalBill(data.totalBill);
    setActivities(data.activity);
  };
  const { isLoading: isFetching, refetch: activityRefetch } = useGetStoreActivity(onActivitySuccess);

  useTokenRefetch(activityRefetch)
  const onSellerLinkSuccess = (data: TLink) => {
    window.open(data.url, "_blank");
  };


  const { refetch, isLoading: isGetting } =
    useGetSellerLink(onSellerLinkSuccess);
  const handleSellerLink = useCallback(() => {
    refetch();
  }, []);

  const onOrderDeliveredSuccess = (data: any) => {
      setIsShow(data.isShow)
  }

  const {refetch: refetchOrders} = useGetSellerDeliveredOrders(onOrderDeliveredSuccess);

  useTokenRefetch(refetchOrders)
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <Head>
        <title>Store Expenses | Seller's Dashboard Linconstore</title>
        <meta
          name={"Store Expenses"}
          content={"Here you can find details about the expenses of your store"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      {stepper === 1 && (
        // <CssBaseline/>
        <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
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
            <Typography variant="h6" component="div">
              {t("seller.store_expense.title")}
              {/* {isFetching && <CircularProgress />} */}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {isLoading && (
              <Typography textAlign={"center"}>
                <CircularProgress />
              </Typography>
            )}
            {isFetched && !seller?.isActive && isSuccess  &&(
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{
                  background: "#a6a3a3",
                  p: 1,
                  display: "flex",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  flexGrow={1}
                  gutterBottom
                  variant="body1"
                  component="div"
                >
                  {message}
                </Typography>
                <Button
                  variant={"contained"}
                  onClick={() => router.push("/seller/additional_verification")}
                  sx={{ minWidth: 180, maxHeight: 50 }}
                  color={"success"}
                >
                  {t("seller.store_expense.btn_upload")}
                </Button>
              </Stack>
            )}
            <Grid sx={{ my: 2 }} container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: "2px solid black", p: 1, width: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      // height: 600,
                      justifyContent: "center",
                    }}
                  >
                    <Typography gutterBottom variant={"body2"}>
                      {t("seller.store_expense.available_payout")}
                    </Typography>
                    <Typography variant={"h6"}>
                      {currency} {numberWithCommas(totalBill)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid md={3} />
              {/*<Grid md={4} sx={{ mx: 3, my: 3 }}>*/}
              {/*  <Button*/}
              {/*    variant={"outlined"}*/}
              {/*    disabled={isGetting}*/}
              {/*    color={"success"}*/}
              {/*    onClick={handleSellerLink}*/}
              {/*  >*/}
              {/*    {isGetting && <CircularProgress />} Go to stripe*/}
              {/*  </Button>*/}
              {/*</Grid>*/}

              {/*{ data.map((item, index) => {*/}
              {/*    return (*/}
              {/*        <Grid item xs={4} sm={2.5} key={index}>*/}
              {/*            <ExpenseCard  icon={item.icon} title={item.title} index={index}/>*/}
              {/*        </Grid>*/}
              {/*    )*/}
              {/*})}*/}
              {/*<Grid item xs={12} sm={4}>*/}
              {/*    <Card className={'pointer'} onClick={() => dispatch(increment(3))} elevation={3} sx={{border: '2px solid black', p: 1, width: 'auto'}}>*/}
              {/*        <Box*/}
              {/*            sx={{*/}
              {/*                display: 'flex',*/}
              {/*                flexDirection: 'column',*/}
              {/*                alignItems: 'center',*/}
              {/*                // height: 600,*/}

              {/*                justifyContent: 'center'*/}
              {/*            }}>*/}
              {/*            <Typography gutterBottom variant={'h6'}>*/}
              {/*                Billing*/}
              {/*            </Typography>*/}
              {/*        </Box>*/}
              {/*    </Card>*/}
              {/*</Grid>*/}
            </Grid>
          </Box>
          <Stack my={1}>
            {activities.length === 0 && (
              <Typography variant={"h6"} textAlign={"center"}>
                {t("seller.store_expense.no_activate")}
              </Typography>
            )}
            {activities.length > 0 &&  <Typography textAlign={"left"} variant={"h6"}>
             {t("seller.store_expense.activate_title")}
           </Typography>}
            {activities.length > 0 &&
              activities.slice().reverse().map((item, index) => {
                return (
                  <Box key={index}>
                    <SellersActivity
                      date={item.createdAt}
                      type={item.type}
                      title={item.productId ? item.productId.title : item.name}
                      image={item?.productId?.photo[0]}
                      amount={item.bill}
                    />
                  </Box>
                )
              })}
          </Stack>
        </Card>
      )}
      {stepper === 2 && <CardManagement />}
      {stepper === 3 && <Transfer />}
      {stepper === 4 && <Billing />}
      {isShow  && <Box sx={{position: 'fixed', bottom:0, minWidth: '100%', my:2, mb:8,  display: 'flex', px:2,py:2, flexDirection: 'row', justifyContent: 'space-evenly', bgcolor: '#25D366'}}>
        <Stack spacing={2} sx={{color: '#fff'}}>
            <Typography variant={'body2'}>Available Payout</Typography>
          <Typography variant={'body2'}> {currency} {numberWithCommas(totalBill)}</Typography>
        </Stack>
        <Button  onClick={() => dispatch(openSellerPayoutModal())} variant={'contained'} className={'buttonClass'} sx={{color: 'green', bgcolor: '#fff', borderRadius: '10px'}}> Add Payout Method  </Button>
      </Box>
      }
    </>
  );
};
export default StoreExpense;
