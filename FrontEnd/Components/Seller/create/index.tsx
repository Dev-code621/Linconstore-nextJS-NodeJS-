import Head from "next/head";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ArrowBack, SearchOutlined } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Image from "next/image";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@mui/material/Checkbox";
import AddProduct from "./AddProduct";
import Wrapper from "../../Wappers/Container";
import Search from "../../Utils/Search";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { addProductId, editModal, modalUserOpen } from "../../../Store/Modal";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  useDeleteSellerProducts,
  useGeStoreProducts,
  useGetSellerInfo,
  useGetSellerProducts,
  useGetStore,
  useUpdateSellerProductActive,
} from "../../../hooks/useDataFetch";
import { TSellerStore } from "../../../Helpers/Types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useRefresh, useTokenRefetch} from "../../../hooks/useRefresh";
import ContextApi from "../../../Store/context/ContextApi";
let isFirst =false
function createData(
  photos: string,
  product: string,
  category: string,
  stock: number,
  checked: boolean
) {
  return { photos, product, category, stock, checked };
}

interface IStore {
  location: string;
}
interface IModal {
  modal: {
    modal: boolean;
  };
}
const PostItem: React.JSXElementConstructor<any> = () => {
  const [search, setSearch] = React.useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [initialData, setInitialData] = useState([]);
  const [check, setCheck] = useState(false);
  const isChecked: boolean = initialData.some((data) => data.isActive);
  const allChecked: boolean = initialData.every((data) => data.isActive);
  const [stepper, setStepper] = useState(false);
  const [sort, setSort] = useState("Recent");
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setId] = React.useState("");

  const handleSort = useCallback(
    (event: SelectChangeEvent) => {
      setSort(event.target.value as string);
      // const sorted = initialData.sort((a : any,b : any)  => sort ? b.product.localeCompare(a.product) :   a.product.localeCompare(b.product));
      // setInitialData(sorted)
    },
    [sort, initialData]
  );
  const onStoreSuccess = (data: any) => {
    const sorted = data.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    );

    setInitialData(sorted);
  };
  const isUpdatingProduct: boolean = useSelector(
    (state: IModal) => state.modal.modal
  );

  const {  refetch, isFetching } = useGeStoreProducts(onStoreSuccess);
  useTokenRefetch(refetch)
  const handleChange = (_id: string) => {
    const data: any = initialData?.find((row) => row._id === _id);
    data.isActive = !data.isActive;
    const filteredData: any = initialData?.filter((row) => row._id !== _id);
    filteredData.push(data);
    const sorted = filteredData.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    );
    setInitialData(sorted);
  };
  const dispatch = useDispatch();
  const handleCheckAll = () => {
    setCheck((prevState) => !prevState);
    const newData: any = [];
    if (allChecked) {
      initialData.forEach((data) => {
        data.isActive = false;
        newData.push(data);
      });
    } else {
      initialData.forEach((data) => {
        data.isActive = true;
        newData.push(data);
      });
    }
  };
  const onDeleteHandler = (id: string, orders : number, quantity: number) => {
    if(orders > 0) return ;
    if (quantity === 0) return ;
    // const filter = initialData.filter((row) => row.isActive);
    // filter.forEach((row) => {
    //   deleteIds.push(row._id);
    // });
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNext = () => {
    const deleteIds: string[] = [];
    deleteIds.push(selectedId);
    const data = {
      ids: deleteIds,
    };
    deleteProduct(data);
    setOpen(false);
  };
  const onDeleteSuccess = () => {
    refetch();
  };
  const { mutate: deleteProduct, isLoading: isDeleting } =
    useDeleteSellerProducts(onDeleteSuccess);
  useEffect(() => {
    const timeout = setTimeout(() => {
        isFirst = true
    }, 500)

    return () => clearTimeout(timeout)
  },[])
  useEffect(() => {
    if (isFirst){
      refetch();
    }
  }, [isUpdatingProduct]);
  const updateProduct = (id: string) => {

    const data = {
      id,
    };
    // @ts-ignore
    dispatch(addProductId(data));
    dispatch(editModal());
  };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const onStatusSuccess = () => {
    refetch();
  };
  const [currentId, setCurrentId] = useState<string>("");
  const handleChangeStatus = (id: string) => {
    const data = {
      id,
    };
    setCurrentId(id);
    updateStatus(data);
  };
  const [location, setLocation] = useState<string>("");
  const onSuccess = (data: IStore) => {
    setLocation(data.location);
  };
  const handleRefetch = useCallback(() => {
    refetch();
  }, [isUpdatingProduct]);
   const {refetch: refresh} =   useGetSellerInfo(onSuccess);
   useTokenRefetch(refresh)
  const { mutate: updateStatus, isLoading: isUpdating } =
    useUpdateSellerProductActive(onStatusSuccess);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  return (
    <>
      <Head>
        <title>Add Product | seller dashboard linconstore</title>
        <meta name={"Add Product"} content={"These are Add Product"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
        {!stepper && (
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContents: "space-between",
                marginBottom: "15px",
              }}
            >
              {isMobile && (
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
              )}
              <Typography variant={"h6"} flexGrow={1}>
                {t("seller.post.title")}
              </Typography>
              <Button
                  disabled={!sellerIsActive}
                variant={"contained"}
                className={"color"}
                onClick={() => setStepper(true)}
              >
                {t("seller.post.btn_add")}
              </Button>
            </Box>

            {/*<Stack direction={ isMobile ? 'column' :  'row'} sx={{minWidth: '100%'}} spacing={2} my={2}>*/}
            {/*    /!*<Search search={search} handleChange={handleSearchChange}/>*!/*/}
            {/*    <Box sx={{minWidth: {xs: '100%' , sm: '60%', md: '70%', lg:'80%' } }}>*/}
            {/*    <Search search={search} handleChange={handleSearchChange}/>*/}
            {/*    </Box>*/}
            {/*    /!*<FontAwesomeIcon  icon={fa}/>*!/*/}
            {/*    <FormControl sx={{minWidth: 120, color: '#fff' }} >*/}
            {/*        /!*<InputLabel id="demo-simple-select-label" sx={{color: '#000'}}>Sort</InputLabel>*!/*/}

            {/*        <Select*/}
            {/*        labelId="demo-simple-select-label"*/}
            {/*        id="demo-simple-select"*/}
            {/*        value={sort}*/}
            {/*        placeholder={'Sort'}*/}
            {/*        className={'sortButton'} sx={{mt:2, bgcolor: '#fff', color: '#000', border: '2px solid black',*/}
            {/*        "& .MuiSvgIcon-root": {*/}
            {/*            color: "black",*/}
            {/*        }*/}
            {/*    }}*/}

            {/*        onChange={handleSort}*/}
            {/*    >*/}
            {/*        <MenuItem value={'Recent'}>Recent</MenuItem>*/}
            {/*        <MenuItem value={'A-Z'}>A-Z</MenuItem>*/}
            {/*        <MenuItem value={'Z-A'}>Z-A</MenuItem>*/}
            {/*    </Select>*/}
            {/*    </FormControl>*/}
            {/*</Stack>*/}
            {initialData.length > 0 && (
              <Paper sx={{ width: "100%" }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 350 }}
                    size={"small"}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        {/* <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={allChecked}
                        onChange={handleCheckAll}
                      />
                    </TableCell> */}
                        <TableCell align="left">
                          {t("seller.post.data_field.image")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.product")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.category")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.stock")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.status")}
                        </TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {initialData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((row: any, index: number) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={row.isActive}
                          onChange={() => handleChange(row._id)}
                        />
                      </TableCell> */}
                            <TableCell align="left">
                              <Image
                                src={row.photo[0]}
                                width={"63px"}
                                height={"46px"}
                                placeholder={"blur"}
                                blurDataURL={row.photo[0]}
                                alt={"icon of menue"}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width: "100%",
                                maxWidth: "250px",
                                minWidth: "250px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.title}
                            </TableCell>
                            <TableCell align="left">
                              {row.category.title}
                            </TableCell>
                            <TableCell align="left">{row.quantity}</TableCell>
                            <TableCell align="left">
                              {isUpdating && currentId === row._id && (
                                <CircularProgress />
                              )}
                              <Switch
                                  disabled={!sellerIsActive}
                                checked={row.active && row.quantity > 0}
                                onChange={() => handleChangeStatus(row._id)}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                display: "flex",
                                width: "100%",
                                gap: "10px",
                              }}
                            >
                              <Button
                                onClick={() => updateProduct(row._id)}
                                disabled={!sellerIsActive}
                                variant={"outlined"}
                              >
                                {t("seller.post.btn_edit")}
                              </Button>

                            {/* {t("seller.post.btn_remove")} */}
                            <div
                              className="font-icon-wrapper"
                              onClick={() => onDeleteHandler(row._id, row.orders, row.quantity)}
                            >
                              <IconButton disabled={!sellerIsActive || row.orders > 0 } aria-label="delete">
                                 <Delete />
                              </IconButton>
                            </div>
                            {/* {isDeleting && <CircularProgress />} */}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={initialData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Stack>
      )}
      {stepper && (
        <AddProduct
          handleRefetch={handleRefetch}
          setStepper={setStepper}
          location={location}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("seller.post.confirm_modal.title")}
        </DialogTitle>
        <DialogContent> {t("seller.post.confirm_modal.content")}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {t("seller.post.confirm_modal.btn_cancel")}
          </Button>
          <Button onClick={handleNext} autoFocus>
            {t("seller.post.confirm_modal.btn_ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
    </>
  );
};
export default React.memo(PostItem);
