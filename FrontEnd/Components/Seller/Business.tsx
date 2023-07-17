import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextInput from "../TextInput";
import Holder from "../Wappers/Holder";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CountryDropdown } from "react-country-region-selector";
import Verify from "./Auth/Verify";
import { useRegister, useRegisterSeller } from "../../hooks/useDataFetch";
import axios from "axios";
import { uploadImage } from "../../Helpers/utils";
import { useDispatch } from "react-redux";
import { openTermModal } from "../../Store/Modal";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
  account: yup.string().required(),
  location: yup.string().required(),
  document: yup.string().required(),
  gender: yup.string().when("account", {
    is: "Individual Seller",
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  // residence: yup.string().when("account", {
  //     is: {"Individual Seller"},
  //     then: yup.string().required(),
  //     otherwise: yup.string().notRequired(),
  // }),
  dateOfBirth: yup.string().when("account", {
    is: "Individual Seller",
    then: yup
      .string()
      .nullable()
      .test("dateOfBirth", "You must be 18 years or older", function (value) {
        return moment().diff(moment(value, "YYYY-MM-DD"), "years") >= 18;
      })
      .required("Please enter your age"),
    otherwise: yup.string().notRequired(),
  }),
  document_id: yup.string().when("account", {
    is: "Individual Seller",
    then: yup.string().notRequired(),
    otherwise: yup.string().required(),
  }),
  attachment: yup
    .mixed()
    .required("You Must upload a document")
    .test("fileSize", "File Size is too large", (value) => {
      if (value) {
        return value.size <= 2000000;
      }
      return false;
    }),
  terms: yup.bool().oneOf([true], "You must accept terms and condition"),
});

type IBusiness = {
  account: string;
  location: string;
  document: string;
  document_id: string;
  attachment: File | null;
  terms: boolean;
  residence: string;
  gender: string;
  dateOfBirth: string;
};
export default function Business() {
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IBusiness>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      account: t("seller.verify.account.item1"),
      location: "",
      document: "",
      document_id: "",
      attachment: null,
      terms: false,
      residence: "",
      gender: "",
      dateOfBirth: "",
    },
  });
  const onSuccess = (data: object) => {
    router.push("/seller/setup");
  };
  const {
    error,
    isError,
    isSuccess,
    isLoading,
    mutate: createSeller,
  } = useRegisterSeller(onSuccess);

  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset();
    }
  }, [isSuccess, isError, reset]);
  useEffect(() => {
    const role = localStorage.getItem("role");
    // if(role === 'seller') router.push('/')
  }, []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<IBusiness> = async (data) => {
    const isBrands = watch("account");
    setIsUploading(true);
    const file = await uploadImage(data.attachment);
    setIsUploading(false);
    if (isBrands === t("seller.verify.account.item1")) {
      const sellerData = {
        account: isBrands,
        dob: data.dateOfBirth,
        gender: data.gender,
        file,
        location: data.location,
        documentType: data.document,
      };
      createSeller(sellerData);
    } else {
      const sellerData = {
        account: isBrands,
        file,
        documentType: data.document,
        document_id: data.document_id,
        location: data.location,
      };
      createSeller(sellerData);
    }
  };
  const dispatch = useDispatch();
  const handleDispatch = useCallback(() => {
    dispatch(openTermModal());
  }, []);

  const countryList: string[] = [
    t("seller.verify.countryList.australia"),
    t("seller.verify.countryList.austria"),
    t("seller.verify.countryList.belgium"),
    t("seller.verify.countryList.bulgaria"),
    t("seller.verify.countryList.canada"),
    t("seller.verify.countryList.croatia"),
    t("seller.verify.countryList.cyprus"),
    t("seller.verify.countryList.czech"),
    t("seller.verify.countryList.denmark"),
    t("seller.verify.countryList.estonia"),
    t("seller.verify.countryList.finland"),
    t("seller.verify.countryList.france"),
    t("seller.verify.countryList.germany"),
    t("seller.verify.countryList.greece"),
    t("seller.verify.countryList.hungary"),
    t("seller.verify.countryList.ireland"),
    t("seller.verify.countryList.italy"),
    t("seller.verify.countryList.lithuania"),
    t("seller.verify.countryList.luxembourg"),
    t("seller.verify.countryList.mexico"),
    t("seller.verify.countryList.netherland"),
    t("seller.verify.countryList.newZealand"),
    t("seller.verify.countryList.norway"),
    t("seller.verify.countryList.poland"),
    t("seller.verify.countryList.portugal"),
    t("seller.verify.countryList.spain"),
    t("seller.verify.countryList.sweden"),
    t("seller.verify.countryList.switzerland"),
    t("seller.verify.countryList.unitedKingdom"),
    t("seller.verify.countryList.unitedStates"),
  ];
  return (
    <Holder>
      <Grid container spacing={2}>
        <Grid item xs={0} sx={{ display: { xs: "none", sm: "flex" } }} sm={5}>
          <Image
            width={350}
            height={250}
            style={{ marginTop: 30, width: "100%", height: "100%" }}
            placeholder="blur"
            blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
            src={"/assets/img/Happy.svg"}
            alt={"image of happy svg"}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography variant={"h6"}>{t("seller.verify.title")}</Typography>
            {/*{loginLoading && <Loader/>}*/}
            {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
            <FormControl sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("account") === "" && "Account type"}
              </InputLabel>
              <Controller
                name="account"
                control={control}
                defaultValue={t("seller.verify.account.item1")}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    className={"sortButton"}
                    sx={{
                      bgcolor: "#fff",
                      height: 45,
                      color: "#000",
                      border: "2px solid black",
                      "& .MuiSvgIcon-root": {
                        color: "black",
                      },
                    }}
                  >
                    <MenuItem value={t("seller.verify.account.item1")}>
                      {t("seller.verify.account.item1")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.account.item2")}>
                      {t("seller.verify.account.item2")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.account.item3")}>
                      {t("seller.verify.account.item3")}
                    </MenuItem>
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.account?.message}{" "}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ minWidth: "100%", mt: 1.5 }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("location") === "" &&
                  t("seller.verify.countryList.title")}
              </InputLabel>
              <Controller
                name="location"
                control={control}
                defaultValue={"Austria"}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    className={"sortButton"}
                    sx={{
                      bgcolor: "#fff",
                      height: "35px",
                      my: 1,
                      color: "#000",
                      border: "2px solid black",
                      "& .MuiSvgIcon-root": {
                        color: "black",
                      },
                    }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                  >
                    {countryList.map((country, index) => (
                      <MenuItem key={index} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.location?.message}{" "}
              </FormHelperText>
            </FormControl>
            {/*<Controller*/}
            {/*    control={control}*/}
            {/*    name='location'*/}
            {/*    render={({field}) => (*/}
            {/*        <CountryDropdown*/}
            {/*            id={'country'}*/}
            {/*            defaultOptionLabel={'Select Location'}*/}
            {/*            {...field} />*/}
            {/*    )}*/}
            {/*/>*/}
            {errors.location && (
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors?.location?.message}
              </FormHelperText>
            )}
            <Box sx={{ my: 1 }} />
            <Box sx={{ my: 1 }} />
            <Box sx={{ my: 1 }} />
            <FormControl sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("document") === "" && t("seller.verify.business.title")}
              </InputLabel>
              <Controller
                name="document"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    className={"sortButton"}
                    sx={{
                      bgcolor: "#fff",
                      height: 45,
                      color: "#000",
                      border: "2px solid black",
                      "& .MuiSvgIcon-root": {
                        color: "black",
                      },
                    }}
                  >
                    <MenuItem value={t("seller.verify.business.item1")}>
                      {t("seller.verify.business.item1")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.business.item2")}>
                      {t("seller.verify.business.item2")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.business.item3")}>
                      {t("seller.verify.business.item3")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.business.item4")}>
                      {t("seller.verify.business.item4")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.business.item5")}>
                      {t("seller.verify.business.item5")}
                    </MenuItem>
                    {watch("account") === t("seller.verify.account.item1") && (
                      <MenuItem value={t("seller.verify.business.item6")}>
                        {t("seller.verify.business.item6")}
                      </MenuItem>
                    )}
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.document?.message}
              </FormHelperText>
            </FormControl>
            {watch("account") !== t("seller.verify.account.item1") && (
              <Controller
                name="document_id"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.document_id}
                    field={field}
                    id="Document ID"
                  />
                )}
              />
            )}
            {watch("account") === t("seller.verify.account.item1") && (
              <Stack
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                }}
              >
                <Stack>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({
                        field: { onChange, value },
                        formState: { errors },
                      }) => (
                        <DatePicker
                          label={t("seller.verify.date_title")}
                          disableFuture
                          value={value}
                          onChange={(value: string | null) =>
                            onChange(moment(value).format("YYYY-MM-DD"))
                          }
                          renderInput={(params: any) => (
                            <TextField
                              error={!!errors.dateOfBirth}
                              // helperText={errors?.dateOfBirth.message}
                              id="dateOfBirth"
                              variant="standard"
                              margin="dense"
                              fullWidth
                              color="primary"
                              autoComplete="bday"
                              {...params}
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.dateOfBirth?.message}
                  </FormHelperText>
                </Stack>
                <FormControl sx={{ minWidth: isMobile ? "100%" : "50%" }}>
                  <InputLabel id="gender" shrink={false}>
                    {watch("gender") === "" && t("seller.verify.gender.title")}
                  </InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <Select
                        labelId="gender"
                        id="gender"
                        {...field}
                        variant={"outlined"}
                        className={"sortButton"}
                        sx={{
                          bgcolor: "#fff",
                          height: 45,
                          color: "#000",
                          border: "2px solid black",
                          "& .MuiSvgIcon-root": {
                            color: "black",
                          },
                        }}
                      >
                        <MenuItem value={t("seller.verify.gender.item1")}>
                          {t("seller.verify.gender.item1")}
                        </MenuItem>
                        <MenuItem value={t("seller.verify.gender.item2")}>
                          {t("seller.verify.gender.item2")}
                        </MenuItem>
                        <MenuItem value={t("seller.verify.gender.item3")}>
                          {t("seller.verify.gender.item3")}
                        </MenuItem>
                      </Select>
                    )}
                  />

                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.document?.message}{" "}
                  </FormHelperText>
                </FormControl>
              </Stack>
            )}
            <Stack
              spacing={0}
              sx={{
                background: "#f3f2f2",
                display: "flex",
                borderRadius: "8px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                mt: 2,
              }}
            >
              <Controller
                name={`attachment`}
                control={control}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                      hidden
                      id={`attachment`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setValue(
                          `attachment`,
                          e.target.files && e.target.files[0]
                        );
                      }}
                    />
                    <Tooltip key="Select Doc" title={"Business document"}>
                      <label htmlFor={`attachment`}>
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCamera fontSize="large" />}
                          fullWidth={isMobile}
                        >
                          {t("seller.verify.upload_title")}
                        </Button>
                      </label>
                    </Tooltip>
                  </>
                )}
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors?.attachment?.message}
              </FormHelperText>
            </Stack>

            <Controller
              control={control}
              name={"terms"}
              render={({ field, formState: { errors } }) => (
                <FormControlLabel
                  control={
                    <Checkbox color="primary" aria-required={true} {...field} />
                  }
                  aria-required={true}
                  label={
                    <Typography>
                      {t("seller.verify.terms_alert")}
                      <span onClick={handleDispatch}>
                        <u>{t("seller.verify.link_content")}</u>
                      </span>
                    </Typography>
                  }
                />
              )}
            />
            {errors?.terms && (
              <FormHelperText sx={{ color: "red" }}>
                {" "}
                {errors?.terms?.message}{" "}
              </FormHelperText>
            )}
            <Stack spacing={1}>
              <Button
                disabled={isLoading || isUploading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#000",
                }}
              >
                {isLoading || (isUploading && <CircularProgress />)}
                {t("seller.verify.save_btn")}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Holder>
  );
}
