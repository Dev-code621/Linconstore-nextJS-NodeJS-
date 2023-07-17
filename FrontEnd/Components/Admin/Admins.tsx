import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Search from "../Utils/Search";
import ProductTable from "../Utils/Admin/ProductTable";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import AdminsTable from "../Utils/Admin/AdminsTable";
import { useCreateAdmins, useGetAdmins } from "../../hooks/useDataFetch";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import {useTokenRefetch} from "../../hooks/useRefresh";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  section: yup.string().required(),
});
type IModal = {
  modal: {
    isUpdating: boolean;
  };
};
type addAdmin = {
  email: string;
  password: string;
  section: string;
};
let isFirst = false
export type mutateAdmin = {
  email: string;
  password: string;
  section: string;
  _id: string;
};
const Admin: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setSearch(value);

    const newAdmins = data?.filter((admin) => admin.email?.includes(value));
    setAdmins(newAdmins);
  };
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<addAdmin>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      section: "",
    },
  });
  useEffect(() => {
      const timeout = setTimeout(() => {
        isFirst = true
      },300)
    return () => clearTimeout(timeout)
      },

      []);
  const onSubmit: SubmitHandler<addAdmin> = async (data) => {
    const newData = {
      ...data,
    };
    createAdmin(newData);
  };
  const dispatch = useDispatch();
  const isUpdating = useSelector((state: IModal) => state.modal.isUpdating);

  useEffect(() => {
   if (isFirst) refetch();
  }, [isUpdating]);

  const onAdminSuccess = () => {
    reset();
    refetch();
    dispatch(
      snackBarOpen({
        message: "Admin was Successfully created",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const { mutate: createAdmin, isLoading } = useCreateAdmins(onAdminSuccess);
  const [admins, setAdmins] = useState<mutateAdmin[]>([]);
  const onSuccess = (data: mutateAdmin[]) => {
    setAdmins(data);
  };
  const { isFetched, refetch, data, isFetching } = useGetAdmins(onSuccess);
  useTokenRefetch(refetch)
  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  return (
    <Card
      elevation={0}
      sx={{ background: "#f3f2f2", mt: 1, p: 2, minHeight: "90vh" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {isMobile && (
          <ArrowBack onClick={() => router.back()} className={"pointer"} />
        )}
      </Box>
      <Stack
        spacing={0}
        sx={{
          display: "flex",
          p: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant={"h6"} sx={{ mt: 4, minWidth: "150px" }}>
          Administrators
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Search search={search} handleChange={handleChange} />
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isFetching && (
          <Typography variant={"h6"} textAlign={"center"}>
            <CircularProgress />
          </Typography>
        )}
        {isFetched && admins.length > 0 && (
          <AdminsTable admins={admins} handleRefetch={handleRefetch} />
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 5 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <FormControl sx={{ minWidth: "100%", mt: 2 }}>
                <InputLabel id="demo-simple-select-label" shrink={false}>
                  {watch("section") === "" && "Select admin section"}
                </InputLabel>
                <Controller
                  name="section"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      variant={"outlined"}
                      className={"sortButton"}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: "black",
                        },
                      }}
                    >
                      <MenuItem value={"Blog "}>Blog admin</MenuItem>
                      <MenuItem value={"verify"}>Verify admin</MenuItem>
                      <MenuItem value={"store"}>Store admin </MenuItem>
                      <MenuItem value={"analysis"}>Analysis admin</MenuItem>
                      <MenuItem value={"support"}>CS support </MenuItem>
                      <MenuItem value={"marketing"}>Marketing admin </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors?.section?.message}{" "}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Controller
                name="email"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.email}
                    variant={true}
                    field={field}
                    id="email"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Controller
                name="password"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.password}
                    variant={true}
                    type={"password"}
                    field={field}
                    id="Password"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Button
                sx={{ mt: 2, minHeight: "55px" }}
                variant={"outlined"}
                fullWidth
                type={"submit"}
                disabled={isLoading}
                color={"inherit"}
                className={"color"}
              >
                {isLoading && <CircularProgress />} Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};
export default Admin;
