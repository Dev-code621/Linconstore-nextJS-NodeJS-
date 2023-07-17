import Box from "@mui/material/Box";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import {
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  FavoriteBorder,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Nav from "../Layouts/Nav";
import Product_reviews from "../Seller/Product_reviews";
import { useDispatch } from "react-redux";
import { modalUserOpen } from "../../Store/Modal";
import { useRouter } from "next/router";
import SimpleAccordion from "../Utils/Accordion";
import { useAddToCart, useAddUserWishlist } from "../../hooks/useDataFetch";
import ContextApi from "../../Store/context/ContextApi";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import slug from "slug";
import ProductWrapper from "../Wappers/ProductWrapper";
import { getHighestNumber, getLowestStock } from "../../Helpers/utils";


let firstStock =  false;
let secondStock = false;
let thirdStock = false;
type TOwner = {
  name: string;
  logo: string;
  _id: string;
};
type TProduct = {
  title: string;
  _id: string;
  description: string;
  price: number;
  owner: TOwner;
  weight: string;
  quantity: number;
  condition: string,
  photo: string[];
  shippingDetail: string;
  instruction: string;
  variants: any[];
};
type IReviews = {
  rate: number;
  name: string;
  description: string;
};
interface IProducts {
  products: TProduct;
  reviews: IReviews[];
}
type IVariants = {
  variant: string;
  option: string;
};
type IVariant = {
  option: string;
  stock: number;
  price: number;
};
type IMain = {
  variant: string;
  options: IVariant[];
};
export const groupByKey = (list: any[], key: string, { omitKey = false }) =>
  list?.reduce(
    (hash, { [key]: value, ...rest }) => ({
      ...hash,
      [value]: (hash[value] || []).concat(
        omitKey ? { ...rest } : { [key]: value, ...rest }
      ),
    }),
    {}
  );

const Product: React.FC<IProducts> = ({ products, reviews }) => {
  const { t } = useTranslation();
  const {
    title,
    photo,
    variants: initialVariant,
    owner,
    quantity: quaty,
    instruction,
    shippingDetail,
    _id: id,
    weight,
    description,
      condition,
    price: initialPrice,
  } = products;

  const [quantity, setQuantity] = React.useState<string>("1");
  const [isFavourite, setIsFavourite] = React.useState<boolean>(false);
  const [price, setPrice] = useState<number>(initialPrice);
  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value as string);
  };
  const [value, setValue] = React.useState(0);

    // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setValue(newValue);
    // };
    const router = useRouter();
    // const isLoggedIn = useContext(ContextApi).isUserLoggedIn;
    const isLoggined = useContext(ContextApi).isLoggedIn;
    const favHolStyle : string = isFavourite ? 'favHolderHov favourite' : 'favHolderHov not_favourite';
    const favStyle : string = isFavourite ? 'fav favHov' : 'not_favourite favHol';
    const isMobile :boolean = useMediaQuery((('(max-width : 600px)' )));
    const isMatches :boolean = useMediaQuery((('(max-width : 420px)' )));
    const isMatch :boolean = useMediaQuery((('(max-width : 290px)' )));
    const [productQuantity, setProductQuantity] = useState<number>(quaty)
    const dispatch = useDispatch();
    const [color, setColor] = React.useState<string | null>('');
    const [size, setSize] = React.useState<string | null>('');
    const [quantities, setQuantities] = useState<number[]>([]);
    useEffect(() => {
      const initialQuantities = []
      console.log('')
      for (let i = 1; i <=productQuantity; i++) {
        initialQuantities.push(i)
      }
      setQuantities(initialQuantities)
    },[productQuantity])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const initialQuantities = []
      for (let i = 1; i <=productQuantity; i++) {
        initialQuantities.push(i)
      }
      setQuantities(initialQuantities)
    }, 1000)
    return () => clearTimeout(timeout)
  },[])
    const handleColorChange = useCallback((newColor: string | null,) => {
        setColor(newColor);
    }, [color]);
    const handleSizeChange = useCallback((size: string | null,) => {
        setSize(size);
    },[size]);
    type image = {
        original: string,
        thumbnail: string,
        loading: string,
        description: string
    }
    const images : image[] = [];
    photo.forEach(image => {
        const imageData = {
            original: image,
            thumbnail: image,
            loading: 'lazy',
            description: ''
        }
        images.push(imageData)
    })
    const handleCartChange = useContext(ContextApi).handleCartChange;
    const [variants, setVariants] = useState<IMain[]>([]);
    const [storeId, setStoreId] = useState<string>('');
    useEffect(() => {
        const storeId = localStorage.getItem('storeId');
        const variants = [];

    if (storeId) setStoreId(storeId);
  }, []);
  const [variantOption, setVariantOption] = useState<string>("");
  const [variantOption1, setVariantOption1] = useState<string>("");
  const [variantOption2, setVariantOption2] = useState<string>("");
  const [variantPrice1, setvariantPrice1] = useState<number>(0);
  const [variantPrice2, setVariantPrice2] = useState<number>(0);
  const [variantPrice3, setVariantPrice3] = useState<number>(0);
  const [variantStock, setVariantStock] = useState<number>(0);
  const [variantStock1, setVariantStock1] = useState<number>(0);
  const [variantStock2, setVariantStock2] = useState<number>(0);
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [variantIndex1, setVariantIndex1] = useState<number>(0);
  const [variantIndex2, setVariantIndex2] = useState<number>(0);
  const [variantPlaceholder, setVariantPlaceholder] = useState<number[]>([]);
  const handleLengthChange = useCallback(
    (data: number): string => {
      if (data === 2) return variantOption2;
      if (data === 1) return variantOption1;
      return variantOption;
    },
    [variantOption, variantOption2, variantOption1]
  );
  const handlePriceChange = useCallback(
      (data: number): number => {
        if (data === 2) return variantPrice3;
        if (data === 1) return variantPrice2;
        return variantPrice1;
      },
      [variantPrice3, variantPrice2, variantPrice1]
  );
  const handleStockChange = useCallback(
    (data: number): number => {
      if (data === 2) return variantStock2;
      if (data === 1) return variantStock1;
      return variantStock;
    },
    [variantStock2, variantStock1, variantStock]
);
  const handleAddToCart = () => {
    if (!isLoggined) return router.push("/login");
    const newVariants: IVariants[] = [];
    let length: number = variantPlaceholder.length;
    let new_price = 0;
    for (let i = 0; i < length; i++) {
      const data: { variant: string; option: string } = {
        variant: variants[i].variant,
        option: handleLengthChange(i),
      };
       const priceChange =  handlePriceChange(i)
      if (priceChange > new_price){
        new_price = priceChange
      }
      newVariants.push(data);
    }
    if (variants.length > 0 && newVariants.length < variants.length) {
      dispatch(
        snackBarOpen({
          message: ("product.modal_data.warning"),
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
      return;
    }
    const data = {
      productId: id,
      variants: newVariants,
      price : variantPlaceholder.length > 0 ? new_price : price,
      quantity,
    };
    if (currentCount === quaty) return;
    addToCart(data);
    handleCartChange();
  };
  const onSuccess = () => {
    handleCartChange();
    setCurrentCount((prevState) => prevState + 1);
    // @ts-ignore
    dispatch(
      modalUserOpen({
        message: ("product.modal_data.success_add_cart"),
        image: "/assets/img/Shopping-bag.svg",
      })
    );
  };
  const [currentCount, setCurrentCount] = useState<number>(0);

  const addToWishlist = () => {
    if (!isLoggined) return router.push("/login");
    if (variants.length > 0 && variantPlaceholder.length < variants.length) {
      dispatch(
        snackBarOpen({
          message: ("product.modal_data.warning"),
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
      return;
    }
    const newVariants: IVariants[] = [];
    let length: number = variantPlaceholder.length;
    for (let i = 0; i < length; i++) {
      const data: { variant: string; option: string } = {
        variant: variants[i].variant,
        option: handleLengthChange(i),
      };
      newVariants.push(data);
    }
    const data = {
      productId: id,
      price,
      quantity,
      variants: newVariants,
    };

    addToWish(data);
  };
  const [variantPrice, setVariantPrice] = useState<number>(0)
  const [pricePlaceholder, setPricePlaceholder] = useState<number[]>([])
  const handleVariantChange = useCallback(
    (index: number, id: number, price: number, color: string, stock: number) => {
      handleColorChange(color);
      if (price > variantPrice){
        setVariantPrice(price)
      }
      const length : number = variantPlaceholder.length;

      if(pricePlaceholder.length === length){
        pricePlaceholder.shift()
      }
      pricePlaceholder.push(price)
      const existingIndex: number = variantPlaceholder.findIndex(
        (x) => x === index
      );
      // console.log(index, color)
      if (existingIndex === -1) {
        const initialPlaceholder = variantPlaceholder;
        initialPlaceholder.push(index);
        setVariantPlaceholder(initialPlaceholder);
      }
      setProductQuantity(stock)
      switch (index) {
        case 0:
          firstStock = true;
          setVariantOption(color);
          setvariantPrice1(price)
          setVariantIndex(id);
          setVariantStock(stock)
          break;
        case 1:
          setVariantOption1(color);
          setVariantPrice2(price)
          setVariantIndex1(id);
          setVariantStock1(stock)
          secondStock = true;
          break;
        case 2:
          thirdStock = true;
          setVariantOption2(color);
          setVariantPrice3(price)
          setVariantStock2(stock)
          setVariantIndex2(id);
          break;
        default:
          setVariantOption(color);
      }
    },
    [variantPrice, variantPrice1, variantPrice2]
  );
  useEffect(() => {
  const highestPrice =   getHighestNumber(variantPrice1, variantPrice2)
  if(highestPrice !== 0 ){
    setPrice(highestPrice)

  }
  },[variantPrice1,variantPrice2, variantPrice3])

    // this logic below is responsible for handling the product quantity/stock based on the currently selected variant
    useEffect(() => {
    let initialStock : number[] = [];
    if(firstStock){
      initialStock = [];
      for(let i = 1; i <= variantStock; i++){
        initialStock.push(i)
      }
    }
    if(secondStock){
      initialStock = [];
      const newVariantStock : number = firstStock ?  getLowestStock([variantStock, variantStock1]) : getLowestStock([variantStock1])
      for(let i = 1; i <= newVariantStock; i++){
      initialStock.push(i)
      }
    }
    if(thirdStock) {
        initialStock = [];
        const newVariantStock : number = firstStock && secondStock ? getLowestStock([variantStock, variantStock1, variantStock2])
        : firstStock ? getLowestStock([variantStock, variantStock2]) : secondStock ? getLowestStock([variantStock1, variantStock2]) : getLowestStock([variantStock2])
        for(let i = 1; i <=newVariantStock; i++){
          initialStock.push(i)
        }
    }
    if(firstStock){
      setQuantities(initialStock)
    }
    if(secondStock){
      setQuantities(initialStock)
    }
    if(thirdStock){
      setQuantities(initialStock)
    }
    // if(secondStock){
    //   console.log('working', initialStock)
    // } 
    },[variantStock1, variantStock, variantStock2])
  // const handleAddToCart = () => {
  //     if (!isLoggined) return router.push('/login');
  //     const newVariants : IVariants [] = []
  //     let length : number = variantPlaceholder.length;
  //     for (length; length--;){
  //         const data = {
  //             variant: variants[length]
  //         }
  //     }
  //     const data = {
  //         productId: id,
  //         price,
  //         quantity
  //     }
  //     if (currentCount === quaty) return
  //     addToCart(data);
  //     handleCartChange();
  // }

  //should work
  const onWishSuccess = () => {
    // @ts-ignore
    dispatch(
      modalUserOpen({
        message: ("product.modal_data.success_add_wishlist"),
        image: "/assets/img/Shopping-bag.svg",
      })
    );
  };
  const { isLoading, mutate: addToCart } = useAddToCart(onSuccess);
  const { isLoading: isWishing, mutate: addToWish } =
    useAddUserWishlist(onWishSuccess);

  const handleIndex = useCallback(
    (index: number, option: string): boolean => {
      // const isExisting = variantPlaceholder.findIndex(x => x  === index);
      // // console.log(isExisting)
      // console.log(variantIndex, id)
      // if (isExisting > -1 && variantIndex === id) return true;
      // if (isExisting > -1 && variantIndex1 === id) return true;
      // return  false
      if (index === 0 && variantOption === option) return true;
      if (index === 1 && variantOption1 === option) return true;
      if (index === 2 && variantOption2 === option) return true;
      // console.log('hello')
      return false;
    },
    [variantPlaceholder, variantOption1, variantOption, variantOption2]
  );
  useEffect(() => {
    const groupedVariant = groupByKey(initialVariant, "variant", {
      omitKey: true,
    });
    const variantPlaceholder: IMain[] = [];
    Object.entries(groupedVariant).map((x) => {
      const data = {
        variant: x[0] as string,
        options: x[1] as IVariant[],
      };
      variantPlaceholder.push(data);
    });
    setVariants(variantPlaceholder);
  }, []);

  return (
    <>
      <Nav />
      <ProductWrapper  image={photo[0]} title={title} description={description} content={description}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} >
            {/*<Image src={'https://enews.com.ng/wp-content/uploads/2022/06/m2-macbook-air-2022-midnight.jpg'}*/}
            {/* width={500} height={340} alt={'Macbook'} placeholder={'blur'} blurDataURL={placeholder} />*/}
            <Box className="imageGalleryMax">
            <ImageGallery
              className={"ímageGallery"}
              showNav={false}
              items={images}
            />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContext: "center",
                }}
              >
                <Stack
                  spacing={2}
                  direction={"row"}
                  onClick={() => router.push("/store/[slug]", `/store/${slug(owner?.name)}`)}
                >
                  <img
                    src={"/assets/img/store.png"}
                    placeholder={"blur"}
                    height={25}
                    width={25}
                    style={{ borderRadius: "50%" }}
                    className={"pointer"}
                    alt={"store image"}
                  />
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {owner?.name}
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    ${price}
                  </Typography>
                </Stack>
                {/* <Typography gutterBottom variant="subtitle1" component="div">*/}
                {/*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad adipisci alias aliquam*/}
                {/*     asperiores aut corporis.*/}
                {/* </Typography>*/}
                {variants.length > 0 &&
                  variants.map((x, index) => (
                    <Box key={index}>
                      <Typography variant={"caption"}>{x.variant}</Typography>
                      <Grid container spacing={isMatches ? 3  : 1}>
                        {x.options.map((y, id) => (
                          <Grid
                            key={id}
                            item
                            xs={ 'auto'}
                            sm={'auto'}
                            md={'auto' }
                            lg={ 'auto' }
                            xl={ 'auto' }
                          >
                            <Button
                              disabled={y.stock === 0}
                              onClick={() =>
                                handleVariantChange(
                                  index,
                                  id,
                                  y.price,
                                  y.option,
                                  y.stock
                                )
                              }
                              className={
                                handleIndex(index, y.option)
                                  ? "color"
                                  : "colorReversed"
                              }
                              variant={"contained"}
                              sx={{
                                maxWidth: isMatches ? 140 : "auto",
                                borderRadius: "25px",
                              }}
                            >
                              {y.option}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                      {/*<Stack my={1} spacing={2} direction={isMatches ? 'column' : 'row'}>*/}
                      {/*    */}
                      {/*        <Button   onClick={() => handleColorChange('Black')} className={color === 'Black' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Black</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Red')} className={color === 'Red' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} >Red</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Green')} className={color === 'Green' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Green</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Blue')} className={color === 'Blue' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Blue</Button>*/}
                      {/*</Stack>*/}
                      {/*    </Box>*/}
                      {/*))}*/}
                      {/*</Typography>*/}
                      {/*<Grid container spacing={1}>*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2}  md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleColorChange('Black')} className={color === 'Black' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Black</Button>*/}
                      {/*    </Grid>*/}
                      {/*    {isMatch &&*/}
                      {/*        <Grid item xs={1}/>*/}
                      {/*    }*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}   sm={2} md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleColorChange('Red')} className={color === 'Red' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} >Red</Button>*/}
                      {/*    </Grid>*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2} md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleColorChange('Green')} className={color === 'Green' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Green</Button>*/}
                      {/*    </Grid>*/}
                      {/*    {isMatch &&*/}
                      {/*        <Grid item xs={1}/>*/}
                      {/*    }*/}
                      {/*    /!*<Grid item xs={isMatches ? 3 : 0 }/>*!/*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3} sm={2} md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleColorChange('Blue')} className={color === 'Blue' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Blue</Button>*/}
                      {/*    </Grid>*/}
                      {/*</Grid>*/}
                      {/*<Stack my={1} spacing={2} direction={isMatches ? 'column' : 'row'}>*/}
                      {/*    */}
                      {/*        <Button   onClick={() => handleColorChange('Black')} className={color === 'Black' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Black</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Red')} className={color === 'Red' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} >Red</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Green')} className={color === 'Green' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Green</Button>*/}
                      {/*    <Button   onClick={() => handleColorChange('Blue')} className={color === 'Blue' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > Blue</Button>*/}
                      {/*</Stack>*/}
                      {/*<Typography variant={'caption'}>Size*/}
                      {/*</Typography>*/}
                      {/*<Grid container spacing={1}>*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2}  md={2.5} lg={2}>*/}
                      {/*        <Button    onClick={() => handleSizeChange('S')} className={size === 'S' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > S</Button>*/}
                      {/*    </Grid>*/}
                      {/*    {isMatch &&*/}
                      {/*        <Grid item xs={1}/>*/}
                      {/*    }*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2}  md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleSizeChange('M')} className={size === 'M' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} >M</Button>*/}
                      {/*    </Grid>*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2}  md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleSizeChange('L')} className={size === 'L' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > L</Button>*/}
                      {/*    </Grid>*/}
                      {/*    {isMatch &&*/}
                      {/*        <Grid item xs={1}/>*/}
                      {/*    }*/}
                      {/*    <Grid item xs={isMatches ? 4 : 3}  sm={2}  md={2.5} lg={2}>*/}
                      {/*        <Button   onClick={() => handleSizeChange('XL')} className={size === 'XL' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > XL</Button>*/}
                      {/*    </Grid>*/}
                      {/*</Grid>*/}
                    </Box>
                  ))}
                {/*<Stack spacing={2} direction={isMatches ? 'column' : 'row'}>*/}
                {/*    <Button    onClick={() => handleSizeChange('S')} className={size === 'S' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > S</Button>*/}
                {/*    <Button   onClick={() => handleSizeChange('M')} className={size === 'M' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} >M</Button>*/}
                {/*    <Button   onClick={() => handleSizeChange('L')} className={size === 'L' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > L</Button>*/}
                {/*    <Button   onClick={() => handleSizeChange('XL')} className={size === 'XL' ? 'color' : 'colorReversed' }  variant={'contained'} sx={{maxWidth: isMatches ? 80 : 'auto', borderRadius: '25px'}} > XL</Button>*/}
                {/*</Stack>*/}
                <Stack
                  direction={"row"}
                  mt={2}
                  spacing={2}
                >
                  {/* create a dropdown to select quantity, a favorite icon and an add to cart button  */}
                  <Box width={100}>
                    <FormControl fullWidth>
                      <InputLabel id="select quantity">
                        {t("product.quantity")}
                      </InputLabel>
                      <Select
                        labelId="select-label"
                        id="simple-select"
                        value={quantity}
                        variant={"standard"}
                        label={t("product.quantity")}
                        sx={{ border: "0px !important", my: 1 }}
                        onChange={handleChange}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                      >
                        {quantities.map((value, index) => (
                          <MenuItem key={index} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>

                    <sup> <Typography sx={{mt:2}} variant={'subtitle2'}> <b>Condition: {condition} </b></Typography></sup>

                  </Box>

                </Stack>
                <Stack className={"sticky"} spacing={2} sx={{ mb: 1 }}>
                  {/*<Button size={isMobile ? 'small' : 'large'} className={'addWish'}*/}
                  {/*        variant="outlined" endIcon={<MessageOutlined/>} sx={{*/}
                  {/*    color: '#121212BF',*/}
                  {/*    display: 'hidden',*/}
                  {/*    border: '1px solid black',*/}
                  {/*    borderRadius: '2px'*/}
                  {/*}} onClick={() => router.push('/chat')} disabled={storeId === owner._id}>*/}
                  {/*    Message Seller*/}
                  {/*</Button>*/}
                  {!isMobile && (
                    <>
                      <Button
                        size={isMobile ? "small" : "large"}
                        disabled={isWishing || storeId === owner._id}
                        className={"addWish"}
                        variant="outlined"
                        endIcon={<FavoriteBorder />}
                        sx={{
                          color: "#121212BF",
                          border: "1px solid black",
                          borderRadius: "2px",
                          mt: isMobile ? 0 : 9,
                        }}
                        onClick={() => addToWishlist()}
                      >
                        {t("product.btn_add_wishlist")}
                      </Button>
                      <Button
                        disabled={isLoading || storeId === owner._id}
                        size={isMobile ? "small" : "large"}
                        className={"addCart"}
                        endIcon={<ShoppingCartOutlined />}
                        variant="outlined"
                        color={"success"}
                        sx={{
                          color: "#fff",
                          bgcolor: "#000",
                          border: "2px solid black",
                          borderRadius: "2px",
                        }}
                        onClick={() => handleAddToCart()}
                      >
                        {t("product.btn_add_to_cart")}{" "}
                        {isLoading && <CircularProgress />}
                      </Button>
                    </>
                  )}
                </Stack>
                <SimpleAccordion care={instruction} shipping={shippingDetail} />
              </Box>
            </Card>
          </Grid>
        </Grid>
        {isMobile && (
          <Paper
            sx={{
              mt: 1,
              padding: "1rem",
              borderRadius: "2px",
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {/*<Fab aria-label={'message seller'} onClick={() => router.push('/chat')}>*/}
              {/*<FontAwesomeIcon icon={faComments} fontSize={'large'}/>*/}
              {/*</Fab>*/}
              {/*{!isMatches &&*/}
              {/*    <Fab aria-label={'add to Favourite'} onClick={() => setIsFavourite(cur => !cur)}*/}
              {/*         className={favHolStyle}>*/}
              {/*        <FavoriteBorder fontSize={'large'} className={favStyle}/>*/}
              {/*    </Fab>}*/}
              {/*<Button variant="contained"  sx={{borderRadius: '2px'}} className={'buttonClass'} onClick={() => dispatch(modalUserOpen({type: 'add to cart'}))}>*/}
              {/*    Add to cart*/}
              {/*</Button>*/}
              <Button
                size={isMobile ? "small" : "large"}
                disabled={isWishing || storeId === owner._id}
                className={"addWish"}
                variant="outlined"
                endIcon={<FavoriteBorder />}
                sx={{
                  color: "#121212BF",
                  border: "1px solid black",
                  borderRadius: "2px",
                }}
                onClick={() => addToWishlist()}
              >
                {t("product.btn_add_wishlist")}
              </Button>
              {/*{ // @ts-ignore}*/}
              <Button
                size={isMobile ? "small" : "large"}
                className={"addCart"}
                disabled={storeId === owner._id}
                endIcon={<ShoppingCartOutlined />}
                variant="outlined"
                color={"success"}
                sx={{
                  color: "#fff",
                  bgcolor: "#000",
                  border: "2px solid black",
                  borderRadius: "2px",
                }}
                onClick={() => handleAddToCart()}
              >
                {t("product.btn_add_to_cart")}
              </Button>
            </Stack>
          </Paper>
        )}
        <Stack spacing={2} sx={{ my: 2, p: isMobile ? 2 : 0 }}>
          <Typography variant={"h5"}>{t
          ("product.description")}</Typography>

          <Typography variant={"body1"}>{description}</Typography>
        </Stack>
        {reviews.length > 0 ? (
          <Product_reviews reviews={reviews}/>
        ) : (
          <Typography variant={"body2"}> </Typography>
        )}
      </ProductWrapper>
    </>
  );
};
export default Product;
