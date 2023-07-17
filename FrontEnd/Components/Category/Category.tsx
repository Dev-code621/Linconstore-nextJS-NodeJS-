import React, { useEffect, useState } from "react";
import Nav from "../Layouts/Nav";
import {
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Wrapper from "../Wappers/Container";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ProductCards from "../Utils/ProductCards";
import { useSelector } from "react-redux";
import {TRating, TStoreId} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import ProductWrapper from "../Wappers/ProductWrapper";
import {useRouter} from "next/router";

const schema = yup.object().shape({
  category: yup.string().min(3),
  filter: yup.string().min(3),
});
type options = {
  category: string;
  filter: string;
};
type IProducts = {
  _id: string;
  createdAt: string;
  quantity: number;
  title: string;
  price: number;
  owner: TStoreId;
  discount: number;
  photo: string[];
  ratingId: TRating;
  subcategory: string;
};
type TCategory = {
  title: string;
  link: string;
  subcategories: string[];
};
type TCat = {
  category: TCategory;
  products: IProducts[];
};
interface ISub {
  data: TCat;
}
const Category: React.FC<ISub> = ({ data }) => {
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<options>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      category: "",
      filter: "",
    },
  });
  const { title, subcategories, link } = data.category;

  const { t } = useTranslation();

  const [products, setProducts] = useState<IProducts[]>(data?.products);
  // useEffect(() => {
  //      const sub = watch('category');
  //         if (sub !== ''){
  //             const newArray = data?.products;
  //             newArray.filter(product => {
  //                 console.log(product.subcategory, sub)
  //             });
  //             console.log(newArray)
  //             setProducts(newArray)
  //         }
  // }, [watch('category')])
  const onSubmit: SubmitHandler<options> = async (data) => {
    reset();
  };
  const [subcats, setSubcats] = useState<string[]>([]);
  useEffect(() => {
    const filter = watch("category");
    if (filter === "All")  return setProducts(data.products)
    const newProducts = data.products.filter(
      (data) => data.subcategory === filter
    );
    setProducts(newProducts);
  }, [watch("category")]);
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem('catScrollPos', window.scrollY.toString());
    };

    router.events.on('routeChangeStart', handleRouteChange);

    const storedScrollPosition = localStorage.getItem('catScrollPos');
    const timeout = setTimeout(() => {
      if (storedScrollPosition) {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }
    },200)


    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      clearTimeout(timeout)
    };
  }, []);
  useEffect(() => {
    const filter = watch("filter");
    switch (filter) {
      case "Recent Items":
        let newProducts = products.sort((a, b) =>
          a.createdAt < b.createdAt ? -1 : 1
        );
        setProducts(newProducts);
        break;
      case "A-Z":
        let newProduct = products.sort((a, b) => (a.title < b.title ? -1 : 1));
        setProducts(newProduct);
        break;
      case "Z-A":
        let newProducs = products.sort((a, b) => (a.title > b.title ? -1 : 1));
        setProducts(newProducs);
        break;
      default:
        let newPoducts = products.sort((a, b) => (a.title > b.title ? -1 : 1));
        setProducts(newPoducts);
    }
  }, [watch("filter")]);
  const isMatches = useMediaQuery("(max-width:350px)");
  return (
    <>
      <Nav />
      <Card
        elevation={0}
        className={"categoryIndi"}
        style={{ background: `url(${link})` }}
        sx={{ my: 1, p: 4, borderRadius: "0px", minWidth: "100%" }}
      >
        <Stack sx={{ mx: 2 }}>
          <Typography variant={"h6"} sx={{ color: "#fff" }}>
            {title ? title : ""}
          </Typography>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ p: 2, borderRadius: "0px", minWidth: "98vw" }}>
        <ProductWrapper
          title={title}
          image={link}
          description={`${title} Category | Linconstore`}
          content={`${title} Sub categories | Linconstore`}
        >
          <Box component={"form"} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControl sx={{ minWidth: isMatches ? 120 : 150 }}>
                <InputLabel id="demo-simple-select-label" shrink={false}>
                  {watch("category") === "" && "Sub Category"}
                </InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      variant={"outlined"}
                      className={"sortButton"}
                      sx={{
                        height: 50,
                        bgcolor: "#fff",
                        color: "#000",
                        border: "2px solid black",
                        borderRadius: "25px",
                        "& .MuiSvgIcon-root": {
                          color: "black",
                        },
                      }}
                    >
                      <MenuItem  value={"All"}>
                        All
                      </MenuItem>
                      {subcategories?.map((subcategory, index) => (
                        <MenuItem key={index} value={subcategory}>
                          {subcategory}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Box sx={{ mx: isMatches ? 0.5 : 0 }} />
              <FormControl sx={{ minWidth: isMatches ? 120 : 150 }}>
                <InputLabel id="demo-simple-select-label" shrink={false}>
                  {watch("filter") === "" && "Filter"}
                </InputLabel>
                <Controller
                  name="filter"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      variant={"outlined"}
                      className={"sortButton"}
                      sx={{
                        height: 50,
                        bgcolor: "#fff",
                        color: "#000",
                        border: "2px solid black",
                        borderRadius: "25px",
                        "& .MuiSvgIcon-root": {
                          color: "black",
                        },
                      }}
                    >
                      <MenuItem value={"Recent Items"}>Recent Items</MenuItem>
                      <MenuItem value={"A-Z"}>A-Z</MenuItem>
                      <MenuItem value={"Z-A"}>Z-A</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              {/*<Button variant={'outlined'} type={'submit'} color={'inherit'} className={'colorReversed'}>Delete Account</Button>*/}
            </Box>
          </Box>
          <Stack>
            <Grid container spacing={1}>
              {products.map(
                (
                  {
                    title,
                    owner,
                    discount,
                    quantity,
                    photo,
                    _id,
                    price,
                    ratingId,
                  },
                  index
                ) => {
                  if (quantity > 0) {
                    return (
                      <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
                        <ProductCards
                          owner={owner}
                          percent={true}
                          discount={discount}
                          name={title}
                          image={photo}
                          price={price}
                          rating={ratingId}
                          id={_id}
                        />
                      </Grid>
                    );
                  }
                }
              )}
            </Grid>
          </Stack>
        </ProductWrapper>
      </Card>
    </>
  );
};
export default Category;
