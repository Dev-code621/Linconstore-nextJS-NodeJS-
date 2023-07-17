import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack, EditOutlined } from "@mui/icons-material";
import Head from "next/head";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Truncate from "../../Helpers/Truncate";
import Address from "./Address";
import CartList from "../Utils/CartList";
import Nav from "../Layouts/Nav";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/router";
import ContextApi from "../../Store/context/ContextApi";
import {
  useGetUserAddress,
  useHandleCheckout,
  useHandlePayment,
} from "../../hooks/useDataFetch";
import { CONTINENT_MAP } from "../../Data/countries";
import { useTranslation } from "react-i18next";
import { da } from "date-fns/locale";
import { useTokenRefetch } from "../../hooks/useRefresh";

let isFirst = false;
type IContinents = {
  africa: number;
  asia: number;
  oceania: number;
  southAmerica: number;
  northAmerica: number;
  europe: number;
  antarctica: number;
};
type TContinent = {
  continent: string;
  price: number;
};
interface IProduct {
  price: number;
  country: string;
}
type IShipping = {
  express: IProduct;
  standard: IProduct;
};
type TProducts = {
  title: string;
  shipping: IShipping[];
  price: number;
  photo: string[];
  // ratingId : TRating,
  _id: string;
  continents: IContinents[];
};

type TContact = {
  phoneNumber: number;
  address: string;
  country: string;
  type: string;
  lastName: string;
  firstName: string;
  _id: string;
  default: boolean;
};
type TVariant = {
  option: string;
  variant: string;
};
type TProduct = {
  name: string;
  photo: string;
  quantity: number;
  price: number;
  variants: TVariant[];
  productId: TProducts;
};

type TCart = {
  bill: number;
  products: TProduct[];
};
const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width: 450px)");
  const isMatches: boolean = useMediaQuery("(max-width: 353px)");
  const isResponsive: boolean = useMediaQuery("(max-width: 600px)");
  const isAddress: boolean = useMediaQuery("(max-width: 520px)")
  const [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false)
  const [stepper, setStepper] = useState<boolean>(false);
  const router = useRouter();
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && !isLoggedIn) router.back();

  }, [isLoggedIn]);
  const [shippingAddress, setShippingAddress] = useState<TContact>();
  const [billingAddress, setBillingAddress] = useState<TContact>();
  const onGetAddressSuccess = (data: TContact[]) => {
    const newShippingAddress = data.find((address) => address.default === true);
    setShippingAddress(newShippingAddress);
    const initialData = data.find((value) => value.type === "billing");
    setBillingAddress(initialData);
    setIsAddressUpdated(prevState => !prevState)
  };
  const [continent, setContinent] = useState<string>("");
  useEffect(() => {
    const initialCountry = shippingAddress?.country;
    const findContinent: string = CONTINENT_MAP.find(({ countries }) =>
      countries.includes(initialCountry)
    )?.continent;
    setContinent(findContinent);
  }, [shippingAddress]);

  const [type, setType] = useState<string>("");
  const { isLoading, refetch, isFetched } =
    useGetUserAddress(onGetAddressSuccess);
  const [editAddress, setEditAddress] = useState<any>();
  const updateAddress = (
    _id: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: number,
    country: string
  ) => {
    const myData = {
      _id,
      firstName,
      lastName,
      address,
      phoneNumber: phone,
      country,
    };
    setEditAddress(myData);
    setTimeout(() => {
      setStepper((cur) => !cur);
    }, 1000);
  };
  const handleRefetch = () => {
    refetch()

  };
  const [products, setProducts] = useState<TProduct[]>([]);
  const [bill, setBill] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const onCheckoutSuccess = (data: TCart) => {
    setProducts(data.products);
    setBill(data.bill);
    setIsLoaded((prevState) => !prevState);
  };
  const { isLoading: isChecking, data, refetch: refresh } = useHandleCheckout(onCheckoutSuccess);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  useTokenRefetch(refresh)
  const handleChecked = useCallback(
    (e: React.ChangeEvent) => {
      if (isFirst) {
        setTimeout(() => {
          if (!shippingAddress) return
          setIsChecked((prevState) => !prevState);
        }, 1000)
      }
      if (!shippingAddress) return

      setIsChecked((prevState) => !prevState);
    },
    [isChecked, isAddressUpdated]
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [value, setValue] = React.useState("Standard");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  useEffect(() => {
    if (billingAddress || isChecked) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [billingAddress, isChecked]);
  const paymentSuccess = (data: any) => {
    router.push(data.url);
  };

  const [shippingCost, setShippingCost] = useState<number>(0);
  const [expressCost, setExpressCost] = useState<number>(0);
  const handleBilling = () => {
    setType("billing");
    setStepper((cur) => !cur);
  };
  const [isFetching, setIsFetching] = useState<boolean>(false);
  useEffect(() => {
    const shippingPlaceholder: number[] = [];
    const expressPlaceholder: number[] = [];
    products.forEach((product) => {
      const shipping = product.productId.shipping;
      const continents = product.productId?.continents;
      const continentPlaceholder: TContinent[] = [];
      if (continents?.length > 0) {
        if (continents[0].africa) {
          const africa = {
            continent: "Africa",
            price: continents[0].africa,
          };
          continentPlaceholder.push(africa);
          const europe = {
            continent: "Europe",
            price: continents[0].europe,
          };
          continentPlaceholder.push(europe);
          const northAmerica = {
            continent: "North America",
            price: continents[0].northAmerica,
          };
          const southAmerica = {
            continent: "South America",
            price: continents[0].southAmerica,
          };
          continentPlaceholder.push(southAmerica);
          const asia = {
            continent: "Asia",
            price: continents[0].asia,
          };
          continentPlaceholder.push(asia);
          const antarctica = {
            continent: "Antarctica",
            price: continents[0].antarctica,
          };
          continentPlaceholder.push(antarctica);
          const priceData: TContinent = continentPlaceholder.find(
            (x) => x.continent === continent
          );
          shippingPlaceholder.push(priceData?.price);
          expressPlaceholder.push(priceData?.price);
        }
      }
      if (shipping?.length > 0) {
        if (shipping[0].standard.price) {
          shippingPlaceholder.push(shipping[0].standard.price);
          expressPlaceholder.push(shipping[0].express.price);
        }
      }
    });
    const shippingTotal: number = shippingPlaceholder.reduce(
      (a, b) => a + b,
      0
    );
    const shippingExpress: number = expressPlaceholder.reduce(
      (a, b) => a + b,
      0
    );
    setShippingCost(Number(shippingTotal.toFixed(2)));
    setExpressCost(Number(shippingExpress.toFixed(2)));
  }, [isFetching, products]);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsFetching((prevState) => !prevState);
    }, 700);
    return () => clearTimeout(timeOut);
  }, []);
  const handlePayment = () => {
    const shipping: number = value === "Standard" ? shippingCost : expressCost;
    const data = {
      shipping,
      type: value
    };
    pay(data);
  };
  const { isLoading: isPaying, mutate: pay } = useHandlePayment(paymentSuccess);
  useEffect(() => {
    const shipping: number = value === "Standard" ? shippingCost : expressCost;
    const totalBill: number = shipping + data?.bill;
    setBill(Number(totalBill.toFixed(2)));
  }, [value, shippingCost, expressCost]);
  return (
    <>
      {!stepper && (
        <>
          <Head>
            <title>Check out</title>
            <meta
              name={"Please proceed with your order"}
              content={
                "Please proceed your order " + "in purchase to complete order"
              }
            />
            <link rel="icon" href="/favicon-store.ico" />
          </Head>
          <Nav />
          <Container component="main" maxWidth={"md"}>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 3,
                padding: 3,
                marginBottom: 3,
                display: "flex",
                flexDirection: "column",
                // alignItems: 'center',
                // height: 600,
                justifyContent: "center",
              }}
            >
              <Stack direction={"row"} alignItems={"center"}>
                <Stack width={"45%"}>
                  <span>
                    <ArrowBack
                      onClick={() => router.back()}
                      className={"pointer"}
                    />
                  </span>
                </Stack>
                <Typography
                  textAlign={"center"}
                  gutterBottom
                  variant="h4"
                  component="h2"
                >
                  {t("checkout.page_title")}
                </Typography>
              </Stack>
              <Typography variant={"h6"} component={"p"}>
                {products.length} {t("checkout.items_label")}
                {isChecking && <CircularProgress />}
              </Typography>
              <Stack spacing={0} sx={{ my: 0 }}>
                {products.length > 0 &&
                  products.map(
                    (
                      { name, variants, photo, quantity, price, productId },
                      index
                    ) => (
                      <Box key={index + productId._id}>
                        <CartList
                          variants={variants}
                          amount={quantity * price}
                          title={
                            <Stack
                              sx={{
                                maxWidth: { xs: isMatches ? 80 : 100, sm: 300 },
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "left",
                              }}
                            >
                              <Typography
                                flexGrow={1}
                                sx={{ mr: 1 }}
                                variant={"body2"}
                              >
                                {Truncate(name, isResponsive ? 13 : 30)}
                              </Typography>
                              <Typography variant={"body2"}>
                                <b>{quantity}</b>
                              </Typography>
                            </Stack>
                          }
                          image={photo}
                        />
                        {index + 1 !== products.length && <Divider />}
                      </Box>
                    )
                  )}
              </Stack>
              <Typography variant={"h6"} mt={1}>
                {t("checkout.shipping_address_label")}
                {!shippingAddress && (
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography variant={"body2"}>
                      {t("checkout.status_label")}
                    </Typography>
                    <Button
                      variant={"contained"}
                      onClick={() => setStepper((cur) => !cur)}
                      className={"buttonClass"}
                    >
                      {t("checkout.btn_add_label")}
                    </Button>
                  </Stack>
                )}
              </Typography>
              {isLoading && <CircularProgress />}
              {isFetched && shippingAddress && (
                <Stack direction={"row"} my={1} spacing={2}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_name_field")}:
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_address_field")}:
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_country_field")}:
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {" "}
                      {t("checkout.data_phone_field")}:
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {shippingAddress.firstName}
                    </Typography>

                    <Typography
                      noWrap
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {isAddress
                        ? Truncate(shippingAddress.address, 24)
                        : shippingAddress.address}
                    </Typography>

                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {shippingAddress.country}
                    </Typography>
                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {shippingAddress.phoneNumber}
                    </Typography>
                  </Box>
                  {!isMobile && (
                    <EditOutlined
                      onClick={() =>
                        updateAddress(
                          shippingAddress._id,
                          shippingAddress.firstName,
                          shippingAddress.lastName,
                          shippingAddress.address,
                          shippingAddress.phoneNumber,
                          shippingAddress.country
                        )
                      }
                      className={"pointer"}
                      sx={{ color: "#54991D", maxHeight: "40px" }}
                    />
                  )}
                </Stack>
              )}
              {isMobile && (
                <EditOutlined
                  onClick={() => setStepper((cur) => !cur)}
                  className={"pointer"}
                  sx={{ color: "#54991D", maxHeight: "40px" }}
                />
              )}
              <Typography variant={"h6"} mt={1}>
                {t("checkout.billing_details_label")}
              </Typography>
              {isFetched && billingAddress && (
                <Stack direction={"row"} my={1} spacing={2}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_name_field")} :
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_address_field")}:
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_city_field")} :
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      {t("checkout.data_phone_field")} :
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {billingAddress.firstName}
                    </Typography>

                    <Typography
                      noWrap
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {isAddress
                        ? Truncate(billingAddress.address, 24)
                        : billingAddress.address}
                    </Typography>

                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {billingAddress.country}
                    </Typography>
                    <Typography
                      variant={"subtitle1"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {billingAddress.phoneNumber}
                    </Typography>
                  </Box>
                  {!isMobile && (
                    <EditOutlined
                      onClick={() =>
                        updateAddress(
                          billingAddress._id,
                          billingAddress.firstName,
                          billingAddress.lastName,
                          billingAddress.address,
                          billingAddress.phoneNumber,
                          billingAddress.country
                        )
                      }
                      className={"pointer"}
                      sx={{ color: "#54991D", maxHeight: "40px" }}
                    />
                  )}
                </Stack>
              )}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography mt={1} variant={"subtitle2"}>
                  {isFetched && !billingAddress && t("checkout.warning_label")}
                </Typography>
                <Button
                  variant={"contained"}
                  onClick={handleBilling}
                  className={"buttonClass"}
                >
                  {t("checkout.btn_add_label")}
                </Button>
              </Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={isChecked}
                    onChange={handleChecked}
                    aria-required={true}
                  />
                }
                aria-required={true}
                label={
                  <Typography variant={"subtitle2"}>
                    {t("checkout.checkout_label")}
                  </Typography>
                }
              />
              <Typography variant={"h6"}>{t("checkout.code_title")}</Typography>
              <TextField
                id="coupon"
                label={t("checkout.code_label")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant={"contained"}
                        className={"buttonClass"}
                        sx={{ mb: 2, position: "absolute", right: "0px" }}
                      >
                        {t("checkout.btn_use_label")}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
              {/*beginning of shipping section*/}
              <Stack my={1}>
                <Typography variant={"h6"}>
                  {t("checkout.shipping_method_label")}
                </Typography>
                <FormControl>
                  <FormLabel id="Shipping" />
                  <RadioGroup
                    aria-labelledby="payment"
                    name="payment"
                    value={value}
                    onChange={handleChange}
                    sx={{ alignItems: "start" }}
                  >
                    <FormControlLabel
                      value="Standard"
                      control={
                        <Radio
                          sx={{
                            "&, &.Mui-checked": {
                              color: "#54991D",
                            },
                          }}
                        />
                      }
                      label={
                        <>
                          <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            spacing={2}
                          >
                            <Stack sx={{ pt: 1 }}>
                              <Typography variant={"body1"}>
                                {t("checkout.standard_item_label")}
                              </Typography>
                              <Typography variant={"caption"}>
                                {t("checkout.period_label")}
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{ position: "absolute", right: "0px" }}
                              variant={"body1"}
                            >
                              ${shippingCost}
                            </Typography>
                          </Stack>
                        </>
                      }
                    />
                    <FormControlLabel
                      value="Express"
                      control={
                        <Radio
                          sx={{
                            "&, &.Mui-checked": {
                              color: "#54991D",
                            },
                          }}
                        />
                      }
                      label={
                        <>
                          <Stack direction={"row"} spacing={2}>
                            <Stack>
                              <Typography variant={"body1"}>Express</Typography>
                              <Typography variant={"caption"}>
                                {t("checkout.period_check")}
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{ position: "absolute", right: "0px" }}
                              variant={"body1"}
                            >
                              ${expressCost}
                            </Typography>
                          </Stack>
                        </>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              {/*<Stack direction={'row'} justifyContent={'space-between'}>*/}
              {/*    <Typography variant={'h6'} component={'p'}>*/}
              {/*    Payment Type*/}
              {/*    </Typography>*/}
              {/*    <u><Typography gutterBottom sx={{mt:1, mx:2}}  variant={'body1'} color={'text.secondary'}>Add</Typography> </u>*/}
              {/*    </Stack>*/}
              {/*    <FormControl >*/}
              {/*    <FormLabel id="Payment"/>*/}
              {/*    <RadioGroup*/}
              {/*    aria-labelledby="payment"*/}
              {/*    name="payment"*/}
              {/*    sx={{alignItems: 'start'}}*/}
              {/*    >*/}
              {/*    <FormControlLabel*/}
              {/*    value="Credit Card / Debit Card"*/}
              {/*    control={<Radio sx={{position: 'absolute', right: '0px',*/}
              {/*    '&, &.Mui-checked': {*/}
              {/*    color: '#54991D',*/}
              {/*}}} />}*/}
              {/*    label={<>*/}
              {/*    <Stack direction={'row'} spacing={2} mx={2}>*/}
              {/*    <FontAwesomeIcon fontSize={'large'} style={{marginTop: '4px'}} icon={faCreditCard}/>*/}
              {/*    <Typography variant={'body1'}>*/}
              {/*    Credit / Debit Card*/}
              {/*    </Typography>*/}

              {/*    </Stack>*/}
              {/*    </>*/}
              {/*}*/}
              {/*    labelPlacement="end"*/}
              {/*    />*/}
              {/*/!*<Paper elevation={0} sx={{mx:2, minWidth: '96%', borderBottom: '0.3px solid black'}}></Paper>*!/*/}
              {/*    <FormControlLabel*/}
              {/*    value="Apple Pay"*/}
              {/*    control={<Radio  sx={{position: 'absolute', right: '0px',*/}
              {/*    '&, &.Mui-checked': {*/}
              {/*    color: '#54991D',*/}
              {/*}}}*/}
              {/*    />}*/}
              {/*    label={*/}
              {/*    <Stack direction={'row'}  my={0.5} mx={2} spacing={2} >*/}
              {/*    <FontAwesomeIcon fontSize={'large'} style={{marginTop: '4px'}} icon={faApplePay}/>*/}
              {/*    <Typography  variant={'body1'}>*/}
              {/*    Apple Pay*/}
              {/*    </Typography>*/}

              {/*    </Stack>*/}
              {/*}*/}
              {/*    labelPlacement="end"*/}
              {/*    />*/}
              {/*/!*<Paper elevation={0} sx={{mx:2, minWidth: '96%', borderBottom: '0.3px solid black'}}></Paper>*!/*/}

              {/*    <FormControlLabel*/}
              {/*    value="Paypal"*/}
              {/*    control={<Radio  sx={{position: 'absolute', right: '0px', '&, &.Mui-checked': {*/}
              {/*    color: '#54991D',*/}
              {/*}}}/>}*/}
              {/*    label={*/}
              {/*    <Stack direction={'row'} mx={2} my={0.5}  spacing={2}>*/}
              {/*    <FontAwesomeIcon fontSize={'large'} style={{marginTop: '4px'}} icon={faCcPaypal} />*/}
              {/*    <Typography variant={'body1'}>*/}
              {/*    Paypal*/}
              {/*    </Typography>*/}
              {/*    </Stack>*/}
              {/*}*/}
              {/*    labelPlacement="end"*/}
              {/*    />*/}
              {/*    </RadioGroup>*/}
              {/*    </FormControl>*/}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant={"h6"}>
                  {t("checkout.subtotal_label")}
                </Typography>
                <Typography variant={"h6"}>
                  ${Number(data?.bill?.toFixed(2))}
                </Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant={"h6"}>
                  {value} {t("checkout.shipping_label")}
                </Typography>
                <Typography variant={"h6"}>
                  ${value === "Standard" ? shippingCost : expressCost}
                </Typography>
              </Stack>
              {/*<Stack direction={'row'} justifyContent={'space-between'}>*/}
              {/*<Typography variant={'subtitle2'}> Taxes </Typography>*/}
              {/*<Typography variant={'h6'}> $1.50</Typography>*/}
              {/*</Stack>*/}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant={"h6"}>
                  {t("checkout.total_price_label")}:
                </Typography>
                <Typography variant={"h6"}> ${bill}</Typography>
              </Stack>
              <Button
                size={"medium"}
                type={"submit"}
                onClick={handlePayment}
                disabled={isPaying || isDisabled}
                variant={"contained"}
                className={"buttonClass"}
              >
                {t("checkout.pay_with_stripe")}
                {isPaying && <CircularProgress />}
              </Button>
            </Box>
          </Container>
        </>
      )}
      {stepper && (
        <Address
          type={type}
          setType={setType}
          setEditAddress={setEditAddress}
          editAddress={editAddress}
          handleRefetch={handleRefetch}
          setStepper={setStepper}
        />
      )}
    </>
  );
};
export default Checkout;
