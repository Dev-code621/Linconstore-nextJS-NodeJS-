import type { NextPage } from "next";
import Head from "next/head";
import Nav from "../Components/Layouts/Nav";
import MainHolder from "../Components/Wappers/MainHolder";
import Products from "../Components/Seller/Products";
import Cards from "../Components/Seller/Cards";
import BrandCards from "../Components/Utils/BrandCards";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Slider from "../Components/Utils/Slider";
import Footer from "../Components/Layouts/Footer";
import React, { useEffect, useState } from "react";
import {
  useGetAllCategories,
  useGetAllProducts,
  useGetAllStores,
  useGetBrands,
  useGetHotDeals, useGetTopCategories,
  useGetTopProducts,
} from "../hooks/useDataFetch";
import { TSellerStore1, TStoreId } from "../Helpers/Types";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Flag from "react-world-flags";
import { NextSeo } from "next-seo";
import {useRouter} from "next/router";
type TRating = {
  averageRating : number,
  ratings: []
}
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
type TCat = {
  title: string;
  subcategories: string[];
  link: string;
  _id: string;
};
interface ICat {
  category: TCat;
}

const Home: NextPage = () => {
  // pages/index.js

    const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    router.events.on('routeChangeStart', handleRouteChange);

    const storedScrollPosition = localStorage.getItem('scrollPosition');
    const timeout = setTimeout(() => {
      if (storedScrollPosition) {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }
    },500)


    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      clearTimeout(timeout)
    };
  }, []);


  const { i18n, t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width : 450px)");
  const [topCategory, setTopCategory] = useState<TCat[]>([]);
  const [allCategory, setAllCategory] = useState<TCat[]>([])
  const onSuccess = (data: TCat[]) => {
    setAllCategory(data)
  };
  const [hotDeals, setHotdeals] = useState<TProducts[]>([]);
  const dealsSuccess = (data: TProducts[]) => {
    const newData = data.length > 11 ? data.slice(0, 11) : data;
    setHotdeals(newData);
  };

  const onTopCategorySuccess = (data : ICat[]) => {
    const placeholder : TCat[] = []
      data.map(x => placeholder.push(x.category))
      setTopCategory(placeholder)
  }
  const { data } = useGetAllCategories(onSuccess);
  const {data: topCat} = useGetTopCategories(onTopCategorySuccess)
  useGetHotDeals(dealsSuccess);
  const { data: products } = useGetAllProducts();
  const { data: topProducts } = useGetTopProducts();
  const [stores, setStores] = useState<TSellerStore1[]>([]);
  const [brands, setBrands] = useState<TSellerStore1[]>([]);
  const onStoreSuccess = (data: TSellerStore1[]) => {
    setStores(data);
  };
  const onBrandSuccess = (data: TSellerStore1[]) => {
    setBrands(data);
  };

  useGetBrands(onBrandSuccess);
  useGetAllStores(onStoreSuccess);

  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("currentLanguage", i18n.language);
  };
  const handleChangLang = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const lang = e.target.value;
    console.log("Langauge", lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    if (localStorage.getItem("currentLanguage")) {
      setOpen(false);
    }
  }, []);

  const languages = [
    {
      value: "English",
      label: t("lang.English"),
      code: "GB",
    },
    {
      value: "French",
      label: t("lang.French"),
      code: "FR",
    },
    {
      value: "Spanish",
      label: t("lang.Spanish"),
      code: "ES",
    },
    {
      value: "Dutch",
      label: t("lang.Dutch"),
      code: "NL",
    },
    {
      value: "Turkish",
      label: t("lang.Turkish"),
      code: "TR",
    },
    {
      value: "Greek",
      label: t("lang.Greek"),
      code: "GR",
    },
    {
      value: "Swedish",
      label: t("lang.Swedish"),
      code: "SE",
    },
    {
      value: "Polish",
      label: t("lang.Polish"),
      code: "PL",
    },
    {
      value: "Portuguese",
      label: t("lang.Portuguese"),
      code: "PT",
    },
    {
      value: "Italian",
      label: t("lang.Italian"),
      code: "IT",
    },
    {
      value: "Norwegian",
      label: t("lang.Norwegian"),
      code: "NO",
    },
    {
      value: "Czech",
      label: t("lang.Czech"),
      code: "CZ",
    },
  ];

  return (
    <>
      <Head>
        <title> Linconstore | Buy and sell online with ease across Europe and North America </title>
        <meta
          name="Linconstore | Buy and sell online with ease across Europe and North America"
          content="Find wide range of products to cater for your everyday needs from around the world"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Nav />
      <NextSeo
        title="Linconstore | Buy and sell online with ease across Europe and North America"
        description="Shop diverse range of products in several categories for your everyday use!"
      />
      <MainHolder>
        <Stack spacing={0.5}>
          <Typography
            variant={"h5"}
            gutterBottom
            sx={{ fontSize: "1.25rem", fontWeight: "600" }}
          >
            {!topCategory || topCategory?.length === 0
              ? ""
              : t("home.topCategories")}
          </Typography>
          {topCategory?.length > 0 && (
            <Slider data={topCategory} allCat={false} />
          )}
        </Stack>
        <Stack spacing={0.5} mt={2}>
          <Typography
            variant={"h1"}
            gutterBottom
            sx={{ fontSize: "1.25rem", fontWeight: "600" }}
          >
            {!data || data.length === 0 ? "" : t("home.allCategories")}
          </Typography>
          <Slider data={allCategory}    allCat={true} />
        </Stack>
        <Products
          seller={false}
          hot={false}
          mode={false}
          top={true}
          data={topProducts}
          title={t("home.topProducts")}
        />
        <Products
          seller={false}
          mode={false}
          top={false}
          hot={false}
          data={products}
          title={t("home.newProducts")}
        />
        <Products
            top={false}
            hot={true}
          seller={false}
          mode={false}
          title={t("home.hotDeals")}
          data={hotDeals}
        />
        {stores.length > 0 && <Cards stores={stores} />}
        {brands.length > 0 && <BrandCards brands={brands} />}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Select a language</DialogTitle>
          <DialogContent>
            {!isMobile && (
              <TextField
                id="outlined-select-currency"
                select
                defaultValue={
                  i18n.language.includes("en") ? "English" : i18n.language
                }
                key={i18n.language}
                onChange={(e) => handleChangLang(e)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  width: "fit-content",
                }}
              >
                {languages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ maxHeight: "20px" }}>
                        <Flag code={option.code}></Flag>
                      </ListItemIcon>
                      <ListItemText sx={{ ml: 1 }}>
                        <b>{option.label}</b>
                      </ListItemText>
                    </div>
                  </MenuItem>
                ))}
              </TextField>
            )}
            {isMobile && (
              <TextField
                id="outlined-select-currency"
                select
                defaultValue={
                  i18n.language.includes("en") ? "English" : i18n.language
                }
                key={i18n.language}
                onChange={(e) => handleChangLang(e)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  width: "fit-content",
                }}
                SelectProps={{
                  MenuProps: {
                    sx: { maxHeight: "30%" },
                  },
                }}
              >
                {languages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ maxHeight: "20px" }}>
                        <Flag code={option.code}></Flag>
                      </ListItemIcon>
                      <ListItemText sx={{ ml: 1 }}>
                        <b>{option.label}</b>
                      </ListItemText>
                    </div>
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </MainHolder>
      <Footer />
    </>
  );
};

export default Home;
