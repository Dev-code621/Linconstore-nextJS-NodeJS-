import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { loginUserDefaultValue } from "../../Helpers/Types";
import Holder from "../Wappers/Holder";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import { useGetSellerStatus, useLoginUser } from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { insertToken } from "../../Store/Auth";
import ContextApi from "../../Store/context/ContextApi";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});
interface IData {
  data: string;
  storeId: string;
}
export default function LoginPage() {
  const { t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width : 300px)");
  const { handleSubmit, control, getValues, reset } =
    useForm<loginUserDefaultValue>({
      resolver: yupResolver(schema),
      mode: "onBlur",
      defaultValues: {
        email: "",
        password: "",
      },
    });
  const router = useRouter();
  const dispatch = useDispatch();
  const handleName = useContext(ContextApi).handleName;
  const handleRole = useContext(ContextApi).handleRole;
  const [isLoggined, setIsLoggedIn] = useState<boolean>(false);
  const onSuccess = (data: any) => {
    setIsLoggedIn(true);
    dispatch(insertToken({ token: data.token }));

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    handleName(data.user.firstName);
    handleRole(data.user.role);
    if (data.user.role === "seller") {
      return refetch();
    }
    router.back();
  };
  const handleSeller = useContext(ContextApi).handleIsSeller;
  const onSellerStatus = (data: IData) => {
    const myData = data.data;
    if (myData === "incomplete") {
      localStorage.setItem("status", "inComplete");
    }
    if (myData === "seller") {
      handleSeller()
      localStorage.setItem("storeId", data.storeId);
      localStorage.setItem("status", "seller");
    }
    if (myData === "invalid") {
      localStorage.setItem("status", "invalid");
    }
    if (isLoggined) {
      setIsLoggedIn(false);
      router.back();
    }
  };
  const { refetch } = useGetSellerStatus(onSellerStatus);
  const {
    isLoading,
    isSuccess,
    isError,
    mutate: loginUser,
    error,
  } = useLoginUser(onSuccess);
  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset({
        ...getValues(),
        password: "",
      });
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 402) {
        dispatch(
          snackBarOpen({
            message: "This account has been deleted",
            snackbarOpen: true,
            severity: "warning",
            rate: 0,
            sellerRate: 0,
          })
        );
      }
    }
  }, [isError]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<loginUserDefaultValue> = async (data) => {
    const signInData = {
      password: data.password,
      email: data.email,
    };
    loginUser(signInData);
  };
  return (
    <>
      <Holder title={"Login"}>
        <Grid container mt={4}>
          <Grid item xs={0} sx={{ display: { xs: "none", sm: "flex" } }} sm={6}>
            <Image
              width={350}
              height={250}
              style={{ marginTop: 30, width: "100%", height: "100%" }}
              placeholder="blur"
              blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
              src={"/assets/img/Happy.svg"}
              alt={"image of Happy"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography variant={"h5"}>{t("login.title")}</Typography>
              {/*{loginLoading && <Loader/>}*/}
              {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
              <Controller
                name="email"
                control={control}
                render={({ field, formState: { errors } }) => (
                  // <TextInput
                  //   data={errors?.email}
                  //   field={field}
                  //   id="Email"
                  //   type={"email"}
                  // />
                  <TextField
                    label={t("login.email")}
                    variant="standard"
                    margin={"normal"}
                    fullWidth
                    className={"loginPass"}
                    error={!!errors?.email}
                    helperText={errors?.email?.message}
                    type={"email"}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    label={t("login.password")}
                    variant="standard"
                    margin={"normal"}
                    fullWidth
                    className={"loginPass"}
                    error={!!errors?.password}
                    helperText={errors?.password?.message}
                    type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                    {...field}
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Stack spacing={1}>
                {isError && (
                  <FormHelperText sx={{ color: "red" }}>
                    {t("login.error_msg")}
                  </FormHelperText>
                )}
                <Button
                  // disabled={isLoading}
                  className={"buttonClass"}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#54991D" }}
                >
                  {isLoading && (
                    <CircularProgress
                      aria-describedby={"progress bar"}
                      // size={"small"}

                    />
                  )}
                  {t("login.btnTitle")}
                </Button>
                <Grid container>
                  <Grid item xs={12} md={8} sx={{ color: "text.secondary" }}>
                    <Link href="/register">
                      <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={isMobile ? 0 : 1}
                      >
                        <Typography variant={"subtitle2"} gutterBottom>
                          {t("login.question")}
                        </Typography>
                        <Typography
                          variant={"subtitle2"}
                          className={"pointer"}
                          color={"primary"}
                        >
                          {t("login.signUp")}
                        </Typography>
                      </Stack>
                    </Link>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Link href="/account/reset">
                      <Typography
                        variant={"subtitle2"}
                        sx={{ alignSelf: "flex-end" }}
                        className={"pointer"}
                        color={"primary"}
                      >
                        {t("login.forgot_password")}
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Holder>
    </>
  );
}
