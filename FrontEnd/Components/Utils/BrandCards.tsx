import { Box } from "@mui/system";
import { Card, CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { TSellerStore1 } from "../../Helpers/Types";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import slug from "slug";

interface IBrands {
  brands: TSellerStore1[];
}
const BrandCards: React.FC<IBrands> = ({ brands }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
        <Typography variant={"h6"} mr={2}>
          {t("home.popularBrands")}
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 2, md: 6, lg: 6 }}>
        {brands.map(({ _id, name, logo }, index) => {
          return (
            <Grid key={_id + index} item xs={6} sm={4} md={3} lg={3}>
              <Card
                  onClick={() => router.push("/store/[slug]", `/store/${slug(name)}`)}
                className={"product_card"}
                sx={{
                  minWidth: { xs: 50, sm: 250, lg: 300 },
                  mt: 3,
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  alt="store image"
                  height="200"
                  className={"product_image"}
                  image={logo}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
export default BrandCards;
