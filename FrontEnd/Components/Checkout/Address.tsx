import React, {useCallback, useEffect, useMemo, useState} from "react";
import Wrapper from "../Wappers/Container";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import {
  Autocomplete,
  CircularProgress,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { addAddressDefaultValue } from "../../Helpers/Types";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ArrowBack, EditOutlined, SearchOutlined } from "@mui/icons-material";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { CountryDropdown } from "react-country-region-selector";
import GenNav from "../Layouts/GenNav";
import {
  useGetUserAddress, useUpdateDefault,
  useUpdateUserAddress,
  useUserPostAddress,
  useUserPostBillAddress,
} from "../../hooks/useDataFetch";
import Truncate from "../../Helpers/Truncate";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";

const schema = yup.object().shape({
  firstName: yup.string().required().min(3),
  lastName: yup.string().required().min(3),
  country: yup.string().required().min(1),
  phoneInput: yup
    .mixed()
    .required("You Must input your phone number")
    .test("is-valid-phone", "Phone number is not valid", (value) => {
      if (value) {
        return isValidPhoneNumber(value);
      }
      return false;
    }),
  address: yup.string().required("You must input your address").nullable(),
});
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
interface Iaddress {
  setStepper: React.Dispatch<React.SetStateAction<boolean>>;
  setEditAddress: React.Dispatch<React.SetStateAction<any>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  editAddress: any;
  type: string;
  handleRefetch: () => void;
}

const Address: React.JSXElementConstructor<Iaddress> = ({
  setType,
  type,
  setStepper,
  handleRefetch,
  editAddress,
  setEditAddress,
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm<addAddressDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      country: "",
      phoneInput: "",
    },
  });

  // React.useEffect(() => {
  //     if(isSuccess){
  //         reset()
  //     }
  //     if(isError && !isSuccess){
  //         reset()
  //     }
  // }, [isSuccess, isError])
  useEffect(() => {
    if (editAddress) {
      reset(editAddress);
    }
  }, [editAddress]);
  const onSubmit: SubmitHandler<addAddressDefaultValue> = async (data) => {
    const { address, firstName, lastName, country, phoneInput } = data;
    const addressData = {
      address,
      default: true,
      firstName,
      lastName,
      country,
      phoneNumber: phoneInput,
    };
    if (editAddress?.address) {
      const newAddress = {
        ...addressData,
        id: editAddress?._id,
      };
      return updateAddress(newAddress);
    }
    if (type === "billing") {
      return addBill(addressData);
    }
    AddAddress(addressData);
  };
  const onUpdateSuccess = () => {
    reset();
    setEditAddress({});
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const [defaultId, setDefaultId] = useState<string>("");

  const onAddSuccess = () => {
    reset();
    setEditAddress({});
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const onAddBillSuccess = () => {
    reset();
    setEditAddress({});
    setType("");
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const { isLoading: isBilling, mutate: addBill } =
    useUserPostBillAddress(onAddBillSuccess);
  const { isLoading: isAdding, mutate: AddAddress } =
    useUserPostAddress(onAddSuccess);
  const { isLoading: isUpdating, mutate: updateAddress } =
    useUpdateUserAddress(onUpdateSuccess);
  const [shippingAddress, setSetShippingAddress] = useState<TContact[]>([]);
  const handleBack = () => {
    setStepper((cur) => !cur);
    setEditAddress({});
  };
  const onGetAddressSuccess = (data: TContact[]) => {
    const newShippingAddress = data.filter(
      (address) => address.default !== true
    );
    setSetShippingAddress(newShippingAddress);
  };
  const setDefault = useCallback((id: string) => {
    const data = {
      id
    };
    updateDefault(data);
  }, [defaultId]);
  const onHandleDefault = useCallback(
      (id: string) => {
        setDefaultId(id);
        setTimeout(() => {
          setDefault(id);
        }, 1000);
      },
      [defaultId]
  );
  const { isLoading, refetch, isFetched } =
    useGetUserAddress(onGetAddressSuccess);

    useTokenRefetch(refetch)
  const isMatches: boolean = useMediaQuery("(max-width: 353px)");
  const { t } = useTranslation();
  const onDefaultSuccess = () => {
    handleRefetch();
    setTimeout(() => {
      setStepper((cur) => !cur);
    }, 1000);
  };
  const { isLoading: isDefaulting, mutate: updateDefault } =
      useUpdateDefault(onDefaultSuccess);
  return (
    <>
      <GenNav admin={false} mode={false} />
      <Wrapper
        title={t("address.wrapper_title")}
        content={t("address.wrapper_content")}
        description={t("address.wrapper_description")}
      >
        <span>
          <ArrowBack onClick={() => handleBack()} className={"pointer"} />
        </span>
        <Typography variant={"h5"} textAlign={"center"}>
          {type === "billing"
            ? t("address.billing_title")
            : t("address.shipping_title")}{" "}
          {t("address.address_label")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                variant={"standard"}
                {...field}
                type={"text"}
                label={t("address.firstName_label")}
                name={"First Name"}
                autoComplete={"First Name"}
              />
            )}
          />
          {errors.firstName && (
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {t("address.firstName_helper_text")}
            </FormHelperText>
          )}
          <Controller
            control={control}
            name="lastName"
            render={({ field, formState: { errors } }) => (
              <TextField
                margin="normal"
                required
                fullWidth
                variant={"standard"}
                {...field}
                type={"text"}
                label={t("address.lastName_label")}
                name={"Last Name"}
                autoComplete={"Last Name"}
              />
            )}
          />
          {errors.lastName && (
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {t("address.lastName_helper_text")}
            </FormHelperText>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <CountryDropdown id={"country"} {...field} />
                )}
              />
              {errors.country && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors?.country?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phoneInput"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    style={{ border: "0px" }}
                    {...field}
                    defaultCountry="US"
                    id="phoneInput"
                    placeholder={t("address.phone_number_placeholder")}
                  />
                )}
              />
              {errors.phoneInput && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors?.phoneInput?.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Controller
            control={control}
            name="address"
            // defaultValue={''}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Autocomplete
                id="address"
                options={["Address 1", "Address 2", "Address 3"]}
                // getOptionLabel={(address) => address}
                autoSelect
                // @ts-ignore
                value={value}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    sx={{ mt: 2 }}
                    {...params}
                    label={t("address.lookup_label")}
                    variant="standard"
                    required
                    error={!!errors?.address}
                    helperText={errors?.address?.message}
                    placeholder="Start typing your address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                onChange={(e, data) => onChange(data)}
              />
            )}
          />
          <Button
            className={"buttonClass"}
            disabled={isAdding || isUpdating}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#54991D" }}
          >
            {isAdding || isUpdating || (isBilling && <CircularProgress />)}
            {t("address.btn_save_label")}
          </Button>
          {isLoading && (
            <Typography textAlign={"center"}>
              {" "}
              <CircularProgress />{" "}
            </Typography>
          )}
          {shippingAddress.length > 0 &&
            shippingAddress.map(
              (
                { address, _id, firstName, lastName, country, phoneNumber },
                index
              ) => (
                <Box key={index} sx={{ display: "flex", flexDirection: "row" }} >
                  <Stack direction={"row"} my={1} sx={{flexGrow:0.5}} spacing={2} >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant={"subtitle1"}>
                        {" "}
                        {t("address.data_name_field")} :{" "}
                      </Typography>
                      <Typography variant={"subtitle1"}>
                        {" "}
                        {t("address.data_address_field")}:
                      </Typography>
                      <Typography variant={"subtitle1"}>
                        {" "}
                        {t("address.data_city_field")} :{" "}
                      </Typography>
                      <Typography variant={"subtitle1"}>
                        {" "}
                        {t("address.data_phone_field")} :{" "}
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
                        {" "}
                        {firstName}{" "}
                      </Typography>

                      <Typography
                        noWrap
                        variant={"subtitle1"}
                        sx={{ fontWeight: "bold" }}
                      >
                        {" "}
                        {isMatches ? Truncate(address, 14) : address}
                      </Typography>

                      <Typography
                        variant={"subtitle1"}
                        sx={{ fontWeight: "bold" }}
                      >
                        {" "}
                        {country}{" "}
                      </Typography>
                      <Typography
                        variant={"subtitle1"}
                        sx={{ fontWeight: "bold" }}
                      >
                        {" "}
                        {phoneNumber}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button variant={'contained'} sx={{height: '34px'}} onClick={() => onHandleDefault(_id)} disabled={isDefaulting} >
                    {defaultId === _id && isDefaulting && <CircularProgress/>}
                    Select </Button>
                </Box>
              )
            )}
        </Box>
      </Wrapper>
    </>
  );
};
export default React.memo(Address);
