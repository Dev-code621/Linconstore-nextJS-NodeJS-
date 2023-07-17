import {Button, Card, CircularProgress, Stack, Tab, Tabs} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { increment } from "../../Store/Stepper";
import React, {useState} from "react";
import { useHandleSellerSub } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import TabPanel from "./tabpanel";
import { useTranslation } from "react-i18next";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import StoreInfo from "../Seller/StoreInfo";

interface Icard {
  type: string;
}
export const packages = [
  {
    packageName: "Basic",
    id: 1,
    limit: 4,
    plan: "BasicMonthly",
  },
  {
    packageName: "Essential",
    id: 2,
    limit: 10,
    plan: "EssentialMonthly",
  },
  {
    packageName: "Essential",
    id: 3,
    limit: 10,
    plan: "EssentialYearly",
  },
  {
    packageName: "Basic",
    id: 4,
    limit: 4,
    plan: "BasicYearly",
  },
  {
    packageName: "Premium",
    id: 5,
    limit: 20,
    plan: "PremiumMonthly",
  },
  {
    packageName: "Premium",
    id: 6,
    limit: 20,
    plan: "PremiumYearly",
  },
];
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const PackageCard: React.JSXElementConstructor<Icard> = ({ type }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [plan, setPlan] = useState<string>('')
  const handlePayment = (name: string) => {
    let plan : string;
    plan = name === 'free' ? 'free' : 'premium'
    const data = {
      plan
    }
    subscribe(data);
    setPlan(plan)
  };
  const onSuccess = (data: any) => {
    if (plan === 'free') {
      return
    }
    router.push(data.url);
  };
  const router = useRouter();
  const { isLoading, mutate: subscribe, isSuccess } = useHandleSellerSub(onSuccess);


  return (
    <>
      {!isSuccess &&
      <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              maxHeight: { xs: "auto", sm: 350 },
              overflowX: "auto",
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Card
              className={"package"}
              sx={{
                height: { xs: "360px", sm: "340px" },
                borderRadius: "2px solid #54991D",
                color: "#54991D",
                p: 2,
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
                  <b>{t("seller.setup.month.basic.title")}</b>
                </Typography>
                <Stack direction={"column"} spacing={3} mt={3}>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.basic.content")}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.basic.ads")}
                  </Typography>
                    <Typography variant={"body1"} component={"h6"}>
                        {t("seller.setup.month.basic.extra")}
                    </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.basic.price")}
                  </Typography>
                  <Button
                      disabled={isLoading}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handlePayment("free")}
                  >
                    {isLoading &&  plan === 'free' && <CircularProgress/>}
                    Get Started
                  </Button>
                </Stack>
              </Box>
            </Card>
            <Card
              className={"package"}
              sx={{
                height: { xs: "350px", sm: "340px" },
                p: 2,
                borderRadius: "2px solid #54991D",
                color: "#54991D",
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
                  <b>{t("seller.setup.month.premium.title")}</b>
                </Typography>
                <Stack direction={"column"} spacing={3} mt={3}>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.premium.content")}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.premium.ads")}
                  </Typography>
                  <Typography variant={"body1"} component={"h6"}>
                    {t("seller.setup.month.premium.price")}
                  </Typography>
                    <Typography variant={"body1"} component={"h6"}>
                        {t("seller.setup.month.premium.extra")}
                    </Typography>
                  <Typography variant={"body1"} component={"h6"}>

                  </Typography>
                  <Button
                      disabled={isLoading}
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{mt:3}}
                    onClick={() => handlePayment("PremiumMonthly")}
                  >
                    {isLoading && plan === 'premium' && <CircularProgress/>}

                    Get Started
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Box>
      </Box>

      }

      {isSuccess && plan === 'free' && <StoreInfo/>}
    </>
  );
};
export default PackageCard;
