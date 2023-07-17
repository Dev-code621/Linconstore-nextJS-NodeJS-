import {Card, Grid, Rating, Stack, Typography, useMediaQuery} from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Badge from "@mui/material/Badge";
import { useRouter } from "next/router";
import slug from "slug";
import Truncate, { getLength } from "../../Helpers/Truncate";
import { useSelector } from "react-redux";
import {TRating, TStoreId} from "../../Helpers/Types";
import StarIcon from '@mui/icons-material/Star';
import {formatNumber} from "../../Helpers/utils";
type TCurrency = {
  currency: {
    currency: string;
  };
};

type Iutil = {
  util: {
    sellerRate: number;
  };
};
interface IProductCards {
  discount: number;
  percent: boolean;
  name: string;
  image: string[];
  owner: TStoreId;
  price: number;
  rating: TRating;
  id: string;
}
const ProductCards: React.JSXElementConstructor<IProductCards> = ({
  owner,
  percent,
  discount,
  image,
  rating,
  id,
  price,
  name,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:1200px)");
  const initialCurrency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const [currency, setNewCurrency] = useState<string>("$");
  const [rate, setRate] = useState<number>(1);
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );
  // useEffect(() => {
  //     if (!rate) {
  //         const rateExchange = localStorage.getItem('rateSeller');
  //         setRate(parseInt(rateExchange))
  //     }
  //     console.log('sds',rate)
  // },[rateDispatch])
  const [isSeller, setIsSeller] = useState<boolean>(false);
  useEffect(() => {
    const pathname: string = router.pathname;
    if (pathname.includes("seller")) {
      setIsSeller(true);
      const rateExchange = localStorage.getItem("rateSeller");
      setNewCurrency(initialCurrency);
      if (rateDispatch) {
        return setRate(rateDispatch);
      }
      setRate(parseInt(rateExchange));

      return;
    }
    return () => setNewCurrency("$");
  }, [router, rateDispatch]);


  return (
    <Card
      className={"category"}
      variant={"outlined"}
      onClick={() =>
        router.push("/product/[slug]", `/product/${slug(name)}-${id}`)
      }
      sx={{
        border: "none",
        minWidth: "100px",
        position: "relative",
        bgcolor: "transparent",
      }}
    >
      {percent && discount && (
        <Badge
          className={"ribbon"}
          sx={{ p: 3, mt: 1, mx: isMobile ? 0 : 2, minWidth: "70px" }}
          badgeContent={`-${discount}% off`}
          color={"error"}
        />
      )}
      <Box
        sx={{
          display: "row",
          mx: isMobile ? 0 : 2,
          flexDirection: "row",
          p: 1,
        }}
      >
        <Image
          className={"products_image"}
          height={120}
          width={150}
          placeholder={"blur"}
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={image[0]}
          alt={"picture of product"}
        />
        <Grid container direction={"column"} spacing={0}>
          <Grid item xs={4}>
            <Typography
              className="innerHeight"
              sx={{ width: 150,  fontWeight: 600}}
              gutterBottom
              variant="body1"
              component="span"
            >
              {Truncate(name, 30)}
            </Typography>
          </Grid>
          {rating && (
            <Grid item xs={4}>
              <Stack direction={'row'}>
              <StarIcon fontSize={'small'} sx={{color: '#FFD700'}}/> <Typography variant={'body1'}>

              {formatNumber(rating.averageRating)} ({rating.ratings?.length} {rating.ratings.length > 1 ? 'reviews' : 'review'})
            </Typography>
              </Stack>
            </Grid>
          )}
          {!isSeller && (
            <Grid item xs={4}>
              <Typography variant={"body2"}>
                {" "}
                Ships from {owner?.owner?.location}{" "}
              </Typography>
            </Grid>
          )}
          <Grid item xs={4}>
            <Typography gutterBottom variant="body2" component="span" sx={{ fontWeight: 600}}>
              {currency } {''}
              { Number((price / rate).toFixed(2))}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>

    // <Card className={'product_card'} sx={{  minWidth: { xs: 50, sm: 200, lg: 250},  mt:3, position: 'relative' }}>
    // <Badge className={'ribbon'} sx={{p:3}} badgeContent={'-8%'} color={'error'} />
    //     <Box sx={{display: 'flex'}}>
    //
    //         <Image
    //             className={'product_next_image'}
    //             height={140}
    //             width={200}
    //             placeholder={'blur'}
    //             blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}
    //             src={'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=403&h=380'}
    //         />
    //         <Stack mt={0} mx={ {xs: 0.5, sm: 2}}>
    //             <Typography gutterBottom variant="body1" component="div">
    //                 Item Name
    //             </Typography>
    //             <Rating name="product_rating" size={'small'} value={3} readOnly />
    //             <Typography gutterBottom variant="body2" mt={2} component="span">
    //                 8$
    //             </Typography>
    //         </Stack>
    //     </Box>
    //     </Card>
  );
};
export default ProductCards;
