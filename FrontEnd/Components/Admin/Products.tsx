import React, { useCallback, useState } from "react";
import {
  Card,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Search from "../Utils/Search";
import ProductTable from "../Utils/Admin/ProductTable";
import { IAdminProducts } from "../../Helpers/Types";
import { useFetchProductForAdmin } from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";

const Products: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<IAdminProducts[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);

    const newProducts = data?.filter((product) =>
      product?.title?.toLowerCase().includes(search)
    );
    setProducts(newProducts);
    if (search.length === 1 && event.target.value === '') {
      setProducts(data)
    }
  };
  const onSuccess = (data: IAdminProducts[]) => {
    setProducts(data);
  };
  const { isLoading, isFetched, isFetching, data, refetch } =
    useFetchProductForAdmin(onSuccess);

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
        <Stack direction={"row"} spacing={2} sx={{ minWidth: "90%" }}>
          {" "}
          <Typography variant={"h6"} sx={{ mt: 4, minWidth: "120px" }}>
            Products
          </Typography>
          <Box sx={{ width: 500 }}>
            <Search search={search} handleChange={handleChange} />
          </Box>
        </Stack>
        <Typography variant={"h6"} sx={{ mt: 4, mr: 2 }}>
          {products.length}
        </Typography>
      </Stack>
      <Box>
        {isFetching && <CircularProgress />}
        {isFetched && products.length > 0 && (
          <ProductTable handleRefetch={handleRefetch} products={products} />
        )}
      </Box>
    </Card>
  );
};
export default Products;
