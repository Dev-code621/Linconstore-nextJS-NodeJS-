import React, { useEffect, useState } from "react";
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
import {IOrders, TProducts} from "../../Helpers/Types";
import { useGetUserOrders } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";

interface Idata {
  productId: TProducts;
  shippingProvider: string;
  trackingId: string;
}
type TOrders = {
  user: string,
  order: IOrders[]
}
const PlacedOrders: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Idata[]>([]);
  const onSuccess = (data: TOrders) => {
    setProducts(data.order);
  };
  const { isFetched, refetch } = useGetUserOrders(onSuccess, "placed");

  useTokenRefetch(refetch)
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px", minHeight: "100vh" }}>
        <Wrapper
          title={"Placed Orders"}
          description={"You can find your placed Orders here "}
          content={""}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
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
                  {t("account.place_order.title")}
                </Typography>
              </Stack>
            </Stack>

            <Container component={"article"} maxWidth={"md"}>
              {isFetched && products.length === 0 && (
                <Typography variant={"body1"} textAlign={"center"} mt={2}>
                  {t("account.place_order.content")}
                </Typography>
              )}
              {products.length > 0 && (
                  // <Box sx={{
                  //     display: 'flex',
                  //     flexDirection: 'column',
                  //     p: isMobile ? 0 : 2,
                  //     justifyContent: 'center',
                  //     maxWidth: '400px',
                  //     border: isMobile ? '0px' : '2px solid black'
                  // }}>
                  <Grid container direction={"column"}>
                    {products.length > 0 &&
                      products.map(
                        (
                          { productId, shippingProvider, trackingId },
                          index
                        ) => {
                          if (productId?.title) {
                            return (
                              <Grid key={index} item xs={6} sm={4} lg={2}>
                                <UserOrders
                                  status={""}
                                  shippingProvider={shippingProvider}
                                  refund={false}
                                  user={''}
                                  trackingId={trackingId}
                                  product={productId}
                                  processed={false}
                                  rating={false}
                                />
                              </Grid>
                            );
                          }
                        }
                      )}
                  </Grid>
                )
                // </Box>
              }
            </Container>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default PlacedOrders;
