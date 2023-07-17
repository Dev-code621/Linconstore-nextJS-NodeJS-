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
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import TextInput from "../TextInput";
import Holder from "../Wappers/Holder";
import ConfirmPassword from "./ConfirmPassword";
import { useResetPassword } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";

const schema = yup.object().shape({
  email: yup.string().email().required(),
});
type reset = {
  email: string;
};

export default function ResetPassword() {
  const isMobile: boolean = useMediaQuery("(max-width : 300px)");
  const { t } = useTranslation();
  const { handleSubmit, control, getValues, reset } = useForm<reset>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const onSuccess = (data: object) => {

  };

  const {
    isLoading,
    isSuccess,
    isError,
    mutate: resetPass,
  } = useResetPassword(onSuccess);

  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset();
    }
  }, [isSuccess, isError]);
  const onSubmit: SubmitHandler<reset> = async (data) => {
    const reset = {
      email: data.email,
    };
    resetPass(reset);
  };
  return (
    <>
      <Holder title={"Reset Password"}>
        <Grid container mt={4}>
          <Grid item xs={0} sm={3} />
          <Grid item xs={12} sm={6}>
            {isSuccess && (
              <Typography variant={"body2"}>
                {" "}
                {t("account.reset_password.success_msg")}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography variant={"h5"}>
                {t("account.reset_password.title")}
              </Typography>
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
                    label={t("account.reset_password.email")}
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
              <Stack spacing={1}>
                <Button
                  // disabled={isLoading}
                  className={"buttonClass"}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#54991D" }}
                >
                  {isLoading && <CircularProgress />}
                  {t("account.reset_password.btnTitle")}
                </Button>
                <Box>
                  {isError && (
                    <FormHelperText sx={{ color: "red" }}>
                      {t("account.reset_password.error_msg")}
                    </FormHelperText>
                  )}
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={0} sm={3} />
        </Grid>
      </Holder>
    </>
  );
}
