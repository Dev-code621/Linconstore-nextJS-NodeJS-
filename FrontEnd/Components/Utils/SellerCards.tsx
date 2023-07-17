import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import slug from "slug";

interface IsellerCard {
  image: string;
  name: string;
  _id: string;
}
const SellersCard: React.JSXElementConstructor<IsellerCard> = ({
  name,
  image,
  _id,
}) => {
  const router = useRouter();
  return (
    <Card
        onClick={() => router.push(`/store/${name}`)}
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
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        {/*<Rating name="product_rating" value={3} readOnly />*/}
      </CardContent>
    </Card>
  );
};
export default SellersCard;
