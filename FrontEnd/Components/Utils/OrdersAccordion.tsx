import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CircularProgress,
  FormHelperText,
  Grid,
  ListItem,
  ListItemIcon,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  PolicyOutlined,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../TextInput";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useUpdateOrder } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import {useCallback, useContext, useEffect, useState} from "react";
import getDate, { reCreateDate } from "../../Helpers/getDate";
import {
  addAddress,
  addAddressDefaultValue,
  IAdminProducts,
  IUser,
  IVariants,
} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import ContextApi from "../../Store/context/ContextApi";

interface IOrders {
  userId: IUser;
  productId: IAdminProducts;
  _id: string;
  status: string;
  active: boolean;
  variants: IVariants[];
  address: string;
  type: string;
  shipping: string;
  shippingProvider: string;
  trackingId: string;
  quantity: number;
  createdAt: Date;
}
interface INewOrders {
  order: IOrders;
  address: addAddress;
}
type Iupdate = {
  shipping: string;
  id: string;
  key: number;
};
const schema = yup.object().shape({
  shipping: yup.string().required(),
  id: yup.string().required(),
});
const OrdersAccordion: React.FC<INewOrders> = ({ order, address }) => {
  const {
    createdAt,
    productId,
    userId,
    _id,
    quantity,
    variants,
    shipping,
    trackingId,
    shippingProvider,
    status,
    type,
    active,
  } = order;
  const title = productId?.title;
  const firstName = userId?.firstName;
  const lastName = userId?.lastName;
  const orderId = _id;
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<Iupdate>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      shipping: "",
      id: "",
    },
  });
  const router = useRouter();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<Iupdate> = (data) => {
    const { id, shipping } = data;
    const update = {
      trackingId: id,
      shippingProvider: shipping,
      status: "processed",
      id: orderId,
    };
    updateOrder(update);
  };
  const updateOrderToShipped = useCallback(() => {
    const data = {
      status: "shipped",
      id: orderId,
    };
    updateOrder(data);
  }, []);
  const [validName, setValidName] = useState<boolean>(false);
  useEffect(() => {
    if (firstName === undefined || lastName === undefined)
      return setValidName(false);

    setValidName(true);
  }, [firstName, lastName]);
  const onUpdateSuccess = () => {
    reset();
    if (checked) return router.push("/seller/ordershipped");
    router.push("/seller/orderprocessed");
  };
  const {
    isLoading,
    mutate: updateOrder,
    isError,
    error,
  } = useUpdateOrder(onUpdateSuccess);
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prevState) => !prevState);
    updateOrderToShipped();
  };
  useEffect(() => {
    if (error instanceof Error) {
      //  @ts-ignore
      setErrorMessage(error?.response?.data?.status);
    }
  }, [isError]);
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  return (
    <Accordion sx={{ border: "2px solid black", my: 2 }}>
      <AccordionSummary
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper": {
            transition: "none",
            "&.Mui-expanded": {
              transform: "none",
            },
          },
        }}
        expandIcon={
          <Stack direction={"row"}>
            <Typography
              sx={{ mt: isMobile ? 0.6 : 0 }}
              variant={isMobile ? "body2" : "h6"}
            >
              {t("seller.orderProcessed.detail.btn_view")}
            </Typography>
            {type === "shipped" && (
              <Stack spacing={0.5}>
                <Box /> <CheckBoxOutlined sx={{ mt: 5 }} />
              </Stack>
            )}
            {type === "processed" && (
              <Stack spacing={0.5}>
                <Box /> <CheckBoxOutlineBlank sx={{ mt: 5 }} />
              </Stack>
            )}
          </Stack>
        }
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Grid container>
          <Grid item xs={8} md={9} lg={10}>
            <Typography variant={isMobile ? "body2" : "h6"}>
              {t("seller.orderProcessed.detail.order_id")} : {orderId}
            </Typography>
          </Grid>
          {/*<Grid item xs={4}  md={3} lg={2}> <Typography variant={isMobile ? 'body2' : 'h6'}  >{validName && firstName + ' ' +  lastName} {status === 'cancelled' && '- cancelled'} </Typography>   </Grid>*/}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} sm={6} md={3}>
            <Stack>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_name")} -{" "}
                {address?.firstName}
              </Typography>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_address")} -{" "}
                {address?.address}
              </Typography>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_country")} -{" "}
                {address?.country}
              </Typography>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_phone")}-{" "}
                {address?.phoneNumber}
              </Typography>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_shipping")} - {shipping}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <RadioButtonUnchecked />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${title ? title : ""} - ${quantity}`}
                  />
                  <ListItemText secondary={reCreateDate(createdAt)} />
                </ListItemButton>
              </ListItem>
              {/*<ListItem disablePadding>*/}
              {/*    <ListItemButton>*/}
              {/*        <ListItemIcon>*/}
              {/*            <RadioButtonUnchecked />*/}
              {/*        </ListItemIcon>*/}
              {/*        <ListItemText primary="2 XL Shirt" />*/}
              {/*    </ListItemButton>*/}
              {/*</ListItem>*/}
              {/*<ListItem disablePadding>*/}
              {/*    <ListItemButton>*/}
              {/*        <ListItemIcon>*/}
              {/*            <RadioButtonUnchecked />*/}
              {/*        </ListItemIcon>*/}
              {/*        <ListItemText primary="49 Black Nike Shoe" />*/}
              {/*    </ListItemButton>*/}
              {/*</ListItem>*/}
            </List>
          </Grid>
          {variants.length > 0 && (
            <Stack spacing={2} sx={{ mx: 2 }}>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.order_variants")}
              </Typography>
              <Typography
                variant={"body2"}
              >{`${variants[0].variant}  - ${variants[0].option}`}</Typography>
              <Typography variant={"body2"}>
                {variants.length > 1 &&
                  `${variants[1].variant} - ${variants[1].option}`}
              </Typography>
            </Stack>
          )}
          {shippingProvider !== "" && (
            <Stack spacing={2}>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.shipping_provider")}
                {shippingProvider}
              </Typography>
              <Typography variant={"body1"}>
                {t("seller.orderProcessed.detail.tracking_id")} {trackingId}
              </Typography>
            </Stack>
          )}
          {status !== "shipped" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1 }}
              >
                <Typography variant={"h6"}>
                  {t("seller.orderProcessed.detail.update_order")}
                  {type === "processed" && (
                    <Checkbox checked={checked} onChange={onChange} />
                  )}
                </Typography>
                <Controller
                  name="shipping"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      data={errors?.shipping}
                      field={field}
                      id="Shipping Provider"
                    />
                  )}
                />
                <Controller
                  name="id"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      data={errors?.id}
                      field={field}
                      id="Tracking id"
                    />
                  )}
                />
                {isError && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errorMessage}
                  </FormHelperText>
                )}

                <Button
                  variant={"outlined"}
                  disabled={
                    !active || status === "cancelled" || type === "shipped" || !sellerIsActive
                      ? !isValid
                      : false
                  }
                  type={"submit"}
                  className={"colorReversed"}
                >
                  {t("seller.orderProcessed.detail.btn_update")}
                  {isLoading && <CircularProgress />}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default OrdersAccordion;
