import {Card, CardContent, CardMedia, Grid, Rating, Stack, Typography, useMediaQuery} from "@mui/material";
import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import {FavoriteBorder} from "@mui/icons-material";
import slug from "slug";
import {useRouter} from "next/router";
import Truncate from "../../Helpers/Truncate";
import {TRating, TStoreId} from "../../Helpers/Types";
import Badge from "@mui/material/Badge";
import StarIcon from "@mui/icons-material/Star";
import {formatNumber} from "../../Helpers/utils";
type TProducts = {
    title: string,
    price: number,
    owner: TStoreId,
    discount: number,
    photo: string[],
    ratingId : TRating,
    _id: string
}
interface IProducts  {
    product : TProducts,
    percent: boolean
}
const SearchItemCards: React.JSXElementConstructor<IProducts> = ({product, percent}) => {
    const router = useRouter();
    const { title, photo, price, _id, owner, discount} = product;
    const ratingId = product?.ratingId
    useEffect(() => {

    },[])
    const isMobile = useMediaQuery('(max-width:600px)')
    return (
        <Card elevation={0} className={'category'} onClick={() => router.push('/product/[slug]', `/product/${slug(title)}-${_id}` )} sx={{   minWidth: { xs: 50, sm: 250, lg: 300},  mt:3, position: 'relative' }}>
            {/*<Box sx={{display: 'row', mx:isMobile ? 0 : 2, flexDirection: 'row',p:1 }}>*/}
            {/*    <Image*/}
            {/*        className={'products_image'}*/}
            {/*        height={120}*/}
            {/*        width={150}*/}
            {/*        placeholder={'blur'}*/}
            {/*        blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}*/}
            {/*        src={photo[0]}*/}
            {/*    />*/}
            {/*    <Grid container direction={'column'} spacing={0}>*/}
            {/*        <Grid item  xs={4}>*/}
            {/*            <Typography sx={{width: 150}} gutterBottom variant="body1" component="div">*/}
            {/*                {Truncate(title, 30)}*/}
            {/*            </Typography>*/}
            {/*        </Grid>*/}
            {/*        { ratingId &&  <Rating name="product_rating" value={ratingId.averageRating} readOnly />}*/}
            {/*        <Grid item  xs={4}>*/}
            {/*            <Typography gutterBottom variant="body2"  component="span">*/}
            {/*                ${price}*/}
            {/*            </Typography>*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Box>*/}
            {percent &&  discount && <Badge className={'ribbon'} sx={{p:3, mt:1, mx:isMobile ? 0 : 2, minWidth:'70px'}} badgeContent={`-${discount}% off`} color={'error'} />}
            <Box sx={{display: 'row', mx:isMobile ? 0 : 2, flexDirection: 'row',p:1 }}>
                <Image
                    className={'products_image'}
                    height={isMobile ? 140 : 120}
                    width={150}
                    placeholder={'blur'}
                    blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}
                    src={photo[0]}
                    alt={"image of products"}
                />
                <Grid container direction={'column'} spacing={0}>
                    <Grid item  xs={4}>
                        <Typography sx={{width: 170, fontWeight: 600}}  variant="body1">
                            {Truncate(title, 30)}
                        </Typography>
                    </Grid>

                    {ratingId &&
                        <Grid item xs={4}>
                            <Stack direction={'row'}>
                                <StarIcon fontSize={'small'} sx={{color: '#FFD700'}}/> <Typography variant={'body1'}>

                                {formatNumber(ratingId?.averageRating)} ({ratingId?.ratings?.length} {ratingId?.ratings?.length > 1 ? 'reviews' : 'review'})
                            </Typography>
                            </Stack>
                        </Grid>
                    }
                    <Grid item  xs={4}>
                        <Typography sx={{width: 150}}  variant="body2" component="span">
                            Ships from {owner?.owner?.location}
                        </Typography>
                    </Grid>
                    {/*<Grid item xs={4}>*/}
                    {/*    <Typography variant={'body2'}>ships from {owner?.location} </Typography>*/}
                    {/*</Grid>*/}
                    <Grid item  xs={4}>
                        <Typography gutterBottom variant="body2" sx={{fontWeight: 600}}  component="span">
                            $ {price.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/*<Box sx={{display: 'flex'}}>*/}
            {/*    <Image*/}
            {/*    height={200}*/}
            {/*    width={250}*/}
            {/*    placeholder={'blur'}*/}
            {/*    blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}*/}
            {/*    src={photo[0]}*/}
            {/*    />*/}
            {/*    <Stack spacing={0.5} mt={0} mx={2}>*/}
            {/*        <Typography gutterBottom variant="h6" component="div">*/}
            {/*            {Truncate(title, 30)}*/}
            {/*        </Typography>*/}
            {/*        { ratingId &&  <Rating name="product_rating" value={ratingId.averageRating} readOnly />}*/}
            {/*        <Stack direction={'row'}>*/}
            {/*            <Box flexGrow={1} />*/}
            {/*            <Typography gutterBottom variant="body1" mt={2} component="div">*/}
            {/*                ${price}*/}
            {/*            </Typography>*/}
            {/*        </Stack>*/}

            {/*    </Stack>*/}
            {/*</Box>*/}
        </Card>

    )

}
export default SearchItemCards;
