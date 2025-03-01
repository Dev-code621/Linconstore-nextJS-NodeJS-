import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import ProductCards from "../Utils/ProductCards";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import {TRating, TStoreId} from "../../Helpers/Types";
import { useGetHotDeals } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";

interface IProducts {
  discount: number;
  title: string;
  photo: string[];
  owner: TStoreId;
  price: number;
  ratingId: TRating;
  _id: string;
  orders: number;
  quantity: number;
}
const Deals: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 300px)");
  const router = useRouter();
  const [products, setProducts] = useState<IProducts[]>([]);

  const onSuccess = (data: IProducts[]) => {
    setProducts(data);
  };
  const { isLoading, isFetched } = useGetHotDeals(onSuccess);
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("account.deal.title")}
          description={t("account.deal.description")}
          content={""}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
              <Typography variant={"body1"}>
                {t("account.deal.btn_back")}
              </Typography>
            </Stack>
            <Container component={"article"} maxWidth={"lg"}>
              <Box sx={{ maxWidth: 900, p: 1 }}>
                <Typography variant={isMobile ? "body1" : "h5"}>
                  {t("account.deal.title")}
                </Typography>
                {isLoading && <CircularProgress />}
                {isFetched && products.length === 0 && (
                  <Typography
                    sx={{ my: 2 }}
                    variant={isMobile ? "body1" : "h5"}
                  >
                    {t("account.deal.content")}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    mb: 18,
                    flexDirection: "column",
                    p: 0,
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={1}>
                    {products.map((value, index: number) => (
                      <Grid
                        key={index}
                        item
                        xs={isMatches ? 12 : 6}
                        sm={4}
                        lg={3}
                      >
                        <ProductCards
                          percent={true}
                          owner={value.owner}
                          image={value.photo}
                          price={value.price}
                          name={value.title}
                          rating={value.ratingId}
                          id={value._id}
                          discount={value.discount}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Deals;
