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
import UserTable from "../Utils/Admin/UserTable";
import { TAdminUser } from "../../Helpers/Types";
import { useGetAdminUsers } from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";

const Users: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    const newUsers = data?.filter((user) => {
      const userName =
        user.firstName.toLowerCase() + user.lastName.toLowerCase();
      return userName.includes(newSearch);
    });
    setUsers(newUsers);
  };
  const [users, setUsers] = useState<TAdminUser[]>([]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  const onSuccess = (data: TAdminUser[]) => {
    setUsers(data);
  };
  const { isFetched, isFetching, refetch, data } = useGetAdminUsers(onSuccess);
  useTokenRefetch(refetch)
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
            Users
          </Typography>
          <Box sx={{ width: 500 }}>
            <Search search={search} handleChange={handleChange} />
          </Box>
        </Stack>
        <Typography variant={"h6"} sx={{ mt: 4 }}>
          {users?.length}
        </Typography>
      </Stack>
      <Box>
        {isFetching && <CircularProgress />}
        {isFetched && users.length > 0 && (
          <UserTable users={users} handleRefetch={handleRefetch} />
        )}
      </Box>
    </Card>
  );
};
export default Users;
