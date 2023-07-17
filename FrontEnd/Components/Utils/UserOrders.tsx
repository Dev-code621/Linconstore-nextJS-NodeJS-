import React, {useContext, useEffect, useState} from "react";
import { Card, Rating, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { ContentCopy } from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import Button from "@mui/material/Button";
import { addRatingModalOpen } from "../../Store/Modal";
import { TProducts } from "../../Helpers/Types";
import { useRouter } from "next/router";
import Truncate from "../../Helpers/Truncate";
import ContextApi from "../../Store/context/ContextApi";
interface IRating {
  rating: boolean;
  processed: boolean;
  refund: boolean,
  shippingProvider: string;
  user: string,
  trackingId: string;
  status: string;
  product: TProducts;
}

const UserOrders: React.FC<IRating> = ({
  status,
  shippingProvider,
  trackingId,
    user,
    refund,
  rating,
  processed,
  product,
}) => {
  const dispatch = useDispatch();
  const handleRating = useContext(ContextApi).handleRatingId;

    const handleRate = () => {
    handleRating(product._id);
    dispatch(addRatingModalOpen());
  };

  const { title, price, photo, ratingId, _id } = product;
  const handleClick = async (data: string) => {
    await navigator.clipboard.writeText(data);
    dispatch(
      snackBarOpen({
        message: "Copied to clipboard",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const router = useRouter();
  const isMatches = useMediaQuery("(max-width: 620px)");
  const isMobile = useMediaQuery("(max-width: 460px)");
  const handleRedirect = (id: string) => {
    router.push(`refund?q=${id}`);
  }
  const [isRated, setIsRated] = useState<boolean>(false)

  useEffect(() => {
      const isRated :boolean = ratingId?.ratings?.some(x => x.userId === user)
      setIsRated(isRated)
  }, [])
  return (
    <Card
      elevation={1}
      sx={{
        my: 1,
        minWidth: isMatches
          ? rating
            ? "auto"
            : processed
            ? "auto"
            : "auto"
          : rating
          ? 400
          : processed
          ? 500
          : 350,
        border: "0px !important",
        bgcolor: "transparent",
      }}
      className={"pointer"}
    >
      <Box sx={{ display: "flex" }}>
        <img
          src={photo[0]}
          width={"100%"}
          height={"120px"}
          placeholder={"blur"}
          className={isMatches ? "userOrders_mobile" : "userOrders"}
          alt={"userOrders Image"}
        />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              mx: isMobile ? 0.2 : 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                mx: isMobile ? 0.2 : 2,
              }}
            >
              <Typography variant={isMatches ? "caption" : "body1"}>
                {Truncate(title, 25)}
              </Typography>
              {status === "cancelled" && (
                <Typography variant={isMatches ? "caption" : "body1"}>
                  Cancelled
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  my: 1,
                  flexDirection: "row",
                  justifyContent: "space-between !important",
                }}
              >
                {rating && !isRated && (
                  <Typography variant={"caption"} onClick={handleRate}>
                    Rate
                  </Typography>
                )}
                {rating && ratingId && (
                  <Rating
                    name="read-only"
                    value={ratingId.ratings[0].rating}
                    size={"small"}
                    readOnly
                  />
                )}
                {/* <Box sx={{ mx: isMatches ? 1 : 3 }} flexGrow={1} /> */}
                {rating && (
                  <Button
                    variant={"outlined"}
                    color={"inherit"}
                    disabled={refund}
                    onClick={() => handleRedirect(_id)}
                    size={"small"}
                  >
                    Refund
                  </Button>
                )}
                {!rating && (
                  <Typography
                    variant={isMatches ? "caption" : "body1"}
                    sx={{ alignSelf: "flex-end" }}
                  >
                    <b>${price} </b>
                  </Typography>
                )}
              </Box>
            </Box>
              {processed && <>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mx: isMobile ? 0.2 : 2,
              }}
            >
              <Typography variant={isMatches ? "caption" : "subtitle1"}>
                Tracking Provider:
              </Typography>
              <Typography variant={isMatches ? "caption" : "subtitle1"}>
                {shippingProvider}
              </Typography>
            </Stack>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mx: isMobile ? 0.2 : 2,
              }}
            >
              <Typography variant={isMatches ? "caption" : "subtitle1"}>
                Tracking ID:
              </Typography>
              <Typography
                variant={isMatches ? "caption" : "subtitle1"}
                onClick={() => handleClick(trackingId)}
              >
                {trackingId}
                <ContentCopy
                  sx={{
                    "&:hover": {
                      color: "blue",
                    },
                    width: isMatches ? "8px" : "15px",
                  }}
                />
              </Typography>
            </Stack>
              </>
              }
          </Box>
        {/* {!processed && isMatches ? <Box flexGrow={1} /> : <Box flexGrow={1} />} */}
      </Box>
    </Card>
  );
};
export default UserOrders;
