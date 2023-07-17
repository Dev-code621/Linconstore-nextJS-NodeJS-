import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleCloseModal, modalClose } from "../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ArrowBack, HelpOutline, PhotoCamera } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Dropzone, { Accept } from "react-dropzone";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextInput from "../TextInput";
import { categoryOptions } from "../Seller/StoreInfo";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Options from "./Options";
import { useCallback, useEffect, useState } from "react";
import {
  EditItemDefaultValue,
  IProducts,
  postItemDefaultValue,
  TCat,
} from "../../Helpers/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  useGetAllCategories,
  useGetCategoryById,
  useGetSellerInfo,
  useUpdateProduct,
} from "../../hooks/useDataFetch";
import { uploadImages } from "../../Helpers/utils";
import { baseUrl } from "../../Helpers/baseUrl";
import { getValue } from "@mui/system";
import { number } from "card-validator";
import { groupByKey } from "../Product/Index";
import { useTranslation } from "react-i18next";
import {useRefresh} from "../../hooks/useRefresh";

interface modal {
  modal: {
    modal: boolean;
    message: string;
    image: string;
    productId: string;
  };
}
type TCategory = {
  category: TCat;
};
type TProduct = {
  price: number;
  country: string;
};
type IShipping = {
  express: TProduct;
  standard: TProduct;
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type Iutil = {
  util: {
    sellerRate: number;
  };
};
interface IStore {
  location: string;
}
type TVaraint = {
  option: string;
  stock: number;
  variant: string;
  price: number;
};
interface IVariant {
  stock: TVaraint[];
}
const schema = yup.object().shape({
  title: yup.string().required().min(4),
  description: yup.string().required().min(5),
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
  category: yup.string(),
  care: yup.string().required("This is required"),
  tags: yup.array().of(yup.string()).nullable(),
  details: yup.string().required("This is required"),
  terms: yup.boolean(),
  weight: yup.string().when("terms", {
    is: true,
    then: yup.string().required().min(1),
    otherwise: yup
      .string()
      .transform(() => {
        return undefined;
      })
      .nullable()
      .notRequired(),
  }),
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
  subCategory: yup.string(),
  standard: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  express: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
});
export default function EditModal() {
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "auto",
    bgcolor: "#000",
    // border: '2px solid #000',
    boxShadow: "24",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    // alignItems: 'center',
    minHeight: "500px",
    maxHeight: "500px",
    overflow: "scroll",
    borderRadius: "5",
    p: "1",
  };
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditItemDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
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
  const handleClose = () => dispatch(handleCloseModal());

  const onSuccess = (data: any) => {
    handleClose();
  };
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );

  const [rate, setRate] = useState<number>(rateDispatch);
  useEffect(() => {
    const rateExchange = localStorage.getItem("rateSeller");
    setRate(parseInt(rateExchange));
  }, []);
  const [categories, setCategories] = useState<string[]>([]);
  const onCategorySuccess = () => {
    reset();
  };
  const [defaultCategory, setDefaultCategory] = useState<string>("");

  const [subCategories, setSubCategories] = useState([]);

  const { data: category, isLoading: loading } =
    useGetAllCategories(onCategorySuccess);
  useEffect(() => {
    const categori1 = watch("category");
    const filterCategory = category?.filter(
      (categori) => categori.title === categori1
    );
    if (filterCategory?.length > 0) {
      setSubCategories(filterCategory[0].subcategories);
    }
  }, [watch("category")]);
  useEffect(() => {
    category?.map((value: any) => categories.push(value.title));
  }, [loading]);
  const productId: string = useSelector(
    (state: modal) => state.modal.productId
  );
  const { isLoading: updating, mutate: updateProduct } = useUpdateProduct(
    productId,
    onSuccess
  );
  const [location, setLocation] = useState<string>("");
  const onStoreSuccess = (data: IStore) => {
    setLocation(data.location);
  };
  const acceptedFileTypes  = {
    'image/*': ['.jpeg', '.jpg', '.png'],
   };
 const {refetch} = useGetSellerInfo(onStoreSuccess);
 useRefresh(refetch)
  const onSubmit: SubmitHandler<EditItemDefaultValue> = async (formData) => {
    const {
      test,
      file,
      express,
      standard,
      category: newCategory,
      care,
      description,
      subCategory,
      tags,
      terms,
      title,
      price,
      quantity,
      details,
    } = formData;
    const filterCategory = category?.find((categori) =>
      categori.subcategories.includes(subCategory)
    );
    const saveCategory = filterCategory?._id;

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
    const variantPlaceholder: any[] = [];
    if (data.variants?.length > 0) {
      let variantLength = variants.length;
      variants.map(({ stock }, index: number) => {
        stock.map((x: TVaraint, id: number) => {
          const { option, variant } = x;
          const price = Number((test[index].stock[id].price * rate).toFixed(2));
          const newStock = test[index].stock[id].name;
          const newData: TVaraint = {
            variant,
            option,
            price,
            stock: newStock,
          };
          variantPlaceholder.push(newData);
        });
      });
      // for(variantLength; variantLength--;){
      //         const newData = {
      //             variant: variants[variantLength].variant,
      //             option: variants[variantLength].option,
      //             const price =  Number((test[index].stock[id].price * rate).toFixed(2));
      //             const stock = test[index].stock[id].name
      //         }
      //         variantPlaceholder.push(newData)
      // }
    }
    const newPrice = Number(rate * price).toFixed(2);
    const newData = {
      price: newPrice,
      title,
      description,
      shipping,
      category: saveCategory ? saveCategory : newCategory,
      subcategory: subCategory,
      quantity,
      tags,
      care,
      variants: variantPlaceholder,
      instruction: care,
      shippingDetails: details,
    };
    if (file) {
      const photo = await uploadImages(formData.file);
      const photoIncluded = { ...newData, photo };
      updateProduct(photoIncluded);
      return;
    }
    updateProduct(newData);
    // reset();
    // const {title,category, subCategory : subcategory, description,details,quantity,price} = data

    // const updates = {
    //     photo,
    //     title,
    //     category,
    //     description,
    //     quantity,
    //     price,
    //     subcategory
    // }
    // // @ts-ignore
    // updateProduct(updates)
  };
  const stock = watch("quantity");
  const dispatch = useDispatch();
  const open: boolean = useSelector((state: modal) => state.modal.modal);
  const [data, setData] = useState<IProducts>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/product/${productId}`);
      setData(response.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, [productId]);
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);
  const [initialData, setInitialData] = useState<string>("");
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [initialSubCategory, setInitialSubCategory] = useState<string>("");
  const [isCheck, setIsChecked] = useState<boolean>(false);
  const [initialCategory, setInitialCategory] = useState<string>("");
  // const onFetchCategorySuccess = (data : TCategory) => {
  //     reset({
  //         category: data.category.title
  //     })
  //     console.log(data.category.title)3
  //     setInitialCategory(data.category.title)
  // }
  const [categoryId, setCategoryId] = useState<string>("");
  const handleRefetch = useCallback(
    async (id: string) => {
      const newRate = localStorage.getItem("sellerRate");
      setRate(Number(newRate));
      if (!id) return;
      const response = await axios.get(`${baseUrl}/category/${id}`);
      const data = response.data;
      const category = data.category.title;
      setInitialCategory(category);
    },
    [variants]
  );
  // const findStockLimit = useCallback((name: string) : number => {
  //     if(variants.length === 0) return
  //     const findLength = variants.find(x => x.variant === name);
  //     return findLength.length
  // },[variants])
  //  const {refetch} = useGetCategoryById(onFetchCategorySuccess, categoryId )
  useEffect(() => {
    if (data) {
      const groupVariant = groupByKey(data?.variants, "variant", {
        omitKey: false,
      });
      // let groupVariantLength =  Object.entries(groupVariant).length;
      const groupVariantPlaceHolder: IVariant[] = [];
      groupVariant &&
        Object.entries(groupVariant).forEach((x, index: number) => {
          const newData = {
            stock: x[1],
          };
          //@ts-ignore
          groupVariantPlaceHolder.push(newData);
        });
      setVariants(groupVariantPlaceHolder);

      // @ts-ignore
      if (data?.variants?.length > 0) setIsChecked(true);
      // @ts-ignore
      const variantPlaceholder: IVariant[] = [];
      let varaintsLength = data?.variants?.length;
      for (varaintsLength; varaintsLength--; ) {
        let length: number;
        if (
          data.variants[varaintsLength]?.variant ===
          data?.variants[varaintsLength - 1]?.variant
        ) {
          length =
            data.variants[varaintsLength]?.stock +
            data?.variants[varaintsLength - 1]?.stock;
        } else {
          length = data?.variants[varaintsLength]?.stock;
        }
        //@ts-ignore
        const { variant, option, price, stock } =
          data?.variants[varaintsLength];
        const newData = {
          length,
          variant,
          option,
          price,
          stock,
        };
        variantPlaceholder.push(newData);
      }
      reset(data);
      setInitialData( data?.photo?.length > 0 ?  data.photo[0] : '');
      reset({
        ...getValues(),
        care: data.instruction,
        details: data.shippingDetail,
      });
      reset({
        ...getValues(),
        price: Number((data?.price / rate).toFixed(2)),
        // express:Number((data?.shipping[0].express * rate).toFixed(2)),
        // standard:Number((data?.shipping[0].standard * rate).toFixed(2)),
      });
      setInitialSubCategory(data?.subcategory);
      // @ts-ignore
      handleRefetch(data?.category);
      // handleRefetch()
      if (data?.shipping?.length > 0) {
        reset({
          ...getValues(),
          express: Number(
            (data?.shipping[0]?.express.price / rate)?.toFixed(2)
          ),
          standard: Number(
            (data?.shipping[0]?.standard.price / rate)?.toFixed(2)
          ),
        });
      }
    }
  }, [reset, data, isLoading, isCheck]);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const handleGlobal = useCallback(() => {
    setIsGlobal((prevState) => !prevState);
  }, []);
  useEffect(() => {
      console.log(data)
  },[])
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"lg"} component={"main"}>
        <Box sx={style} className={"editModal"}>
          <Typography
            variant={"h6"}
            sx={{ justifyContent: "center" }}
            textAlign={"center"}
          >
            {t("edit_modal.edit_product")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {/*{loginLoading && <Loader/>}*/}
            {isLoading && <CircularProgress />}
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
                      message: "This field is required",
                    },
                  }}
                  render={({ field: { onChange, onBlur }, fieldState }) => (
                    <Dropzone
                      noClick
                      accept={acceptedFileTypes as unknown as Accept}
                      onDrop={(acceptedFiles) => {
                        setValue(
                          "file",
                          acceptedFiles as unknown as FileList[],
                          {
                            shouldValidate: true,
                          }
                        );
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
                                ? `transparent`
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
                                src={initialData}
                                alt="photo preview"
                                sx={{ width: "200px", height: "200px", mb: 2 }}
                              />
                            )}
                            <div>
                              {fieldState.error && (
                                <span role="alert">
                                  {fieldState.error.message}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<PhotoCamera fontSize="large" />}
                              onClick={open}
                            >
                              {t("edit_modal.btn_upload")}
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
                      id={t("edit_modal.product_title")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      data={errors?.description}
                      field={field}
                      id={t("edit_modal.product_description")}
                      type="text"
                    />
                  )}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="category"
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
                              // required
                              error={!!errors?.category}
                              helperText={errors?.category?.message}
                              label={t("edit_modal.category_title")}
                              placeholder={t(
                                "edit_modal.category_title_placeholder"
                              )}
                            />
                          )}
                          onChange={(e, data) => onChange(data)}
                        />
                      )}
                    />
                    <FormHelperText>
                      {t("edit_modal.current_category")} : {initialCategory}
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="subCategory"
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
                              // required
                              error={!!errors?.subCategory}
                              helperText={errors?.subCategory?.message}
                              label={t("edit_modal.sub_Category")}
                              placeholder={t(
                                "edit_modal.sub_category_placeholder"
                              )}
                            />
                          )}
                          onChange={(e, data) => onChange(data)}
                        />
                      )}
                    />
                    <FormHelperText>
                      {t("edit_modal.current_subcategory")} :{" "}
                      {initialSubCategory}
                    </FormHelperText>
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
                          id={`${currency} ${t("edit_modal.price_title")}`}
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
                          id={t("edit_modal.quantity_stock")}
                          type="number"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Controller
                  control={control}
                  name="tags"
                  defaultValue={"shopping"}
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <Autocomplete
                      id="shopping"
                      options={["shopping"]}
                      autoSelect
                      freeSolo
                      multiple={true}
                      // getOptionLabel={(cat) => cat}
                      renderInput={(params) => (
                        <TextField
                          sx={{ mt: 2 }}
                          {...params}
                          value={"shopping"}
                          variant="standard"
                          required
                          // error={!!errors?.pet}
                          // helperText={errors?.category?.message}
                          label={t("edit_modal.tags_title")}
                          placeholder={t("edit_modal.tags_placeholder")}
                        />
                      )}
                      onChange={(e, data) => onChange(data)}
                    />
                  )}
                />
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
                    sx={{
                      minWidth: "645px",
                      width: "100%",
                      background: "#f3f2f2",
                    }}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Shipping </TableCell>
                        <TableCell align="left">Price</TableCell>
                        {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                        {/*<TableCell align="left">EUROPE</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="Afirca"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="Asia"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="southAmerica"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="northAmerica"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="oceania"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="Europe"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                id="antarctica"
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
                      id={t("edit_modal.care_instruction")}
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
                      id={t("edit_modal.shipping_details")}
                    />
                  )}
                />
              </Stack>
            </Card>
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
                    sx={{
                      minWidth: "645px",
                      width: "100%",
                      background: "#f3f2f2",
                    }}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          {t("edit_modal.shipping_title")}
                        </TableCell>
                        <TableCell align="left">
                          {t("edit_modal.price_title")}
                        </TableCell>
                        {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                        {/*<TableCell align="left">EUROPE</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {t("edit_modal.ship_faq2")}
                          <Tooltip
                            placement={"top-start"}
                            title={t("edit_modal.ship_tooltip2")}
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
                                  "edit_modal.standard_shipping"
                                )}`}
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {t("edit_modal.ship_faq1")}
                          <Tooltip
                            placement={"top-start"}
                            title={t("edit_modal.ship_tooltip1")}
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
                                  "edit_modal.express_shipping"
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
              <Box sx={{ p: 3 }}>
                {/* <Typography variant={'body1'} >  Options </Typography>
                                <Stack  direction={'row'}>  <Checkbox
                                    color="primary"
                                    value={isCheck}
                                    sx={{maxWidth:25}}
                                    onClick={() => setIsChecked(prevState => !prevState)}
                                />
                                    <Typography mt={1} mx={1} variant={'body1'}>This product has options, like color and size </Typography>
                                </Stack> */}
                {variants?.length > 0 && (
                  <>
                    <Typography variant={"h6"}>
                      {t("edit_modal.edit_variant")}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.variant_title")}
                      </Grid>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.price_title")}
                      </Grid>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.stock_title")}
                      </Grid>
                    </Grid>
                    <Box>
                      {variants.map(({ stock }, index) =>
                        stock?.map(
                          ({ option, price, stock, variant }, id: number) => {
                            const newPrice = Number((price / rate).toFixed(2));
                            return (
                              <Box key={index + id}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} lg={3} mt={3}>
                                    <Typography>
                                      {variant} / {option}
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
                                      defaultValue={newPrice}
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
                                          label={`${currency} ${t(
                                            "edit_modal.price_title"
                                          )}`}
                                          name={"price"}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.name`}
                                      defaultValue={stock}
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
                                          label={t("edit_modal.stock_title")}
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
                                      ) > watch("quantity")
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
                        )
                      )}
                      {/*<Button variant={'outlined'} fullWidth type={'submit'}*/}
                      {/*        className={'color'}>Save</Button>*/}
                    </Box>
                  </>
                )}
              </Box>
            </Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                p: 1,
                border: "2px solid black",
              }}
            >
              {/*<Stack direction={'row'} spacing={2}>*/}
              {/*    <Switch onChange={handleGlobal} checked={isGlobal}  />*/}
              {/*    <Stack spacing={1}>*/}
              {/*        <Box/>*/}
              {/*        <Typography variant={'subtitle2'}>Global</Typography>*/}
              {/*    </Stack>*/}
              {/*</Stack>*/}
              <Button
                className={"color"}
                // disabled={isLoading}
                type="submit"
                variant="contained"
              >
                {updating && <CircularProgress />}
                {t("edit_modal.btn_update")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
