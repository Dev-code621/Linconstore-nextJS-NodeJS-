import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, {useCallback, useContext, useEffect, useState} from "react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
  useGetDeleteSellerSub,
  useGetSellerInfo,
  useGetSellerPortalSession,
  useHandleSellerSub,
  useSellerSub,
} from "../../hooks/useDataFetch";
import { packages } from "../Utils/PackageCard";
import { reCreateDate } from "../../Helpers/getDate";
import ContextApi from "../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";
import {useRefresh, useTokenRefetch} from "../../hooks/useRefresh";

interface IBusinessPlan {
  name: string;
  commission: string,
  extra: string,
  boxes: string;
  key: string;
  ads: string;
  month: string;
  year: string;
}
interface IData {
  endDate: Date | string;
}
interface ISession {
  url: string;
}
const BusinessPlan = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const [initialPlan, setInitialPlan] = useState<string>('')

  const [currentPlan, setCurrentPlan] = useState<IBusinessPlan>();
  const [otherPlan, setOtherPlan] = useState<IBusinessPlan[]>([]);
  const onSuccess = (data: any) => {
    const current = plans.find((value) => value.key === data.package);
    const other = plans.filter((value) => value.key !== data.package);
    setCurrentPlan(current);
    setOtherPlan(other);
    setInitialPlan(data.package)
  };
  const [endDate, setDate] = useState<Date | string>();
  const onSubSuccess = (data: IData) => {
    const newEndDate = data?.endDate;
    // @ts-ignore
    const newDate = reCreateDate((newEndDate * 1000) as unknown as string);
    setDate(newDate);
  };
  const {refetch: subRefetch, isFetched} = useSellerSub(onSubSuccess);
  useTokenRefetch(subRefetch);
  const [sellerPlan, setSellerPlan] = useState<string>('');
  const handleSubscription = (name: string) => {
    setSellerPlan(name)
   const selectedPlan : string = name === 'free' ? 'free' : 'Premium'
    const plan = {
      plan: selectedPlan,
      type: "renew",
    };
    renew(plan);
  };
  const handleSellerRenew = (data: any) => {
    if (data.type === 'free') {
      return refetch()
    }
    router.push(data?.url);
  };
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const { data, isLoading, refetch } = useGetSellerInfo(onSuccess);
  useTokenRefetch(refetch)
  const { isLoading: sellerIsLoading, mutate: renew } =
    useHandleSellerSub(handleSellerRenew);
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    router.push("/login");
  };
  const onCancelSuccess = () => {
    refetch()
  };
  const handleBilling = useCallback(() => {
    const data = {};
    fetchSellerSession(data);
  }, []);
  const onSellerSessionSuccess = (data: ISession) => {
    window.open(data.url, "_blank");
  };
  const { mutate: fetchSellerSession, isLoading: isFetching } =
    useGetSellerPortalSession(onSellerSessionSuccess);
  const { mutate: deleteSub, isLoading: isDeleting } =
    useGetDeleteSellerSub(onCancelSuccess);
  const handleDeleteSub = useCallback(() => {
    deleteSub();
  }, []);
  const plans: IBusinessPlan[] = [
    {
      name: t("seller.business_plan.plans.basic.name"),
      boxes: t("seller.business_plan.plans.basic.boxes"),
      ads: t("seller.business_plan.plans.basic.ads"),
      commission: t("seller.business_plan.plans.basic.commission"),
      extra: t("seller.business_plan.plans.basic.extra"),
      month: t("seller.business_plan.plans.basic.month"),
      year: "",
      key: "free",

    },
    {
      name: t("seller.business_plan.plans.premium.name"),
      boxes: t("seller.business_plan.plans.premium.boxes"),
      ads: t("seller.business_plan.plans.premium.ads"),
      month: t("seller.business_plan.plans.premium.month"),
      year: t("seller.business_plan.plans.premium.year"),
      extra: t("seller.business_plan.plans.premium.extra"),
      commission: t("seller.business_plan.plans.premium.commission"),
      key: "Premium",
    },
  ];
  return (
    <>
      <Head>
        <title>Business plans | seller dashboard linconstore</title>
        <meta name={"Business Plan"} content={"These are Business Plan"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
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
          <Typography variant={"h6"} component={"h6"}>
            {t("seller.business_plan.business_plan")}
          </Typography>
        </Box>
        {isLoading && <CircularProgress />}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {initialPlan !== 'free'  && isFetched && <Box sx={{ display: "flex" }}>
            <Typography variant={"h6"} component={"h6"}>
              {t("seller.business_plan.current_plan")}
            </Typography>

            <Typography
              sx={{ mt: 1, mx: 1 }}
              variant={"caption"}
              component={"p"}
            >
              {t("seller.business_plan.renews") + " " + endDate}
            </Typography>
          </Box>
          }
          {/*<Stack sx={{my:2}} direction={'row'}>*/}
          {/*    <Box flexGrow={1} />*/}
          {/*    <Button variant={'outlined'} color={'error'} disabled={isDeleting} onClick={handleDeleteSub}> {isDeleting && <CircularProgress/>} Cancel Subscription </Button>*/}
          {/*</Stack>*/}
          {currentPlan && (
            <Card
              className={"package"}
              sx={{
                maxWidth: "300px",
                height: { xs: "300px", sm: "auto" },
                borderRadius: "2px solid #54991D",
                color: "#54991D",
                p: 2,
                mb:2
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant={"h5"} component={"h6"}>
                  <b>{currentPlan?.name}</b>
                </Typography>
                <Stack direction={"column"} spacing={3} mt={3}>
                  <Typography variant={"body1"} component={"h6"}>
                    {currentPlan?.boxes}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {currentPlan?.ads}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {currentPlan.extra}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {currentPlan.commission}
                  <Typography variant={"body1"} component={"h6"}>
                    {currentPlan?.month}
                  </Typography>
                  </Typography>

                  {initialPlan === 'Premium' && <Button variant={'outlined'} color={'error'} disabled={isDeleting} onClick={handleDeleteSub} > {isDeleting && <CircularProgress/>} Downgrade</Button>}
                </Stack>
              </Box>
            </Card>
          )}
          {initialPlan !== 'free' && isFetched && <Typography variant={"h6"} sx={{ my: 1 }} component={"h6"}>
            {t("seller.business_plan.change_plan")}{" "}
            {sellerIsLoading || (isFetching && <CircularProgress />)}
            <Button variant={"outlined"} onClick={handleBilling}>
              {t("seller.business_plan.btn_manage")}
            </Button>
          </Typography>
          }
          <Grid container spacing={2}>
            {otherPlan.length > 0 &&
              otherPlan.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    className={"plan"}
                    sx={{
                      height: { xs: "auto" },
                      borderRadius: "2px solid #54991D",
                      color: "#54991D",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant={"h5"} component={"h6"}>
                        <b>{plan.name}</b>
                      </Typography>
                      <Stack direction={"column"} spacing={3} mt={3}>
                        <Typography variant={"body1"} component={"h6"}>
                          {plan.boxes}
                        </Typography>
                        <Typography variant={"body1"} component={"h6"}>
                          {plan.ads}
                        </Typography>
                        <Typography variant={"body1"} component={"h6"}>
                          {plan.extra}
                        </Typography>
                        <Typography variant={"body1"} component={"h6"}>
                          {plan.commission}
                        <Typography variant={"body1"} component={"h6"}>
                          {plan.month}
                        </Typography>

                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={sellerIsLoading}
                          size="small"
                          onClick={() => handleSubscription(plan.key)}
                        >
                          {t("seller.business_plan.btn_select")}
                          {sellerIsLoading && <CircularProgress/>}
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Card>
    </>
  );
};
export default BusinessPlan;
