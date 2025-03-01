import React, { useState } from "react";
import Nav from "../Layouts/Nav";
import MainHolder from "../Wappers/MainHolder";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import SearchItemCards from "../Utils/SearchItemCards";
import { TProducts } from "../../Helpers/Types";
import { useGetHotDeals } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";

const Deals: React.FC = () => {
  const [products, setProducts] = useState<TProducts[]>([]);
  const isMobile: boolean = useMediaQuery("(max-width: 300px)");
  const { t } = useTranslation();
  const onSuccess = (data: TProducts[]) => {
    setProducts(data);
  };
  const { isLoading, isFetched } = useGetHotDeals(onSuccess);
  return (
    <>
      <Nav />
      <MainHolder>
        {/*<Products mode={false} title={'Top Deals'} data={[]} seller={false} discount={false}/>*/}
        {/*<Cards/>*/}
        <Typography variant={"h5"} mt={2} gutterBottom>
          {t("home.hotDeals")}
        </Typography>
        {isFetched && products.length === 0 && (
          <Typography textAlign={"center"}>
            {t("home.hotDeals_alert")}
          </Typography>
        )}
        {isLoading && (
          <Typography textAlign={"center"}>
            <CircularProgress />
          </Typography>
        )}
        {products.length > 0 && (
          <Box>
            <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
              {products.map((product, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    xs={isMobile ? 12 : 6}
                    sm={4}
                    md={3}
                    lg={2}
                  >
                    <SearchItemCards percent={true} product={product} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </MainHolder>
    </>
  );
};
export default Deals;
