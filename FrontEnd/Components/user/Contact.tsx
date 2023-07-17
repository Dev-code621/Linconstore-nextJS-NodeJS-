import React, { useCallback, useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  Divider,
  FormHelperText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { AddOutlined, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import {
  useDeleteAddress,
  useGetUserAddress,
  useGetUserAddressOnRefetch,
  useUpdateDefault,
  useUpdateUserAddress,
  useUserPostAddress,
} from "../../hooks/useDataFetch";
import { CountryDropdown } from "react-country-region-selector";
import { useTranslation } from "react-i18next";

type changeAddress = {
  address: string;
  phone: string;
  name: string;
  country: string;
};
type addContact = {
  name: string;
  phone: number;
  address: string;
  country: string;
};
type TContact = {
  phoneNumber: number;
  address: string;
  firstName: string;
  _id: string;
  default: boolean;
  country: string;
};
const Contact: React.FC = () => {

  const { t } = useTranslation();

  const schema = yup.object().shape({
    address: yup.string().required(t("account.contact.require_text")).min(6),
    phone: yup
      .number()
      .typeError(t("account.contact.type_error"))
      .required(t("account.contact.require_text"))
      .min(11),
    name: yup.string().required(t("account.contact.require_text")).min(6),
    country: yup.string().required().min(1),
  });

  const schema1 = yup.object().shape({
    phone: yup
      .number()
      .typeError(t("account.contact.type_error"))
      .required(t("account.contact.require_text"))
      .min(11),
    name: yup.string().required(t("account.contact.require_text")).min(6),
    address: yup.string().required(t("account.contact.require_text")).min(10),
    country: yup.string().required().min(1),
  });

  const { handleSubmit, control, reset } = useForm<changeAddress>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      phone: "",
      name: "",
      country: "",
    },
  });
  const onSubmit: SubmitHandler<changeAddress> = async (data) => {
    const { address, name, phone, country } = data;
    const newData = {
      address: address,
      firstName: name,
      phoneNumber: phone,
      country,
      id: currentId,
    };
    updateAddress(newData);
    reset();
  };
  const [changeAddress, setChangeAddress] = useState(false);
  const [addContact, setAddContact] = useState(false);

  const {
    handleSubmit: handlePhoneSubmit,
    control: controlPhone,
    reset: resetPhone,
    formState: { errors },
  } = useForm<addContact>({
    resolver: yupResolver(schema1),
    mode: "onBlur",
    defaultValues: {
      phone: 0,
      name: "",
      address: "",
      country: "",
    },
  });
  const addPhoneHandler: SubmitHandler<addContact> = async (data) => {
    const newData = {
      phoneNumber: data.phone,
      firstName: data.name,
      address: data.address,
      country: data?.country,
    };
    AddAddress(newData);
  };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 400px)");
  const router = useRouter();

  const [addresses, setAddress] = useState<TContact[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<TContact[]>([]);
  const [otherAddress, setOtherAddress] = useState<TContact[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [defaultId, setDefaultId] = useState<string>("");
  const onSuccess = (data: TContact[]) => {
    if (data.length === 0) {
      setAddContact(true);
    }
    const newArray = data.filter((add) => add.default);
    setDefaultAddress(newArray);
    const OtherArray = data?.filter((add) => !add.default);
    setOtherAddress(OtherArray);
  };
  const onAddSuccess = () => {
    resetPhone();
    setAddContact(false);
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  const onUpdateSuccess = () => {
    setChangeAddress(false);
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  const handleChangeAddress = (id: string) => {
    setChangeAddress(true);
    setCurrentId(id);
  };
  const onDeleteSuccess = () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  const onHandleDelete = () => {
    deleteAddress();
  };
  const deleteAddressHandler = (id: string) => {
    setDeleteId(id);
    onHandleDelete();
  };
  const onDefaultSuccess = () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  const setDefault = useCallback(() => {
    const data = {
      id: defaultId,
    };
    updateDefault(data);
  }, [defaultId]);
  const onHandleDefault = useCallback(
    (id: string) => {
      setDefaultId(id);
      setTimeout(() => {
        setDefault();
      }, 1000);
    },
    [defaultId]
  );
  const [deleteId, setDeleteId] = useState<string>("");
  const { isLoading: isUpdating, mutate: updateAddress } =
    useUpdateUserAddress(onUpdateSuccess);
  const { data, isLoading, refetch } = useGetUserAddressOnRefetch(onSuccess);
    useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const { isLoading: isAdding, mutate: AddAddress } =
    useUserPostAddress(onAddSuccess);
  const { isLoading: isDeleting, mutate: deleteAddress } = useDeleteAddress(
    onDeleteSuccess,
    deleteId
  );
  const { isLoading: isDefaulting, mutate: updateDefault } =
    useUpdateDefault(onDefaultSuccess);
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px", minHeight: "100vh" }}>
        <Wrapper title={"Add Address"} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontSize={isMobile && "1 rem"}
                  sx={{ my: 1 }}
                >
                  {t("account.contact.contact_information")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"main"} maxWidth={"lg"}>
              <Box sx={{ p: "0 !important", maxWidth: "600px" }}>
                {isLoading && <CircularProgress />}
                {defaultAddress?.length > 0 &&
                  defaultAddress?.map(
                    ({ address, firstName, phoneNumber, country }, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", flexDirection: "column", p: 3 }}
                      >
                        <Typography variant={isMobile ? "body1" : "h6"}>
                          {t("account.contact.contact_name")} : {firstName}
                        </Typography>
                        <Typography variant={isMobile ? "body1" : "h6"}>
                          {t("account.contact.phone_number")} : {phoneNumber}
                        </Typography>
                        <Typography variant={isMobile ? "body1" : "h6"}>
                          {t("account.contact.contact_address")} : {address}
                        </Typography>
                        <Typography variant={isMobile ? "body1" : "h6"}>
                          {t("account.contact.contact_country")} : {country}
                        </Typography>
                      </Box>
                    )
                  )}
                <Divider sx={{ bgcolor: "#000", borderWidth: "1px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    justifyContent: "center",
                  }}
                >
                  {otherAddress.length > 0 &&
                    otherAddress.map(
                      (
                        { address, firstName, phoneNumber, _id, country },
                        index
                      ) => (
                        <Box key={_id}>
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: isMatches ? "column" : "row",
                              p: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant={isMobile ? "body1" : "h6"}
                              sx={{ p: 0.4 }}
                            >
                              {t("account.contact.contact_name")} : {firstName}
                            </Typography>
                            <Button
                              variant={"outlined"}
                              color={"inherit"}
                              onClick={() => deleteAddressHandler(_id)}
                              disabled={isDeleting}
                              className={"colorReversed"}
                            >
                              {t("account.contact.btn_delete")}
                              {isDeleting && deleteId === _id && (
                                <CircularProgress />
                              )}
                            </Button>
                          </Stack>
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: isMatches ? "column" : "row",
                              p: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant={isMobile ? "body1" : "h6"}>
                              {t("account.contact.phone_number")} :{phoneNumber}
                            </Typography>
                            <Button
                              variant={"outlined"}
                              color={"inherit"}
                              className={"colorReversed"}
                              onClick={() => onHandleDefault(_id)}
                            >
                              {isDefaulting && defaultId === _id && (
                                <CircularProgress />
                              )}
                              {t("account.contact.btn_setDefault")}
                            </Button>
                          </Stack>
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: isMatches ? "column" : "row",
                              p: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant={isMobile ? "body1" : "h6"}>
                              {t("account.contact.country_list")} : {country}
                            </Typography>
                          </Stack>
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: isMatches ? "column" : "row",
                              p: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant={isMobile ? "body1" : "h6"}>
                              {address}
                            </Typography>
                            {!changeAddress && (
                              <Button
                                variant={"outlined"}
                                color={"inherit"}
                                onClick={() => handleChangeAddress(_id)}
                                className={"colorReversed"}
                              >

                                {t("account.contact.btn_edit")}
                              </Button>
                            )}
                          </Stack>
                          {changeAddress && currentId === _id && (
                            <Box
                              component={"form"}
                              onSubmit={handleSubmit(onSubmit)}
                              noValidate
                            >
                              <Controller
                                name="name"
                                defaultValue={firstName}
                                control={control}
                                render={({ field, formState: { errors } }) => (
                                  <TextInput
                                    data={errors?.name}
                                    field={field}
                                    id="Name"
                                  />
                                )}
                              />
                              <Controller
                                name="phone"
                                control={control}
                                render={({ field, formState: { errors } }) => (
                                  <TextInput
                                    data={errors?.phone}
                                    field={field}
                                    id="Phone"
                                    type={"number"}
                                  />
                                )}
                              />
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
                              <Controller
                                name="address"
                                defaultValue={address}
                                control={control}
                                render={({ field, formState: { errors } }) => (
                                  <TextInput
                                    data={errors?.address}
                                    field={field}
                                    id="Address"
                                  />
                                )}
                              />

                              <Button
                                variant={"outlined"}
                                type={"submit"}
                                color={"inherit"}
                                className={"colorReversed"}
                                disabled={isLoading}
                              >
                                {isUpdating && <CircularProgress />}{" "}
                                {t("account.contact.btn_update")}
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )
                    )}
                  {addContact && (
                    <Box
                      component={"form"}
                      onSubmit={handlePhoneSubmit(addPhoneHandler)}
                      noValidate
                    >
                      <Controller
                        name="name"
                        control={controlPhone}
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.name}
                            field={field}
                            id={t("account.contact.data_name")}
                          />
                        )}
                      />
                      <Controller
                        name="phone"
                        control={controlPhone}
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.phone}
                            field={field}
                            id={t("account.contact.data_phone")}
                            type={"number"}
                          />
                        )}
                      />
                      <Controller
                        control={controlPhone}
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
                      <Controller
                        name="address"
                        control={controlPhone}
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.address}
                            field={field}
                            id={t("account.contact.data_address")}
                          />
                        )}
                      />
                      <Button
                        variant={"outlined"}
                        type={"submit"}
                        color={"inherit"}
                        className={"colorReversed"}
                        disabled={isAdding}
                      >
                        {isAdding && <CircularProgress />}{" "}
                        {t("account.contact.btn_add")}
                      </Button>
                    </Box>
                  )}
                </Box>

                {!addContact && (
                  <Button
                    variant={"outlined"}
                    onClick={() => setAddContact(true)}
                    color={"inherit"}
                    sx={{ mt: 2, maxWidth: 190 }}
                    startIcon={<AddOutlined />}
                    className={"colorReversed"}
                  >
                    {t("account.contact.btn_addaddress")}
                  </Button>
                )}
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default Contact;
