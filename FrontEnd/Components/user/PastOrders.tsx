import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import UserOrders from "../Utils/UserOrders";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import {useGetUserOrders, useGetUserOrdersShipped} from "../../hooks/useDataFetch";
import { IOrders } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import {useSelector} from "react-redux";


let isFirst = false;


type TOrders = {
  user: string,
  order: IOrders[]
}
const PastOrders: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const [products, setProducts] = useState<IOrders[]>([]);
  const [user, setUser] = useState<string>('')

  const onSuccess = (data: TOrders) => {
    setProducts(data.order);
    setUser(data.user)
  };
  const {  isFetched , refetch} = useGetUserOrdersShipped(onSuccess);
  interface modal {
    modal : {
      addRatingModal : boolean
    }
  }

  const isUpdating : boolean = useSelector((state: modal) => state.modal.addRatingModal);

  useTokenRefetch(refetch)
  useEffect(() => {
    setTimeout(() => {
      isFirst = true;
    },300)
  },[])
  useEffect(() => {
     if (isFirst) {
       refetch()
     }
  }, [isUpdating])
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"PastOrders"}
          description={"You can find your past Orders here "}
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
                  {t("account.past_order.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"article"} maxWidth={"md"}>
              {isFetched && products.length === 0 && (
                <Typography variant={"body1"} textAlign={"center"} mt={2}>
                  {t("account.past_order.content")}
                </Typography>
              )}
              {
                isFetched && products.length > 0 && (
                  // <Box sx={{
                  //     display: 'flex',
                  //     flexDirection: 'column',
                  //     p: isMobile ? 0.2 : 2,
                  //     justifyContent: 'center',
                  //     maxWidth: '500px',
                  //     border: isMobile ? '0px' : '2px solid black'
                  // }}>
                  <Grid container direction={"column"}>
                    {products.map((product, index) => {
                      if (product.productId?.title) {
                        return (
                          <Grid key={index} item xs={6} sm={4} lg={2}>
                            <UserOrders
                              status={""}
                              product={product.productId}
                              shippingProvider={product.shippingProvider}
                              processed={true}
                              refund={product.refund}
                              rating={true}
                              user={user}
                              trackingId={product.trackingId}
                            />
                          </Grid>
                        );
                      }
                    })}
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
export default PastOrders;
