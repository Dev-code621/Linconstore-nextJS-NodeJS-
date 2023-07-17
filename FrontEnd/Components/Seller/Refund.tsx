import Head from "next/head";
import React, { useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useGetSellerRefunds } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";

type TProduct = {
  title: string;
};
interface IRefund {
  reason: string;
  productId: TProduct;
}
const Refund: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [refunds, setRefund] = useState<IRefund[]>([]);
  const onSuccess = (data: IRefund[]) => {
    setRefund(data);
  };
  const { isLoading, isFetched, refetch} = useGetSellerRefunds(onSuccess);
  useTokenRefetch(refetch)
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Refund Request | seller dashboard linconstore</title>
        <meta name={"Refund Request"} content={"These are Refund Request"} />
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
          <Typography variant={"h6"}>
            {t("seller.refund.title")}
            {/* {isLoading && <CircularProgress />} */}
          </Typography>
        </Box>
        {refunds.length === 0 && (
          <Typography variant={"body1"}>{t("seller.refund.no_msg")}</Typography>
        )}
        {refunds.length > 0 && (
          <Box sx={{ border: "2px solid black" }}>
            {refunds.map(({ reason, productId }, index) => (
              <Grid
                key={index}
                container
                sx={{ border: "2px solid black", p: 1 }}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant={"h6"} textAlign={"center"}>
                    {productId?.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant={"h6"} textAlign={"center"}>
                    {reason} : {t("seller.refund.reply")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant={"outlined"}
                    fullWidth
                    className={"colorReversed"}
                    color={"inherit"}
                  >
                    {t("seller.refund.issue")}
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Card>
    </>
  );
};
export default Refund;
