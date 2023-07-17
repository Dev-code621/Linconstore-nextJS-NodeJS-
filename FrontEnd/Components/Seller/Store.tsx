import Head from "next/head";
import StoreHolder from "../Wappers/StoreHolder";
import Products from "./Products";
import Product_reviews from "./Product_reviews";
import Box from "@mui/material/Box";
import * as React from "react";
import {
  Card,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AddItemCards from "../Utils/AddItemCards";
import Search from "../Utils/Search";
import { useRouter } from "next/router";
import {
  useGetSellerProducts,
  useGetStoreReviews,
} from "../../hooks/useDataFetch";
import { useCallback, useState } from "react";
import {TRating, TStoreId} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";

type TProducts = {
  discount: number;
  title: string;
  photo: string[];
  owner: TStoreId;
  price: number;
  orders: number;
  ratingId: TRating;
  _id: string;
  quantity: number;
};
type IReviews = {
  rate: number;
  name: string;
  description: string;
};
const Store: React.JSXElementConstructor<any> = () => {
  const isMatches: boolean = useMediaQuery("(max-width:500px)");
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = useState<TProducts[]>([]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      const product = data?.filter((product) =>
        product.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setProducts(product);
    },
    [search]
  );
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [topProducts, setTopProducts] = useState<TProducts[]>([])
  const onSuccess = (data: TProducts[]) => {
    let length =  data.length;
    const topPlaceholder : TProducts[] = []
    for (let i = 0; i < length; i++){
      if (data[i]?.quantity >= 1 && topPlaceholder.length < 4 ){
        topPlaceholder.push(data[i])
      }
    }
    setProducts(data);
    setTopProducts(topPlaceholder)
  };
  const { data, isLoading, refetch } = useGetSellerProducts(onSuccess);

  useTokenRefetch(refetch)

  const [reviews, setReviews] = useState<IReviews[]>([])
  const onReviewSuccess = (data: IReviews[]) => {
      setReviews(data)
  }
  const { isLoading: reviewIsLoading,  refetch: refetchReviews } = useGetStoreReviews(onReviewSuccess);
  useTokenRefetch(refetchReviews)
  return (
    <>
      <Head>
        <title>Storefront | seller dashboard linconstore</title>
        <meta name={"Storefront"} content={"These are the Storefront"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <StoreHolder>
        <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {isMobile && (
              <ArrowBack
                onClick={() => router.push("/account")}
                className={"pointer"}
              />
            )}
            <Typography variant={"h6"}>{t("seller.menuItem.home")}</Typography>
          </Box>
          <Search search={search} handleChange={handleChange} />
          {products?.length === 0 && <AddItemCards title={"ALL ITEMS"} />}
          {isLoading && <CircularProgress />}
          <Products
            data={topProducts}
            seller={true}
            hot={false}
            top={true}
            mode={false}
            title={t("home.topItems")}
          />
          <br />
          <Products
            data={products}
            seller={true}
            mode={false}
            top={false}
            hot={false}
            title={t("home.allItems")}
          />
          {reviews?.length > 0 ? (
            <Product_reviews reviews={reviews} />
          ) : (
            <Typography variant={"body2"} textAlign={"center"}>
              No Reviews Yet
            </Typography>
          )}
        </Card>
      </StoreHolder>
    </>
  );
};
export default Store;
