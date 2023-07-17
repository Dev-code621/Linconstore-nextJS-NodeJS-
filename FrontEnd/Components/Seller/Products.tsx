import { AddBoxOutlined } from "@mui/icons-material";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import ProductCards from "../Utils/ProductCards";
import React, {useEffect} from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import {TRating, TStoreId} from "../../Helpers/Types";
type TProducts = {
  discount: number;
  title: string;
  photo: string[];
  owner: TStoreId;
  price: number;
  ratingId: TRating;
  _id: string;
  orders: number;
  quantity: number;
};
interface IProducts {
    top: boolean
  data: TProducts[];
  title: string;
  mode: boolean;
  seller: boolean;
  hot: boolean
}
export const product_items : number[] = [1,2,3,4,5,6,];
const Products : React.JSXElementConstructor<IProducts> = ({top, hot, title, mode, seller,data }) => {
    const router = useRouter();
    const isTop = (title : string) : boolean => title.toLowerCase().includes('top')

    const isMobile : boolean = useMediaQuery((('(max-width : 350px)')));
        return (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Typography variant={'h6'} mr={2} noWrap >{title}</Typography>

                        {hot  && <Button variant={'outlined'} sx={{border: '0px !important'}} onClick={() => router.push('/deals')} size={'small'} color={'success'}> View All </Button>}
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'row',  mt:2}}>
                    {mode &&   <span> <AddBoxOutlined sx={{color: '#54991D', mt:0.5}}  /></span>}
                </Box>
                    <Grid container spacing={{xs:0,md:6, lg: seller ? 2 : 1}}>
                        {data?.map((value, index) => {
                            if (value.quantity > 0) {
                                if (top && value.orders !== 0) {
                                    return (
                                        <Grid key={index} item xs={6} sm={4} md={seller ? 2.3 : 2}  lg={seller ? 3 : 2}>
                                            <ProductCards percent={hot} owner={value.owner} image={value.photo} price={value.price} name={value.title}
                                                          rating={value.ratingId} id={value._id} discount={value.discount}/>
                                        </Grid>
                                    )
                                }
                                if (!top) {
                                    return (
                                        <Grid key={index} item xs={6} sm={4} md={seller ? 2.3 : 3} lg={seller ? 3 : 2}>
                                            <ProductCards percent={hot} owner={value.owner} image={value.photo} price={value.price} name={value.title}
                                                          rating={value.ratingId} id={value._id} discount={value.discount}/>
                                        </Grid>
                                    )
                                }
                            }
                            })}

                    </Grid>
                </>

        )

}
export default Products;
