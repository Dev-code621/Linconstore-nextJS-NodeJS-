import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../../TextInput";
import {
  Autocomplete,
  Card,
  CircularProgress, FormControl,
  FormHelperText,
  Grid,
  IconButton, InputLabel, Select,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import {hey, postItemDefaultValue} from "../../../Helpers/Types";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  Add,
  ArrowBack,
  Delete,
  HelpOutline,
  PhotoCamera,
} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Dropzone, {Accept, DropzoneOptions} from "react-dropzone";
import {
  useCreateProduct,
  useGetAllCategories,
} from "../../../hooks/useDataFetch";
import { uploadImage, uploadImages } from "../../../Helpers/utils";
import NewOptions from "./newOptions";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import {categoryTags} from "../../../Helpers/CategoryTags";

const schema = yup.object().shape({
  title: yup.string().required().min(4),
  description: yup.string().required().min(5),
  condition: yup.string().required().min(3),
  price: yup
    .number()
    .typeError("Must be a number")
    .required()
    .min(1, "Must be at least 1"),
  quantity: yup
    .number()
    .typeError("Must be a number")
    .required()
    .min(1, "Must be at least 1"),
  category: yup.string().required("You must select a category"),
  care: yup.string().required("This is required"),
  tags: yup.array().of(yup.string()).nullable(),
  details: yup.string().required("This is required"),
  terms: yup.boolean(),
  test: yup.array().of(
    yup.object().shape({
      stock: yup.array().of(
        yup.object().shape({
          name: yup.number().typeError("Must be a number"),
          price: yup
            .number()
            .typeError("Must be a number")
            .min(1, "Price must be grater than 0"),
          variants: yup.string(),
        })
      ),
    })
  ),
  subCategory: yup.string().required("You must select a sub category"),
  standard: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  express: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  africa: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  asia: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  europe: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  northAmerica: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  southAmerica: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  oceania: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  antarctica: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
});
type TProduct = {
  price: number;
  country: string;
};
type IShipping = {
  express: TProduct;
  standard: TProduct;
};
type IContinents = {
  africa: number;
  asia: number;
  oceania: number;
  southAmerica: number;
  northAmerica: number;
  europe: number;
  antarctica: number;
};
interface IProduct {
  setStepper: React.Dispatch<boolean>;
  handleRefetch: () => void;
  location: string;
}
type Iutil = {
  util: {
    sellerRate: number;
  };
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type IVariant = {
  option: string;
  variant: string;
  price: number;
  stock: number;
};
const AddProduct: React.FC<IProduct> = ({
  setStepper,
  location,
  handleRefetch,
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const onCategorySuccess = () => {};
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const { data, isLoading: loading } = useGetAllCategories(onCategorySuccess);
  const [subCategories, setSubCategories] = useState([]);

  const [tags, setTags] = useState<string[]>(['shopping'])

  useEffect(() => {
    if (categories.length > 0) return;
    data?.map((value: any) => categories.push(value.title));
  }, [loading]);
  const [isCheck, setIsChecked] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<postItemDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      condition:"",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      subCategory: "",
      variation: "",
      tags: "",
      details: "",
      terms: false,
      care: "",
      standard: 0,
      express: 0,
      file: undefined,
      asia: 0,
      africa: 0,
      europe: 0,
      southAmerica: 0,
      northAmerica: 0,
      oceania: 0,
      antarctica: 0,
      test: [
        {
          stock: [
            {
              name: 1,
              price: 1,
            },
          ],
        },
      ],
    },
  });
  const [items, setItem] = useState([
    {
      options: {
        id: 1,
        name: "",
        value: [{ name: "" }],
      },
    },
  ]);
  // const [] = useState<number>()

  const category = watch('category');

  useEffect(() => {
    const subTags = categoryTags.find(x => x.key === category);
    if (subTags){
      setTags(subTags.category)
    }
  },[category])
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { value } = event.target;
    const values = [...items];
    values[index].options.name = value;
    setItem(values);
  };

  const addItem = () => {
    setItem((prevState) => [
      ...prevState,
      {
        options: {
          id: prevState.length + 1,
          name: "",
          value: [{ name: "" }],
        },
      },
    ]);
  };

  const removeItem = (index: number) => {
    let option = [...items];
    // option.splice(index , 1);
    setItem((prevState) => [
      ...prevState.filter((data) => data.options.id !== index),
    ]);
  };
  const acceptedFileTypes  = {
    'image/*': ['.jpeg', '.jpg', '.png'],
   };

  const handleAddShare = (index: number) => {
    const values = [...items];
    values[index].options.value = [
      ...values[index].options.value,
      { name: "" },
    ];
    setItem(values);
  };
  const removeItemName = (id: number, parIndex: number) => {
    const newItem = [...items];
    newItem.forEach((data, parentIndex) =>
      data.options.value.forEach((s, index) => {
        if (index === id && parIndex === parentIndex) {
          return data.options.value.splice(index, 1);
        }
      })
    );
    setItem(newItem);
    //     this.setState({
    //         value: this.state.value.filter((s, sidx) => idx !== sidx)
    //     });
  };
  //
  //
  const price = watch('price')

  useEffect(() => {
      if (price > 0) {
        const testArray: hey[] = watch('test');
        const updatedTestArray = testArray.map((item) => ({
          ...item,
          stock: item.stock.map((stockItem) => ({
            ...stockItem,
            price: price
          })),
        }));
        setValue('test', updatedTestArray);
      }
  },[price])
  const handleNameChange = (
    idx: number,
    parIndex: number,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { value } = event.target;
    const newItem = [...items];
    newItem.forEach((data, parentIndex) =>
      data.options.value.forEach((s, index) => {
        if (index === idx && parIndex === parentIndex) {
          s.name = value;
        }
      })
    );
    setItem(newItem);
  };
  useEffect(() => {
    const category = watch("category");
    const filterCategory = data?.filter(
      (categori) => categori.title === category
    );
    if (filterCategory?.length > 0) {
      setSubCategories(filterCategory[0].subcategories);
    }
  }, [watch("category")]);
  const router = useRouter();
  const onSuccess = (data: object) => {
    reset();
    handleRefetch();
    setStepper(false);
  };
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { isLoading, error, mutate, isError } = useCreateProduct(onSuccess);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(rateDispatch);
  useEffect(() => {
    if (!rate) {
      const rateExchange = localStorage.getItem("rateSeller");
      setRate(parseInt(rateExchange));
    }
  }, [rateDispatch]);
  const onSubmit: SubmitHandler<postItemDefaultValue> = async (data) => {
    setIsUploading(true);
    const photo = await uploadImages(data.file);
    setIsUploading(false);
    const {
      antarctica,
      asia,
      africa,
      northAmerica,
      southAmerica,
      europe,
      oceania,
      price,
    } = data;
    const { express, standard } = data;
    const shipping: IShipping[] = [
      {
        express: {
          price: Number((express * rate).toFixed(2)),
          country: location,
        },
        standard: {
          price: Number((standard * rate).toFixed(2)),
          country: location,
        },
      },
    ];
    const continents: IContinents[] = [
      {
        africa,
        asia,
        antarctica,
        oceania,
        europe,
        northAmerica,
        southAmerica,
      },
    ];
    setIsUploading(false);
    const { test } = data;
    const variantPlaceholder: IVariant[] = [];
    if (items.length > 0) {
      items.map(
        (data, index) =>
          data.options.name !== "" &&
          data.options.value.map((name, id) => {
            const option = name.name;
            const variant = data.options.name;
            const price = Number(
              (test[index].stock[id].price * rate).toFixed(2)
            );
            const stock = test[index].stock[id].name;
            const newData: IVariant = {
              variant,
              option,
              price,
              stock,
            };
            variantPlaceholder.push(newData);
          })
      );
      if (isGlobal) {
        const createProduct = {
          ...data,
          price: Number((price * rate).toFixed(2)),
          subcategory: data.subCategory,
          shippingDetail: data.details,
          instruction: data.care,
          photo,
          isGlobal,
          continents,
          variants: variantPlaceholder,
        };
        mutate(createProduct);
      } else {
        const createProduct = {
          ...data,
          price: Number((price * rate).toFixed(2)),
          subcategory: data.subCategory,
          shippingDetail: data.details,
          instruction: data.care,
          shipping,
          photo,
          isGlobal,
          variants: variantPlaceholder,
        };
        mutate(createProduct);
      }
    } else {
      if (isGlobal) {
        const createProduct = {
          ...data,
          subcategory: data.subCategory,
          shippingDetail: data.details,
          instruction: data.care,
          price: rate * price,
          isGlobal,
          photo,
          continents,
        };
        mutate(createProduct);
      } else {
        const createProduct = {
          ...data,
          price: price * rate,
          subcategory: data.subCategory,
          shippingDetail: data.details,
          instruction: data.care,
          shipping,
          isGlobal,
          photo,
        };
        mutate(createProduct);
      }
    }
  };
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const stock = watch("quantity");
  const onGlobalChangeHandler = () => {
    setIsGlobal((prevState) => !prevState);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box flexGrow={0.5}>
          <ArrowBack onClick={() => setStepper(false)} className={"pointer"} />
        </Box>
        <Typography
          variant={"h6"}
          sx={{ justifyContent: "center" }}
          textAlign={"center"}
        >
          {t("seller.post.add_product.title")}
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        {/*{loginLoading && <Loader/>}*/}
        <Card
          elevation={1}
          sx={{
            background: "#f3f2f2",
            border: "2px solid #000",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Stack
            spacing={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Controller
              control={control}
              name="file"
              rules={{
                required: {
                  value: true,
                  message: t("seller.post.add_product.require_msg"),
                },
              }}
              render={({ field: { onChange, onBlur }, fieldState }) => (
                <Dropzone
                  noClick
                  accept={acceptedFileTypes as unknown as Accept}
                  onDrop={(acceptedFiles) => {
                    setValue("file", acceptedFiles as unknown as FileList[], {
                      shouldValidate: true,
                    });
                  }}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    open,
                    isDragActive,
                    acceptedFiles,
                  }) => (
                    <div>
                      <div
                        style={{
                          backgroundColor: isDragActive
                            ? `#808080`
                            : "transparent",
                        }}
                        {...getRootProps()}
                      >
                        <input
                          {...getInputProps({
                            id: "spreadsheet",
                            onChange,
                            onBlur,
                          })}
                        />

                        {/*<p>*/}
                        {/*    <button type="button" onClick={open}>*/}
                        {/*        Choose a file*/}
                        {/*    </button>{' '}*/}
                        {/*    or drag and drop*/}
                        {/*</p>*/}
                        <Grid container>
                          {acceptedFiles.length > 0 &&
                            acceptedFiles.map((file, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Avatar
                                  variant={"square"}
                                  src={URL.createObjectURL(file)}
                                  alt="photo preview"
                                  sx={{
                                    width: "200px",
                                    height: "200px",
                                    mb: 2,
                                  }}
                                />
                              </Grid>
                            ))}
                        </Grid>
                        {acceptedFiles.length === 0 && (
                          <Avatar
                            variant={"square"}
                            src={
                              "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt="photo preview"
                            sx={{ width: "200px", height: "200px", mb: 2 }}
                          />
                        )}
                        <div>
                          {fieldState.error && (
                            <span role="alert">{fieldState.error.message}</span>
                          )}
                        </div>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCamera fontSize="large" />}
                          onClick={open}
                        >
                          {t("seller.post.add_product.upload_btn")}
                        </Button>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          </Stack>
        </Card>
        <Card
          elevation={1}
          sx={{
            background: "#f3f2f2",
            border: "2px solid #000",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Stack spacing={0} sx={{ p: 3 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.title}
                  field={field}
                  id={t("seller.post.add_product.product_title")}
                />
              )}
            />
              <FormControl>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("condition") === "" && "Condition"}
              </InputLabel>
              <Controller
                  name="condition"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          {...field}
                          variant={"standard"}
                          required
                          error={!!errors?.condition}
                          // helperText={errors?.category?.message}
                      >
                        <MenuItem value={"New"}>New</MenuItem>
                        <MenuItem value={"Used"}>Used</MenuItem>
                      </Select>
                  )}
              />
                {errors.condition && <FormHelperText sx={{color: 'red'}}>{errors.condition.message}</FormHelperText>}
            </FormControl>

            <Controller
              control={control}
              name="description"
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.description}
                  field={field}
                  id={t("seller.post.add_product.product_description")}
                  type="text"
                />
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="category"
                  defaultValue={"Pet"}
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <Autocomplete
                      id="cats-options"
                      options={categories}
                      getOptionLabel={(cat) => cat}
                      renderInput={(params) => (
                        <TextField
                          sx={{ mt: 2 }}
                          {...params}
                          value={categories[0]}
                          variant="standard"
                          required
                          error={!!errors?.category}
                          helperText={errors?.category?.message}
                          label={t("seller.post.add_product.category_field")}
                          placeholder={t(
                            "seller.post.add_product.category_field_placeholder"
                          )}
                        />
                      )}
                      onChange={(e, data) => onChange(data)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="subCategory"
                  defaultValue={"Pet"}
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <Autocomplete
                      id="sub categories"
                      options={subCategories}
                      getOptionLabel={(cat) => cat}
                      renderInput={(params) => (
                        <TextField
                          sx={{ mt: 2 }}
                          {...params}
                          value={subCategories[0]}
                          variant="standard"
                          required
                          error={!!errors?.subCategory}
                          helperText={errors?.subCategory?.message}
                          label={t("seller.post.add_product.sub_category")}
                          placeholder={t(
                            "seller.post.add_product.sub_category_placeholder"
                          )}
                        />
                      )}
                      onChange={(e, data) => onChange(data)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </Card>
        <Card
          elevation={1}
          sx={{
            background: "#f3f2f2",
            border: "2px solid black",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Stack spacing={0} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      data={errors?.price}
                      field={field}
                      id={`${currency} ${t(
                        "seller.post.add_product.price_title"
                      )}`}
                      type="number"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      data={errors?.quantity}
                      field={field}
                      id={t("seller.post.add_product.quantityStock")}
                      type="number"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              control={control}
              name="tags"
              // defaultValue={'shopping'}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => (
                <Autocomplete
                  id="tags"
                  options={tags}
                  autoSelect
                  freeSolo
                  multiple={true}
                  // getOptionLabel={(cat) => cat}
                  renderInput={(params) => (
                    <TextField
                      sx={{ mt: 2 }}
                      {...params}
                      // value={'shopping'}
                      variant="standard"
                      required
                      error={!!errors?.tags}
                      helperText={errors?.tags?.message}
                      label={t("seller.post.add_product.tags")}
                      placeholder={t(
                        "seller.post.add_product.tags_placeholder"
                      )}
                      // InputProps={{ // <-- This is where the toggle button is added.
                      //     endAdornment: (
                      //         <InputAdornment position="end">
                      //             <Tooltip placement={'top-start'} title={'To add multiple tags, press enter key after each words'}>
                      //                 <IconButton
                      //                     aria-label="help"
                      //                 >
                      //                     <HelpOutline />
                      //                 </IconButton>
                      //             </Tooltip>
                      //         </InputAdornment>
                      //     )
                      // }}
                    />
                  )}
                  onChange={(e, data) => onChange(data)}
                />
              )}
            />
            {/*<Controller*/}
            {/*    control={control}*/}
            {/*    name='tags'*/}
            {/*    render={({ field, formState: {errors} }) => (*/}
            {/*        <TextInput*/}
            {/*            data={errors?.tags} required={true} field={field} id='Tags'*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}
          </Stack>
        </Card>
        {isGlobal && (
          <Card
            elevation={1}
            sx={{
              background: "#f3f2f2",
              border: "2px solid black",
              maxWidth: { xs: "auto", lg: "auto" },
              my: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: "645px", width: "100%", background: "#f3f2f2" }}
                aria-label="stats table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      {t("seller.post.add_product.shipping_title")}
                    </TableCell>
                    <TableCell align="left">
                      {t("seller.post.add_product.price_title")}
                    </TableCell>
                    {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                    {/*<TableCell align="left">EUROPE</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Africa
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for africa, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="africa"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.africa}
                            required={true}
                            field={field}
                            id={`${currency} Africa`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Asia
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for Asia, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="asia"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.asia}
                            required={true}
                            field={field}
                            id={`${currency} Asia`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      South America
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for South America, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="southAmerica"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.southAmerica}
                            required={true}
                            field={field}
                            id={`${currency} southAmerica`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      North America
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for North America, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="northAmerica"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.northAmerica}
                            required={true}
                            field={field}
                            id={`${currency} northAmerica`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Oceania
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for Oceania, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="oceania"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.oceania}
                            required={true}
                            field={field}
                            id={`${currency} oceania`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Europe
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for Europe, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="europe"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.europe}
                            required={true}
                            field={field}
                            id={`${currency} Europe`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Antarctica
                      <Tooltip
                        placement={"top-start"}
                        title={
                          "Enter the shipping amount for North America, for free shipping leave field empty"
                        }
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="antarctica"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.northAmerica}
                            required={true}
                            field={field}
                            id={`${currency} antarctica`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
        {!isGlobal && (
          <Card
            elevation={1}
            sx={{
              background: "#f3f2f2",
              border: "2px solid black",
              maxWidth: { xs: "auto", lg: "auto" },
              my: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: "645px", width: "100%", background: "#f3f2f2" }}
                aria-label="stats table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      {t("seller.post.add_product.shipping_title")}
                    </TableCell>
                    <TableCell align="left">
                      {t("seller.post.add_product.price_title")}
                    </TableCell>
                    {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                    {/*<TableCell align="left">EUROPE</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {t("seller.post.add_product.ship_faq1")}
                      <Tooltip
                        placement={"top-start"}
                        title={t("seller.post.add_product.ship_faq1_tooltip")}
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="standard"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.standard}
                            required={true}
                            field={field}
                            id={`${currency} ${t(
                              "seller.post.add_product.standard_title"
                            )} `}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {t("seller.post.add_product.ship_faq2")}
                      <Tooltip
                        placement={"top-start"}
                        title={t("seller.post.add_product.ship_faq2_tooltip")}
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="express"
                        render={({ field, formState: { errors } }) => (
                          <TextInput
                            data={errors?.express}
                            required={true}
                            field={field}
                            id={`${currency} ${t(
                              "seller.post.add_product.express_shipping"
                            )}`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
        <Card
          elevation={1}
          sx={{
            background: "#f3f2f2",
            border: "2px solid black",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Stack sx={{ p: 3 }}>
            <Controller
              control={control}
              name="care"
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.care}
                  required={true}
                  field={field}
                  id={t("seller.post.add_product.care_instruction")}
                />
              )}
            />
            <Controller
              control={control}
              name="details"
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.details}
                  required={true}
                  field={field}
                  id={t("seller.post.add_product.shipping_details")}
                />
              )}
            />
          </Stack>
        </Card>
        <Card
          elevation={1}
          sx={{
            background: "#f3f2f2",
            border: "2px solid black",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant={"body1"}>
              {t("seller.post.add_product.variant_title")}
            </Typography>
            <Stack direction={"row"}>
              <Checkbox
                color="primary"
                value={isCheck}
                sx={{ maxWidth: 25 }}
                onClick={() => setIsChecked((prevState) => !prevState)}
              />
              <Typography mt={1} mx={1} variant={"body1"}>
                {t("seller.post.add_product.checkBox_title")}
              </Typography>
            </Stack>
            <Box>
              {isCheck && (
                <Box>
                  {items.map((data, index) => {
                    return (
                      <Box key={index}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item xs={11}>
                            {/*<Autocomplete*/}
                            {/*    id="address"*/}
                            {/*    options={['Color', 'Size', 'Material']}*/}
                            {/*    // getOptionLabel={(address) => address}*/}
                            {/*    autoSelect*/}
                            {/*    freeSolo*/}
                            {/*    renderInput={(params) => (*/}
                            {/*        <TextField*/}
                            {/*            sx={{mt:2}}*/}
                            {/*            label={"Option" + " " + (index + 1)}*/}
                            {/*            required*/}
                            {/*            {...params}*/}
                            {/*            variant="standard"*/}
                            {/*            color={'primary'}*/}
                            {/*            value={data.options?.name}*/}
                            {/*            // onChange={(event) => handleChange(index, event)}*/}
                            {/*            fullWidth/>*/}
                            {/*    )}*/}

                            {/*    onChange={(event) => handleChange(index, event)}*/}
                            {/*/>*/}
                            <TextField
                              label={
                                t("seller.post.add_product.variant_type") +
                                " " +
                                (index + 1)
                              }
                              required
                              value={data.options?.name}
                              variant="standard"
                              color={"primary"}
                              onChange={(event) => handleChange(index, event)}
                              fullWidth
                              helperText={"color, size, material, style"}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <div
                              className="font-icon-wrapper"
                              onClick={(event) => removeItem(data.options.id)}
                            >
                              <IconButton aria-label="delete">
                                <Delete />
                              </IconButton>
                            </div>
                          </Grid>
                        </Grid>

                        {data.options.value.map((name, id) => (
                          <Box key={id}>
                            <Grid container spacing={1} alignItems="flex-end">
                              <Grid item xs={11}>
                                <TextField
                                  label={
                                    t(
                                      "seller.post.add_product.variant_option"
                                    ) +
                                    " " +
                                    (id + 1)
                                  }
                                  variant="standard"
                                  required
                                  value={name.name}
                                  onChange={(event) =>
                                    handleNameChange(id, index, event)
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={1}>
                                <div
                                  className="font-icon-wrapper"
                                  onClick={() => removeItemName(id, index)}
                                >
                                  <IconButton aria-label="delete">
                                    <Delete />
                                  </IconButton>
                                </div>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Grid item xs={2}>
                          <div
                            className="font-icon-wrapper"
                            onClick={() => handleAddShare(index)}
                          >
                            <IconButton aria-label="delete">
                              <Add />
                            </IconButton>
                          </div>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {isCheck && (
                <Button
                  onClick={addItem}
                  sx={{ color: "black" }}
                  startIcon={<Add />}
                  color="primary"
                >
                  {t("seller.post.add_product.btn_variant")}
                </Button>
              )}
              {items.length > 1 && (
                <>
                  <Typography variant={"h6"}>
                    {t("seller.post.add_product.edit_variant")}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.variant_title")}
                    </Grid>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.price_title")}
                    </Grid>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.stock_title")}
                    </Grid>
                  </Grid>
                  <Box>
                    {items.map(
                      (data, index) =>
                        data.options.name !== "" &&
                        data.options.value.map((name, id) => {
                          // console.log(watch(`test.${index}.stock`)?.reduce((index, {name}) => index + Number.parseInt(name), 0) > stock)
                          if (name.name !== "") {
                            // @ts-ignore
                            return (
                              <Box key={id + index}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} lg={3} mt={3}>
                                    <Typography>
                                      {data.options.name} / {name.name}
                                    </Typography>
                                    {/*<Controller*/}
                                    {/*    control={control}*/}
                                    {/*    name={`test.${index}.stock.${id}.variants`}*/}
                                    {/*    // defaultValue={`${data.options.name} /  ${name.name}`}*/}
                                    {/*    render={({field : {onChange}, formState: {errors}}) => (*/}
                                    {/*        <TextField*/}
                                    {/*            margin="normal"*/}
                                    {/*            required*/}
                                    {/*            fullWidth*/}
                                    {/*            onChange={(e) =>  onChange(e.target.value)}*/}
                                    {/*            value={`${data.options.name} /  ${name.name}`}*/}
                                    {/*            variant={'standard'}*/}
                                    {/*            error={!!errors?.test?.[index]?.stock?.[id]?.variants}*/}
                                    {/*            helperText={errors?.test?.[index]?.stock?.[id]?.variants?.message}*/}
                                    {/*            id={'variants'}*/}
                                    {/*            type={'text'}*/}
                                    {/*            label={'variants'}*/}
                                    {/*            name={'variants'}*/}
                                    {/*        />*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.price`}
                                      defaultValue={watch('price')}
                                      render={({
                                        field,
                                        formState: { errors },
                                      }) => (
                                        <TextField
                                          margin="normal"
                                          required
                                          fullWidth
                                          variant={"standard"}
                                          error={
                                            !!errors?.test?.[index]?.stock?.[id]
                                              ?.price
                                          }
                                          helperText={
                                            errors?.test?.[index]?.stock?.[id]
                                              ?.price?.message
                                          }
                                          {...field}
                                          id={"price"}
                                          type={"number"}
                                          label={`${currency} price`}
                                          name={"price"}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.name`}
                                      defaultValue={0}
                                      render={({
                                        field,
                                        formState: { errors },
                                      }) => (
                                        <TextField
                                          margin="normal"
                                          required
                                          fullWidth
                                          variant={"standard"}
                                          error={
                                            !!errors?.test?.[index]?.stock?.[id]
                                              ?.name
                                          }
                                          helperText={
                                            errors?.test?.[index]?.stock?.[id]
                                              ?.name?.message
                                          }
                                          {...field}
                                          id={"stock"}
                                          type={"number"}
                                          label={"stock"}
                                          name={"stock"}
                                        />
                                      )}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                      {watch(`test.${index}.stock`)?.reduce(
                                        (index, { name }) =>
                                          index +
                                          Number.parseInt(
                                            name as unknown as string
                                          ),
                                        0
                                      ) > stock
                                        ? "Must not be greater than stock"
                                        : ""}
                                    </FormHelperText>
                                  </Grid>
                                </Grid>

                                {/*<Controller*/}
                                {/*    control={control}*/}
                                {/*    name={`test?.[${index}]`}*/}
                                {/*    defaultValue={null}*/}
                                {/*    render={({ field, formState: {errors} }) => (*/}
                                {/*        <TextField*/}
                                {/*        margin="normal"*/}
                                {/*        required*/}
                                {/*        fullWidth*/}
                                {/*        variant={'standard'}*/}
                                {/*        error={!!errors?.test?.[index]?.stock}*/}
                                {/*        helperText={errors?.test?.[index]?.stock?.message}*/}
                                {/*         {...field}*/}
                                {/*        id={'stock'}*/}
                                {/*        type={'number'}*/}
                                {/*        label={'stock'}*/}
                                {/*        name={'stock'}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*/>*/}
                              </Box>
                            );
                          }
                        })
                    )}
                    {/*<Button variant={'outlined'} fullWidth type={'submit'}*/}
                    {/*        className={'color'}>Save</Button>*/}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Card>
        <Box sx={{ p: 1, border: "2px solid black" }}>
          <Grid container>
            {/*<Grid item xs={12} sm={4} md={4} lg={10} >*/}
            {/*    <Stack direction={'row'}>*/}
            {/*        <Switch checked={isGlobal} onChange={onGlobalChangeHandler} />*/}
            {/*        <Stack>*/}
            {/*            <Box sx={{mt:1}}/>*/}
            {/*            <Typography variant={'body1'}>Sell Globally</Typography>*/}
            {/*        </Stack>*/}
            {/*    </Stack>*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                className={"color"}
                fullWidth={isMobile}
                disabled={isLoading || isUploading}
                type="submit"
                variant="contained"
                sx={{ width: "fit-content" }}
              >
                {isLoading || (isUploading && <CircularProgress />)}
                {t("seller.post.add_product.btn_save")}
                {isError && "Something went wrong"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default AddProduct;
