import React, {useEffect} from "react";
import Nav from "../Layouts/Nav";
import {
  Card,
  FormControl,
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
import {TRating, TStoreId} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import ProductWrapper from "../Wappers/ProductWrapper";
import {useScrollPos} from "../../hooks/UseScrollPos";
import {useRouter} from "next/router";

const schema = yup.object().shape({
  filter: yup.string().min(3),
});
type options = {
  category: string;
  filter: string;
};
type TProducts = {
  discount: number;
  title: string;
  photo: string[];
  quantity: number;
  price: number;
  owner: TStoreId;
  ratingId: TRating;
  _id: string;
};
interface IProducts {
  products: TProducts[];
  image: string;
  name: string;
  description: string;
}
const Brands: React.FC<IProducts> = ({
  products,
  image,
  name,
  description,
}) => {
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
  const onSubmit: SubmitHandler<options> = async (data) => {
    reset();
  };
  const isMatches = useMediaQuery("(max-width: 250px)");
  const { t } = useTranslation();
  const router = useRouter()
    useEffect(() => {
        const handleRouteChange = () => {
            localStorage.setItem('storeScrollPos', window.scrollY.toString());
        };

        router.events.on('routeChangeStart', handleRouteChange);

        const storedScrollPosition = localStorage.getItem('storeScrollPos');
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
  return (
    <>
      <Nav />
      <Card
        elevation={0}
        sx={{
          my: 1,
          backgroundColor: "#e4e1e1",
          p: 2,
          borderRadius: "0px",
          minWidth: "98vw",
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ mx: 2, maxWidth: "350px !important" }}
        >
          <img
            width={150}
            height={150}
            placeholder="blur"
            className={"storeLogo"}
            // blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}
            src={image}
            alt={"brand img"}
          />
          <Box sx={{ my: 2 }}>
            <Typography variant={"h6"} sx={{ my: 2 }}>
              {name}
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ p: 2, borderRadius: "0px", minWidth: "98vw" }}>
        <ProductWrapper
          title={name}
          image={image}
          description={description}
          content={`You can find product of ${name} here`}
        >
          <Box component={"form"} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant={"h6"}> {t("home.store")} </Typography>
              </Box>
              <FormControl sx={{ minWidth: 150 }}>
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
                      <MenuItem value={"Recent Items"}>Recent Items </MenuItem>
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
            {products?.length > 0 && (
              <Grid container spacing={1}>
                {products.map(
                  (
                    {
                      discount,
                      owner,
                      quantity,
                      ratingId,
                      price,
                      _id,
                      title,
                      photo,
                    },
                    index
                  ) => {
                    if (quantity > 0) {
                      return (
                        <Grid
                          key={index}
                          item
                          xs={isMatches ? 12 : 6}
                          sm={4}
                          md={3}
                          lg={2}
                        >
                          <ProductCards
                            discount={discount}
                            owner={owner}
                            rating={ratingId}
                            image={photo}
                            price={price}
                            id={_id}
                            name={title}
                            percent={true}
                          />
                        </Grid>
                      );
                    }
                  }
                )}
              </Grid>
            )}
          </Stack>
        </ProductWrapper>
      </Card>
    </>
  );
};
export default Brands;
