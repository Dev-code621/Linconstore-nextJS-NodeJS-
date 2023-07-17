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
import SellersTable from "../Utils/Admin/SellersTable";
import { useAdminSellers } from "../../hooks/useDataFetch";
import { TAdminSeller } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import { currencies } from "../Layouts/Seller/Dashboard";
import {useTokenRefetch} from "../../hooks/useRefresh";
interface Iupdate {
  modal: {
    isUpdating: boolean;
  };
}
interface IAdminSeller {
  store: TAdminSeller,
  length: number
}
const Sellers: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [currency, setCurrency] = useState<string>("$");
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      const newSearchValue = search.toLowerCase();
      const newSeller = data?.filter((seller : IAdminSeller) =>
        seller?.store?.name?.toLowerCase().includes(newSearchValue)
      );
      setSelllers(newSeller);
      setSearch(search);
    },
    [search]
  );
  const [sellers, setSelllers] = useState<IAdminSeller[]>([]);
  const onSuccess = (data: IAdminSeller[]) => {
    setSelllers(data);
  };
  const { data, isFetching, isFetched, refetch } = useAdminSellers(onSuccess);
  useTokenRefetch(refetch)
  const isUpdating = useSelector((state: Iupdate) => state.modal.isUpdating);
  const handleRefetch = useCallback(() => {
    refetch();
  }, [isUpdating]);
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
        <Stack direction={"row"} spacing={2} sx={{ minWidth: "100%" }}>
          {" "}
          <Typography variant={"h6"} sx={{ mt: 4, minWidth: "120px" }}>
            Sellers
          </Typography>
          <Box sx={{ width: 500 }}>
            <Search search={search} handleChange={handleChange} />
          </Box>
        </Stack>
        <Typography variant={"h6"} sx={{ mt: 4 }}>
          {sellers?.length}{" "}
        </Typography>
      </Stack>
      <Box>
        {isFetching && <CircularProgress />}
        {isFetched && sellers?.length > 0 && (
          <SellersTable handleRefetch={handleRefetch} sellers={sellers} />
        )}
      </Box>
    </Card>
  );
};
export default Sellers;
