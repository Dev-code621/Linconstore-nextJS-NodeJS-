import {
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Avatar from "@mui/material/Avatar";
import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import { ArrowBack, PhotoCamera } from "@mui/icons-material";
import * as React from "react";
import Box from "@mui/material/Box";
import TextInput from "../TextInput";
import { useRouter } from "next/router";
import {
  useGetUser,
  useModifySeller,
  useModifyUser,
} from "../../hooks/useDataFetch";
import { uploadImage } from "../../Helpers/utils";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";
import ContextApi from "../../Store/context/ContextApi";
import axios from "axios";
import {baseUrl} from "../../Helpers/baseUrl";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  name: yup.string().required("you must provide a name for your store").min(4).test('unique-username', 'Username is already taken', async (value) => {
    try {
      const response = await axios.get(`${baseUrl}/store/unique-name?storename=${value}`);
      const data = response.data;
      return !data; // Return true if the username is unique, false otherwise
    } catch (error) {
      console.error('Error checking username:', error);
      return false; // Return false if an error occurs
    }
  }),
  location: yup.string().required(),
  description: yup.string().required().min(10),
  attachment: yup
    .mixed()
    .required("You Must upload a logo")
    .test("fileSize", "File Size is too large", (value) => {
      if (value) {
        return value.size <= 2000000;
      }
      return false;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (value) {
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
      return false;
    }),
});
const contactSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("This is required"),
  password: yup.string().required("This is required").min(6),
});
interface Istoreinfo {
  name: string;
  description: string;
  location: string;
  attachment: File | null;
}
interface Icontact {
  phone: "";
  password: string;
}
const Modify = () => {
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Istoreinfo>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
      attachment: null,
    },
  });
  const {
    handleSubmit: modifyInfo,
    control: controlData,
    reset: resetData,
  } = useForm<Icontact>({
    resolver: yupResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<Istoreinfo> = async (data, event) => {
    const logo = await uploadImage(data.attachment);
    const { name, location, description } = data;
    const newData = {
      name,
      location,
      summary: description,
      logo,
    };
    updateStore(newData);
  };
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  const onContact: SubmitHandler<Icontact> = (data) => {
    const newData = {
      phone: data.phone,
      password: data.password,
    };
    updateUser(newData);
  };
  const { data, isLoading: userIsLoading, refetch } = useGetUser();

  useTokenRefetch(refetch)
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const onSuccess = (data: object) => {
    reset();
    router.push("/seller");
  };

  const onUserSuccess = (data: object) => {
    resetData();
    const snackBar = {
      message: "Contact updated successfully",
      severity: "success",
      snackbarOpen: true,
      rate: 0,
      sellerRate: 0,
    };
    dispatch(snackBarOpen(snackBar));
  };
  const { isLoading: isUserLoading, mutate: updateUser } =
    useModifyUser(onUserSuccess);
  const { isLoading, mutate: updateStore } = useModifySeller(onSuccess);

  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Modify | seller dashboard linconstore</title>
        <meta name={"Modify"} content={"These are Modify"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
          <Typography variant={"h6"}>{t("seller.modify.title")}</Typography>
        </Box>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 0 }}
        >
          <Grid container spacing={2} my={2}>
            <Grid item xs={12} sm={8}>
              <Avatar
                src={
                  watch("attachment")
                    ? URL.createObjectURL(watch("attachment") as File)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt="photo preview"
                variant={"square"}
                sx={{ width: "200px", height: "200px", mb: 2 }}
              />

              <Controller
                name="attachment"
                control={control}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id={"attachment"}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setValue(
                          "attachment",
                          e.target.files && e.target.files[0]
                        );
                      }}
                    />
                    <Tooltip key="Select Image" title={"Business picture"}>
                      <label htmlFor="attachment">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCamera fontSize="large" />}
                        >
                          {t("seller.modify.btn_upload")}
                        </Button>
                      </label>
                    </Tooltip>
                  </>
                )}
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors?.attachment?.message}
              </FormHelperText>

              <Controller
                name="name"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.name}
                    field={field}
                    id="Store name"
                  />
                )}
              />
              <Controller
                name="location"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.location}
                    field={field}
                    id="Store Location"
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.description}
                    field={field}
                    id="Store description"
                  />
                )}
              />
            </Grid>
            <Grid item container direction={"column"} xs={12} sm={4}>
              <Grid item xs={0} sm={11} />
              <Grid item xs={12} sm={1}>
                <Button
                  fullWidth={isMobile}
                  sx={{ alignSelf: { sm: "flex-end" } }}
                  variant={"contained"}
                  type={"submit"}
                  className={"color"}
                  disabled={!sellerIsActive || isLoading}
                >
                  {t("seller.modify.modify")}{" "}
                  {isLoading && <CircularProgress />}{" "}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Stack spacing={2}>
          <Typography variant={"h6"}>
            {t("seller.modify.contact")} {userIsLoading && <CircularProgress />}
          </Typography>
          <Typography variant={"h6"}>
            {t("seller.modify.name")}: {data?.firstName} {data?.lastName}{" "}
          </Typography>
          <Typography variant={"h6"}>
            {t("seller.modify.email")}: {data?.email}
          </Typography>
        </Stack>
      </Card>
    </>
  );
};
export default Modify;
