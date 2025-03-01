import { Card, Rating, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

import { useRouter } from "next/router";
import Button from "@mui/material/Button";

type TProduct = {
  photo: string[];
  title: string;
  price: number;
  rating: number;
  _id: string;
};
interface IAds {
  mode: boolean;
  product: TProduct;
  rate: number;
  currency: string;
  handlePromoteAd: (id: string, title: string) => void;
}
const AdsCard: React.FC<IAds> = ({
  mode,
  product,
  handlePromoteAd,
  rate,
  currency,
}) => {
  const photo = product?.photo;
  const price = product?.price;
  const rating = product?.rating;
  const title = product?.title;
  const _id = product?._id;
  const isMatches = useMediaQuery("(max-width:510px)");
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:1200px)");
  // useEffect(() => {
  //     if (!rate) {
  //         const rateExchange = localStorage.getItem('rateSeller');
  //         setRate(parseInt(rateExchange))
  //     }
  //     console.log('sds',rate)
  // },[rateDispatch])

  return (
    <Card
      className={"ads_cover"}
      variant={"outlined"}
      sx={{
        border: "none",
        minWidth: "100px",
        position: "relative",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          mx: isMobile ? 0 : 2,
          flexDirection: "column",
          p: 2,
        }}
      >
        <Image
          className={"ads_image"}
          height={150}
          width={100}
          placeholder={"blur"}
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={photo[0]}
          alt={"image of add_button"}
        />
        <Box
          sx={{
            color: "white",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            p: 1,
            bgcolor: "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={2}>
            <Typography
              gutterBottom
              variant="body1"
              component="div"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
            {rating && (
              <Rating
                name="product_rating"
                size={"small"}
                value={rating}
                readOnly
              />
            )}
          </Stack>
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ alignSelf: "flex-end" }}
              gutterBottom
              variant="body2"
              component="span"
            >
              {currency}
              {Number((price / rate).toFixed(2))}
            </Typography>
            {mode && (
              <Button
                variant={"outlined"}
                onClick={() => handlePromoteAd(_id, title)}
                size={"small"}
                sx={{ textTransform: "none" }}
                color={"inherit"}
              >
                Promote
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};
export default AdsCard;
