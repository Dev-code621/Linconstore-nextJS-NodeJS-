import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import UserOrders from "../Utils/UserOrders";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import { TProducts } from "../../Helpers/Types";
import { useCancelledOrder } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";

interface IOrders {
  refund: boolean,
  shippingProvider: string;
  trackingId: string;
  status: string;
  productId: TProducts;
}
const OrderProcessed: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 800px)");
  const [products, setProducts] = useState<IOrders[]>([]);
  const onSuccess = (data: IOrders[]) => {
    setProducts(data);
  };
  const { data, isLoading, isFetched } = useCancelledOrder(onSuccess);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={" Orders Processed"}
          description={"You can find your Processed Orders here "}
          content={""}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: isMobile ? 1 : 2,
            }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontSize={isMobile && "1rem"}
                  textAlign={"center"}
                >
                  {t("account.order_process.title")}
                </Typography>
              </Stack>
            </Stack>

            <Container
              component={"article"}
              maxWidth={"md"}
              sx={{ m: isMobile ? "0 !important" : "4" }}
            >
              {isFetched && products.length === 0 && (
                <Typography variant={"body1"} textAlign={"center"} mt={2}>
                  {t("account.order_process.content")}
                </Typography>
              )}
              {isFetched && products.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: isMobile ? 0 : 2,
                    justifyContent: "center",
                    maxWidth: "600px",
                    marginTop: "16px",
                    margin: "auto",
                    // border: isMatches ? '0px' : '2px solid black'
                  }}
                >
                  <Grid container direction={"column"}>
                    {products.map((data, index) => {
                      if (data.productId?.title) {
                        return (
                          <Grid key={index} item xs={4} sm={4} lg={2}>
                            <UserOrders
                              product={data.productId}
                              processed={true}
                              refund={false}
                              user={''}
                              rating={false}
                              status={data.status}
                              shippingProvider={data.shippingProvider}
                              trackingId={data.trackingId}
                            />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Box>
              )}
            </Container>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default OrderProcessed;
