import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Search from "../Utils/Search";
import VerificationTable from "../Utils/Admin/VerificationTable";
import { a11yProps, TabPanel } from "../Utils/TabsPanel";
import ReviewTable from "../Utils/Admin/ReviewTable";
import { useFetchStores } from "../../hooks/useDataFetch";
import { TSellerStore } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import {useTokenRefetch} from "../../hooks/useRefresh";

interface modal {
  modal: {
    isUpdating: boolean;
    requestModal: boolean
  };
}
interface IVerify {
  balance: number,
  seller: TSellerStore
}
let isFirst = false

const Verification: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value.toLowerCase();
    setSearch(value);
    const newRequests = data?.filter((request) =>
      request?.seller.storeId?.name?.toLowerCase().includes(value)
    );
    setRequests(newRequests);
  };
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [requests, setRequests] = useState<IVerify[]>([]);

  const [reviews, setReviews] = useState<IVerify[]>([]);
  const onSuccess = (data: IVerify[]) => {
    const reviews = data.filter(x => !x.seller.isActive)
    setReviews(reviews)
    setRequests(data);
  };
  useEffect(() => {
      const timeout = setTimeout(() => {
            isFirst = true
      },300)

    return () => clearTimeout(timeout)
  },[])
  const { isFetched, isFetching, data, refetch } = useFetchStores(onSuccess);
  useTokenRefetch(refetch)
  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  const open : boolean = useSelector((state: modal) => state.modal.requestModal);

  const isUpdating: boolean = useSelector(
    (state: modal) => state.modal.isUpdating
  );
  useEffect(() => {
    if (isFirst) refetch();
  }, [isUpdating, open]);

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { background: "#000" } }}
          aria-label="tabs "
        >
          <Tab
            sx={{
              minWidth: "50%",
              borderRadius: "20px",
              backgroundColor: value === 0 ? "#000" : "inherit",
              color: value === 0 ? "#fff !important" : "inherit",
            }}
            label="Request"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              minWidth: "50%",
              borderRadius: "20px",
              backgroundColor: value === 1 ? "#000" : "inherit",
              color: value === 1 ? "#fff !important" : "inherit",
            }}
            label="Review"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <Stack direction={"row"} spacing={2}>
        <Typography variant={"h6"} sx={{ mt: 4, minWidth: "120px" }}>
          All account
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Search search={search} handleChange={handleChange} />
        </Box>
      </Stack>
      {isFetched && requests.length === 0 && (
        <Typography variant={"h6"} textAlign={"center"}>
          {" "}
          Such Empty!{" "}
        </Typography>
      )}
      {isFetching && (
        <Typography variant={"h6"} textAlign={"center"}>
          {" "}
          <CircularProgress />{" "}
        </Typography>
      )}

      <Box sx={{ width: "100%" }}>
        <TabPanel value={value} index={0}>
          {isFetched && requests.length > 0 && (
            <VerificationTable
              requests={requests}
              handleRefetch={handleRefetch}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isFetched && requests.length > 0 && (
            <ReviewTable reviews={reviews} handleRefetch={handleRefetch} />
          )}
        </TabPanel>
      </Box>
    </Card>
  );
};
export default Verification;
