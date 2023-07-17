
import React from "react";
import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SellersCard from "../Utils/SellerCards";
import { TSellerStore1 } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";

interface ISellerStore {
  stores: TSellerStore1[];
}
const Cards: React.FC<ISellerStore> = ({ stores }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
        <Typography variant={"h6"} mr={2} noWrap>
          {t("home.bestSeller")}
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
        {stores.map(({ _id, name, logo }, index) => {
          return (
            <Grid key={index + _id} item xs={12} sm={6} md={4} lg={3}>
              {logo && <SellersCard name={name} _id={_id} image={logo} />}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
export default Cards;
