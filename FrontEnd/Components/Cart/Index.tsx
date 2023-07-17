import React, {useCallback, useContext, useEffect, useState} from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CartCards from "../Utils/CartCards";
import Typography from "@mui/material/Typography";
import { CircularProgress, Paper, Stack, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Nav from "../Layouts/Nav";
import { ArrowBack } from "@mui/icons-material";
import { useGetCart } from "../../hooks/useDataFetch";
import { TCart } from "../../Helpers/Types";
import ContextApi from "../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";
import { groupByKey } from "../Product/Index";


let isFirst = false
const Cart: React.FC = () => {
  const router = useRouter();
  const isMatches: boolean = useMediaQuery("(max-width: 402px)");
  const [cart, setCart] = useState<any>();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const { t } = useTranslation();

    const onHandleDelete = useCallback(
    (id: string) => {
      const placeHolder = cart;
      const newCart = placeHolder.products.filter((x) => x.productId !== id);
      setCart(newCart);
    },
    [cart]
  );

  const onSuccess = (data: TCart | string) => {
    if (data === "Empty cart") return setIsEmpty(true);
    setCart(data);
  };
  
  const { isLoading, isFetching, isFetched, refetch, isError, error } =
    useGetCart(onSuccess);
  const handleCartChange = useContext(ContextApi).handleCartChange;
  const isUpdating = useContext(ContextApi).isUpdating
  const handleRefetch = useCallback(() => {
    handleCartChange();
    refetch();
  }, [refetch]);
  useEffect(() => {
      const timeout = setTimeout(() => {
          isFirst = true
          refetch()
      },300)
      return () => clearTimeout(timeout)
  }, [])
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
    useEffect(() => {
        if (!isFirst) return
        refetch();
    },[isUpdating])
  return (
    <>
      <Head>
        <title>Your Cart</title>
        <meta name={"This are all the items in your carts"} content={"Carts"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Nav />
      <Container component="main" maxWidth={"xs"}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            marginBottom: 3,
            flexDirection: "column",
            // alignItems: 'center',
            // height: 600,
            justifyContent: "center",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={isMobile && "space-around"}
          >
            <Paper
              elevation={0}
              sx={{ display: { xs: "none", sm: "flex" }, width: "45%" }}
            >
              <ArrowBack className={"pointer"} onClick={() => router.back()} />
            </Paper>
            <Typography
              gutterBottom
              textAlign={"center"}
              variant="h5"
              component="div"
            >
              {t("cart.title")}
            </Typography>
          </Stack>
          {isEmpty && (
            <Typography
              gutterBottom
              textAlign={"center"}
              variant="body1"
              component="div"
            >
              {t("cart.empty_content")}
            </Typography>
          )}
          {isLoading && <CircularProgress />}
          {isFetched && cart?.products?.length === 0 && (
            <Typography variant={"body1"} textAlign={"center"}>
              {t("cart.cart_empty")}
            </Typography>
          )}
          {isFetched && cart?.products?.length > 0 && (
            <Box
              className={"empty-cart"}
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Paper elevation={0}>
                {cart?.products.map((product, index) => (
                  <CartCards
                    deleteHandler={onHandleDelete}
                    handleRefetch={handleRefetch}
                    key={index}
                    cart={product}
                  />
                ))}
              </Paper>
            </Box>
          )}
          {isFetched && cart?.products?.length > 0 && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                <Stack
                  sx={{
                    mb: 2,
                    mx: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant={"h6"}>
                    <b>{t("cart.total_price")}:</b>
                  </Typography>
                  <Typography variant={"h6"}>
                      {isFetching && <CircularProgress/>}
                      <b>   ${Number((cart?.bill).toFixed(2))} </b>
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mt: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => router.push("/checkout")}
                  variant={"contained"}
                  sx={{ height: 45, width: "100%" }}
                  className={"buttonClass"}
                >
                     {t("cart.btn_checkout")}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};
export default Cart;
