import React, { useEffect } from "react";
import Nav from "../Layouts/Nav";
import MainHolder from "../Wappers/MainHolder";

import { Grid, useMediaQuery } from "@mui/material";
import SearchItemCards from "../Utils/SearchItemCards";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TStoreId } from "../../Helpers/Types";
import {useRouter} from "next/router";

type TRating = {
  averageRating: number;
  ratings: []
};
type TProducts = {
  title: string;
  price: number;
  photo: string[];
  discount: number;
  quantity: number;
  owner: TStoreId;
  ratingId: TRating;
  _id: string;
};
type TAds = {
  productId: TProducts;
};
interface IResults {
  products: TProducts[];
  ads: TAds[];
  searchTags: string[],
  relatedProducts: TProducts[];
}
const SearchResults : React.JSXElementConstructor<IResults> = ({searchTags, ads,relatedProducts, products }) => {

    const isMobile : boolean = useMediaQuery('(max-width: 300px)');

    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = () => {
            localStorage.setItem('searchScrollPos', window.scrollY.toString());
        };
        router.events.on('routeChangeStart', handleRouteChange);
        const storedScrollPosition = localStorage.getItem('searchScrollPos');
        const timeout = setTimeout(() => {
            if (storedScrollPosition) {
                window.scrollTo(0, parseInt(storedScrollPosition));
            }
        },50)
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            clearTimeout(timeout)
        };
    }, []);
    return (
            <>
            <Nav/>
                <MainHolder>
                    {/*<Products mode={false} title={'Top Deals'} data={[]} seller={false} discount={false}/>*/}
                    {/*<Cards/>*/}
                    <Typography variant={'h5'} mt={2} gutterBottom>Search Results</Typography>
                    {ads.length === 0 && products.length === 0 && relatedProducts.length === 0 && <Typography variant={'h6'} textAlign={'center'} mt={2} gutterBottom>No Result Found</Typography>}
                    {ads.length > 0 &&
                        <Box>
                        <Typography variant={'body1'} gutterBottom>Ads related to search</Typography>
                        <Grid container spacing={{xs:4,md:6, lg: 6}}>
                    {ads.map((ad, index) => {
                            if (ad.productId?.title && ad.productId?.quantity > 0) {
                                return (
                                    <Grid key={index} item xs={6} sm={6} md={4} lg={2}>
                                        <SearchItemCards percent={true} product={ad.productId}/>
                                    </Grid>
                                )
                            }
                        }
                        )}
                        </Grid>
                        </Box>
                    }
                    {products.length > 0 &&
                        <Box>
                            <Typography variant={'body1'} gutterBottom sx={{mt:5}} >Search Result</Typography>
                            <Grid container spacing={{xs:4,md:6, lg: 6}}>
                                {products.map((product, index) => {
                                    if (product.title && product.quantity > 0){
                                        return (
                                            <Grid key={index} item xs={isMobile ? 12 : 6} sm={6} md={4}  lg={2}>
                                                <SearchItemCards percent={true} product={product} />
                                            </Grid>
                                        )
                                    }
                                   })}
                            </Grid>
                        </Box>
                    }
                    {relatedProducts.length > 0 &&
                        <Box>
                            <Typography variant={'body1'} gutterBottom >Similar Products related to  "{searchTags}" </Typography>
                            <Grid container spacing={{xs:4,md:6, lg: 6}}>
                                {relatedProducts.map((product, index) => {
                              
                              if (product.title && product.quantity > 0 ){
                                        return (
                                            <Grid key={index} item xs={12} sm={6} md={4}  lg={2}>
                                                <SearchItemCards percent={true} product={product} />
                                            </Grid>
                                        )
                                    }
                                })}
                            </Grid>
                        </Box>
                    }
                </MainHolder>
            </>
            )

}
export default SearchResults;
