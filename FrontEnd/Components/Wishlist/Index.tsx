import React, { useEffect, useState } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CircularProgress, Paper, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import WishlistCard from "../Utils/WishlistCard";
import { ArrowBack } from "@mui/icons-material";
import Nav from "../Layouts/Nav";
import { useGetUserWishlist } from "../../hooks/useDataFetch";
import { TProducts } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";

type Tvariants = {
  option: string;
  variant: string;
};
interface IWish {
  productId: TProducts;
  price: number;
  created_at: Date;
  _id: string;
  variants: Tvariants[];

  check: boolean;
}
interface Initial {
  productId: TProducts;
  price: number;
  variants: Tvariants[];
  created_at: Date;
}
const Wishlist: React.FC = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<IWish[]>([]);
  const onSuccess = (data: Initial[]) => {
    const initial: IWish[] = [];
    data.forEach((myData) => {
      initial.push({ ...myData, check: false } as IWish);
    });
    setWishlist(initial);
  };
  const { isLoading, data, isFetched, refetch } = useGetUserWishlist(onSuccess);

  useTokenRefetch(refetch)
  const handleRefetch = () => refetch();
  const { t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Head>
        <title>Your Wishlist</title>
        <meta name={"Wishlist"} content={"These are your wish list"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>

      <Nav />
      <Container component="main" maxWidth={"md"}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5
          }}
        >
          <ArrowBack onClick={() => router.push("/")} className={"pointer"} />

          <Typography textAlign={"center"} variant="h6" component="div">
            {t("wish_list.title")} {isLoading && <CircularProgress />}
          </Typography>
        </Box>
        <Box
          sx={{
            marginBottom: 3,
            display: "flex",
            marginTop: 2,
            flexDirection: "column",
            // alignItems: 'center',
            // height: 600,
            justifyContent: "center",
          }}
        >
          {wishlist.length > 0 && (
            <WishlistCard handleRefetch={handleRefetch} wishlists={wishlist} />
          )}
          {wishlist.length === 0 && (
            <Typography variant={"body1"} textAlign={"center"}>
              {t("wish_list.content")}
            </Typography>
          )}
          {/*<WishlistCard/>*/}
          {/*<WishlistCard/>*/}
        </Box>
      </Container>
    </>
  );
};
export default Wishlist;
