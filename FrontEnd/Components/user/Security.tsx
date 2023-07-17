import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import GenNav from "../Layouts/GenNav";
import {
  useChangeUserPassword,
  useChangeUserPhone,
  useGetUser,
} from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
  password: yup.string().required("This is required").min(6),
  new_password: yup.string().required("This is required").min(6),
});
const schema1 = yup.object().shape({
  phone: yup
    .number()
    .typeError("must be a number")
    .required("This is required")
    .min(11),
});
type changePassword = {
  password: string;
  new_password: string;
};
type addPhone = {
  phone: number;
};
const Security: React.FC = () => {
  const { t } = useTranslation();

  const { handleSubmit, control, reset } = useForm<changePassword>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      new_password: "",
    },
  });
  const onSubmit: SubmitHandler<changePassword> = async (data) => {
    const { password, new_password } = data;
    const newData = {
      oldPassword: password,
      newPassword: new_password,
    };
    updatePassword(newData);
  };
  const dispatch = useDispatch();
  const onSuccess = () => {
    reset();
    dispatch(
      snackBarOpen({
        message: "password successfully updated",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setChangePassword(false);
  };
  const {
    mutate: updatePassword,
    isError,
    isLoading,
  } = useChangeUserPassword(onSuccess);
  const [changePassword, setChangePassword] = useState(false);
  const [addPhone, setAddPhone] = useState(false);
  const { data, isLoading: isGetting, refetch } = useGetUser();

  const {
    handleSubmit: handlePhoneSubmit,
    control: controlPhone,
    reset: resetPhone,
  } = useForm<addPhone>({
    resolver: yupResolver(schema1),
    mode: "onBlur",
    defaultValues: {
      phone: 0,
    },
  });
  const addPhoneHandler: SubmitHandler<addPhone> = async (data) => {
    updatePhone(data);
  };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 400px)");
  const onAddPhoneSuccess = () => {
    resetPhone();
    refetch();
    dispatch(
      snackBarOpen({
        message: "phone successfully updated",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setAddPhone(false);
  };
  const {
    mutate: updatePhone,
    isError: phoneIsError,
    isLoading: isUpdating,
  } = useChangeUserPhone(onAddPhoneSuccess);
  const router = useRouter();
  useEffect(() => {
    if (isError || phoneIsError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong",
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, [isError, phoneIsError]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper title={"Security"} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography variant={isMobile ? "h6" : "h5"} fontSize={isMobile && '1rem'}>
                  {t("account.Security.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"article"} maxWidth={"md"} sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  justifyContent: "center",
                }}
              >
                <Typography variant={isMobile ? "body1" : "h6"}>
                  {t("account.Security.email")} : {data?.email}
                </Typography>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: isMatches ? "column" : "row",
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant={isMobile ? "body1" : "h6"}>
                    {t("account.Security.password")} : xxxxxxxxxx
                  </Typography>
                  {!changePassword && (
                    <Button
                      variant={"outlined"}
                      color={"inherit"}
                      onClick={() => setChangePassword(true)}
                      className={"colorReversed"}
                    >
                      {t("account.Security.btn_edit")}
                    </Button>
                  )}
                </Stack>
                {changePassword && (
                  <Box
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          data={errors?.password}
                          field={field}
                          id="current password"
                          type={"password"}
                        />
                      )}
                    />
                    <Controller
                      name="new_password"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          data={errors?.new_password}
                          id="new password"
                          field={field}
                          type={"password"}
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
                      {isLoading && <CircularProgress />}
                      {t("account.Security.btn_change")}
                    </Button>
                  </Box>
                )}
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant={isMobile ? "body1" : "h6"}>
                    {t("account.Security.phone")}: {data?.phone}
                  </Typography>
                  {!addPhone && (
                    <Button
                      variant={"outlined"}
                      color={"inherit"}
                      onClick={() => setAddPhone(true)}
                      className={"colorReversed"}
                    >
                      {t("account.Security.btn_edit")}
                    </Button>
                  )}
                </Stack>
                {addPhone && (
                  <Box
                    component={"form"}
                    onSubmit={handlePhoneSubmit(addPhoneHandler)}
                    noValidate
                  >
                    <Controller
                      name="phone"
                      control={controlPhone}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          data={errors?.phone}
                          field={field}
                          id="Phone"
                          type={"number"}
                        />
                      )}
                    />
                    <Button
                      variant={"outlined"}
                      type={"submit"}
                      color={"inherit"}
                      className={"colorReversed"}
                      disabled={isUpdating}
                    >
                      {isUpdating && <CircularProgress />}{" "}
                      {t("account.Security.btn_add")}
                    </Button>
                  </Box>
                )}
                {/*<Typography variant={'h6'}> 2fa verification  </Typography>*/}
                {/*<Stack sx={{display: 'flex', flexDirection: 'row',p:2, justifyContent: 'space-between'}}>*/}
                {/*    <Typography variant={isMobile ? 'body1' : 'h6'}> Request verification code on every sign in </Typography>*/}
                {/*    <Switch/>*/}
                {/*</Stack>*/}
                {/*<Stack sx={{display: 'flex', flexDirection: 'row',p:2, justifyContent: 'space-between'}}>*/}
                {/*    <Typography variant={isMobile ? 'body1' : 'h6'}> Request verification code to  access wallet </Typography>*/}
                {/*    <Switch/>*/}
                {/*</Stack>*/}
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Security;
