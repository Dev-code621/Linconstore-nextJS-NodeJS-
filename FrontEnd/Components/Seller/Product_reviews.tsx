import {Avatar, Box, Card, Rating, Stack, Typography, useMediaQuery} from "@mui/material";
import ReviewCards from "../Utils/ReviewCards";
import React from "react";


type TReviews = {
    rate: number,
    description: string,
    name: string
}

interface IReviews {
    reviews: TReviews[]
}
const Product_reviews: React.JSXElementConstructor<IReviews>  = ({reviews}) => {
    const isMobile : boolean = useMediaQuery('(max-width: 600px)')
    return (
            <Stack spacing={ 2} mb={2} mt={2} mx={isMobile ? 2 : 0}>
            <Typography  sx={{fontSize: {xs:'15px', sm:'20px', md:'21px', fontWeight: isMobile ? 600 : 500}}} >Recent Review(s)</Typography>
         {reviews.map((item, index) => <ReviewCards key={index} description={item.description} name={item.name} rate={item.rate}/>)}
            </Stack>
        )

}
export default Product_reviews;