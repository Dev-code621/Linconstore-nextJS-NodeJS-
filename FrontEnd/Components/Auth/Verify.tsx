import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import {CircularProgress, FormHelperText, Grid, Paper, Stack} from "@mui/material";
import ReactInputVerificationCode from "react-input-verification-code";
import styled from "styled-components";
import Image from "next/image";
import Logo from "../Utils/Logo";
import { decrement } from "../../Store/Stepper";
import { ArrowBack } from "@mui/icons-material";
import GenNav from "../Layouts/GenNav";
import {useResendOtp, useVerifySignup} from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import { BaseRouter } from "next/dist/shared/lib/router/router";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface Iverify {
  isInvalid: boolean;
}
interface IverifyProps {
  setVerifyEmail: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}
const StyledReactInputVerificationCode = styled.div`
  display: flex;
  justify-content: center;

  --ReactInputVerificationCode-itemWidth: 50px;
  --ReactInputVerificationCode-itemHeight: 58px;
  --ReactInputVerificationCode-itemSpacing: 8px;

  .ReactInputVerificationCode__item {
    font-size: 16px;
    font-weight: 500;
    color: black;
    background: #fff;
    border: 2px solid
      ${({ isInvalid }: Iverify) =>
        isInvalid ? "#EF6C65" : "rgba(28, 30, 60, 0.4)"};
    box-shadow: none;
  }

  .ReactInputVerificationCode__item.is-active {
    box-shadow: none;
    border: 1px solid #36c6d9;
  }
`;
const VerifyPage: React.JSXElementConstructor<IverifyProps> = ({
  setVerifyEmail,
  email,
}) => {
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState<boolean | null>();
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();
  const onSuccess = (data: any) => {
    router.back();
  };
  const { isLoading, isError, mutate: verifyUSer } = useVerifySignup(onSuccess);
  const [isValid, setIsValid] = React.useState<boolean>(isError);
  useEffect(() => {
    setIsValid(isError);
  }, [isError]);
  const verifyUser = useCallback(async (value: string) => {
    const data = {
      otp: value,
      email,
    };
    setValue("");
    verifyUSer(data);
  }, []);
  const onResendSuccess = () => {

  }
  const {isLoading: resending, mutate: resendOtp, isSuccess} = useResendOtp(onResendSuccess)

  const resendOtpCode = useCallback(() => {
      const data = {
        email
      }
      resendOtp(data)
  },[])
  return (
    <>
      <GenNav admin={false} mode={false} />
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          <span className={"arrowBack"} onClick={() => setVerifyEmail(false)}>
            <ArrowBack />
          </span>
        </Stack>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // height: 600,
            // justifyContent: 'center'
          }}
        >
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
                alt={"image of login verify"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography textAlign={"center"} component="h1" variant="h4">
                {t("verify_email.title")}
              </Typography>
              <Typography
                component="p"
                textAlign={"center"}
                mx={2}
                variant="subtitle1"
                alignItems={"center"}
              >
                 {t("verify_email.content")} {email}
              </Typography>
              <Typography
                component="h1"
                mx={2}
                mb={1}
                variant="subtitle1"
                alignItems={"center"}
              >
                {t("verify_email.alert_text")}

                  <Button style={{
                      textTransform: 'none',
                      textDecoration: 'underline',
                      color: 'blue',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                  }} onClick={resendOtpCode} variant={'outlined'}  size={'small'} > {t("verify_email.resend")}  </Button>  {resending && <CircularProgress/>}
              </Typography>
                {isSuccess && <FormHelperText sx={{textAlign: 'center'}}> Resent Successfully</FormHelperText>}
              <StyledReactInputVerificationCode isInvalid={isValid}>
                <ReactInputVerificationCode
                  value={value}
                  placeholder={""}
                  length={6}
                  onCompleted={(data) => verifyUser(data)}
                  onChange={(newValue) => {
                    setValue(newValue);
                    if (newValue !== "") {
                      setError(null);
                    }
                  }}
                />
              </StyledReactInputVerificationCode>
              <Button
                className={"buttonClass"}
                variant="contained"
                fullWidth
                type="submit"
                onClick={() => {
                  setTimeout(() => {
                    setIsValid(false);
                  }, 1000);
                }}
                sx={{ mt: 5, mb: 2, backgroundColor: "#54991D" }}
              >
                {t("verify_email.close_text")}{" "}
                {isLoading && <CircularProgress />}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
export default VerifyPage;
