import * as React from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { createUserDefaultValue } from "../../Helpers/Types";
import Holder from "../Wappers/Holder";
import VerifyPage from "./Verify";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import Image from "next/image";
import { useRegister } from "../../hooks/useDataFetch";
import { restrictedPasswords } from "../../Data/placeholder";
import "react-phone-number-input/style.css";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(8)
    .test("Password", "Your password is weak 😒", (value) => {
      if (value) {
        return !restrictedPasswords.includes(value);
      }
    }),
  firstName: yup.string().required().min(2),
  lastName: yup.string().required().min(2),
  // phone: yup.mixed().optional().test('is-valid-phone', 'Phone number is not valid', value => {
  //     if (value) {
  //         return isValidPhoneNumber(value)
  //     }
  //     return false;
  // }).notRequired(),
  terms: yup.bool().oneOf([true], "You must accept terms and condition"),
});
export default function RegisterPage() {
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<createUserDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      lastName: "",
      firstName: "",
      // phone: '',
      password: "",
      terms: false,
    },
  });
  const router = useRouter();
  const { t } = useTranslation();
  const onSuccess = (data: any) => {
    setVerifyEmail(true);
    setEmail(data.user.email);
  };
  const [email, setEmail] = useState<string>("");
  const {
    isLoading,
    mutate: register,
    isError,
    isSuccess,
  } = useRegister(onSuccess);
  const [verifyEmail, setVerifyEmail] = React.useState<boolean>(false);
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<createUserDefaultValue> = async (data) => {
    const registerData = {
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      // phone: data.phone,
      lastName: data.lastName,
    };
    register(registerData);
    // mutate(signInData)
  };

  return (
    <>
      {!verifyEmail && (
        <Holder title={"Register"}>
          <Grid container>
            <Grid
              item
              xs={0}
              sx={{ display: { xs: "none", sm: "flex" } }}
              sm={6}
            >
              <Image
                width={350}
                height={250}
                style={{ marginTop: 30, width: "100%", height: "100%" }}
                placeholder="blur"
                blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                src={"/assets/img/Login.svg"}
                alt={"image of login"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1, mb: 2 }}
              >
                {/*{loginLoading && <Loader/>}*/}
                <Typography variant={"h5"}>{t("register.title")}</Typography>
                {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    // <TextInput
                    //   data={errors?.firstName}
                    //   field={field}
                    //   id={t("register.first_name")}
                    // />
                    <TextField
                      label={t("register.first_name")}
                      variant="standard"
                      margin={"normal"}
                      fullWidth
                      className={"loginPass"}
                      error={!!errors?.firstName}
                      helperText={errors?.firstName?.message}
                      type={"text"}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    // <TextInput
                    //   data={errors?.lastName}
                    //   field={field}
                    //   id={t("register.last_name")}
                    // />
                    <TextField
                      label={t("register.last_name")}
                      variant="standard"
                      margin={"normal"}
                      fullWidth
                      className={"loginPass"}
                      error={!!errors?.lastName}
                      helperText={errors?.lastName?.message}
                      type={"text"}
                      {...field}
                    />
                  )}
                />
                {/*<Controller*/}
                {/*    name="phone"*/}
                {/*    control={control}*/}
                {/*    render={({ field  }) => (*/}
                {/*        <PhoneInput*/}
                {/*            style={{border:'0px', marginTop: 3}}*/}
                {/*            {...field}*/}
                {/*            className={'phoneReg'}*/}
                {/*            defaultCountry="US"*/}
                {/*            id="phoneInput"*/}
                {/*            placeholder="Phone Number"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}
                {/*{errors.phone && (*/}
                {/*    <FormHelperText sx={{color: '#d32f2f'}}> {errors?.phone?.message}</FormHelperText>*/}
                {/*)}*/}
                <Controller
                  name="email"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    // <TextInput
                    //   data={errors?.email}
                    //   field={field}
                    //   id={t("register.email")}
                    //   type="email"
                    // />
                    <TextField
                      label={t("register.email")}
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
                      label={t("register.password")}
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={"terms"}
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          required={true}
                          color="primary"
                          aria-required={true}
                          defaultChecked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      aria-required={true}
                      label={
                        <Typography>
                          {t("register.accept_title")}
                          <u>
                            {" "}
                            <Link href={"/terms"}>
                              {t("register.accept_link")}
                            </Link>
                          </u>
                        </Typography>
                      }
                    />
                  )}
                />
                {errors?.terms && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.terms?.message}
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
                  {isLoading && <CircularProgress />}
                  {t("register.btnTitle")}
                </Button>

                <Grid container>
                  <Grid item>
                    <u>
                      <Link href="/login">{t("register.signIn")}</Link>
                    </u>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Holder>
      )}
      {verifyEmail && (
        <VerifyPage email={email} setVerifyEmail={setVerifyEmail} />
      )}
    </>
  );
}
