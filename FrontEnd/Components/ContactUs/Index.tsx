import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack, Forum } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { contactUsDefaultValue } from "../../Helpers/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useCreateContact } from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required().min(4),
  message: yup.string().required("This is required").min(4),
  phone: yup.string().required("Must be a number").min(11),
});

const Contact: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  // @ts-ignore
  const { handleSubmit, control, getValues, reset } =
    useForm<contactUsDefaultValue>({
      resolver: yupResolver(schema),
      mode: "onBlur",
      defaultValues: {
        email: "",
        name: "",
        phone: "",
        message: "",
      },
    });
  const onSubmit: SubmitHandler<contactUsDefaultValue> = async (data) => {
    const contact = {
      ...data,
    };
    contactUs(contact);
  };
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const onSuccess = () => {
    reset();
    dispatch(
      snackBarOpen({
        message: "message was successfully sent",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const {
    isLoading,
    isError,
    error,
    mutate: contactUs,
  } = useCreateContact(onSuccess);

  useEffect(() => {
    if (error instanceof Error) {
      // @ts-ignore
      setErrorMessage(error?.response.data?.status);
    }
  }, [isError]);

  useEffect(() => {
    if (isError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong, please try again",
          severity: "error",
          snackbarOpen: true,
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, []);
  const isMatches = useMediaQuery("(max-width: 700px)");
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"Talk to Support | Linconstore"}
          description={"Reach out to support for help"}
          content={"Enquire about questions, orders and how to sell on Linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>{t("contact.home")}</Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                variant={isMatches ? "body1" : "h1"}
                textAlign={"center"}
                sx={{ my: 2, fontSize: "1.5rem", fontWeight: "600" }}
              >
                <b>{t("contact.title")}</b>
              </Typography>
              <Container maxWidth={"lg"} component={"main"}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={isMatches ? 1 : 2}>
                    <Grid
                      item
                      xs={12}
                      sm={isMatches ? 0 : 1}
                      sx={{ display: isMatches ? "none" : "flex" }}
                    />
                    <Grid
                      item
                      xs={12}
                      sm={isMatches ? 5.8 : 5}
                      md={5}
                      sx={{ border: "2px solid black", borderRadius: "17px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          p: isMatches ? 1 : 2,
                        }}
                      >
                        <Stack spacing={2}>
                          <Typography variant={isMobile ? "body1" : "h6"}>
                            <b>{t("contact.Livechat")}</b>
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            {t("contact.chatDescription")}
                          </Typography>
                        </Stack>
                        <Stack spacing={0} my={2}>
                          <Typography variant={isMobile ? "body1" : "h6"}>
                            <b>{t("contact.email")}</b>
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            Complaints@linconstore.com
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            Enquiries@linconstore.com
                          </Typography>
                        </Stack>
                        <Stack my={2}>
                          <Typography variant={isMobile ? "body1" : "h6"}>
                            <b>{t("contact.call")}</b>
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            +44 7785611300
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            +357 961 30285
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={isMatches ? 0.1 : 1} />
                    <Grid
                      item
                      xs={12}
                      sm={isMatches ? 5.8 : 5}
                      md={5}
                      sx={{ border: "2px solid black", borderRadius: "17px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          p: 2,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant={isMobile ? "body1" : "h6"}
                          textAlign={"center"}
                        >
                          <b>{t("contact.message")}</b>
                        </Typography>
                        <Box
                          component={"form"}
                          onSubmit={handleSubmit(onSubmit)}
                          noValidate
                        >
                          <Controller
                            name="name"
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
                            name="email"
                            control={control}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.email}
                                field={field}
                                id="Email"
                                type={"email"}
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
                            name="message"
                            control={control}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.message}
                                field={field}
                                id="message"
                                multiple={true}
                              />
                            )}
                          />
                          {isError && (
                            <FormHelperText sx={{ color: "red" }}>
                              {errorMessage}
                            </FormHelperText>
                          )}
                          <Button
                            variant={"contained"}
                            type={"submit"}
                            disabled={isLoading}
                            fullWidth
                            className={"color"}
                            sx={{ mt: 2 }}
                          >
                            {isLoading && <CircularProgress />} Send
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Container>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", alignSelf: "flex-end", my: 2 }}>
            <Forum className={"pointer"} fontSize={"large"} />
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Contact;
