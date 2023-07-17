import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Switch, Typography } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { TAdminUser } from "../../../Helpers/Types";
import {
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "../../../hooks/useDataFetch";

interface IAdminUser {
  users: TAdminUser[];
  handleRefetch: () => void;
}
const UserTable: React.FC<IAdminUser> = ({ users, handleRefetch }) => {
  const handleUpdate = (id: string) => {
    const data = {
      id,
    };
    updateUser(data);
  };
  const handleDelete = (id: string) => {
    const data = {
      id,
    };
    deleteUser(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const { mutate: updateUser } = useUpdateAdminUser(onSuccess);
  const { mutate: deleteUser } = useDeleteAdminUser(onSuccess);

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
  return (
    <>
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Email Address</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">No of orders</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => {
                  if (!row.isClosed) {
                return (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.isVerified ? row.firstName + " " + row.lastName : " "}
                  </TableCell>
                  <TableCell align="left"> {row.phone} </TableCell>
                  <TableCell align="left">
                    {row.isVerified ? row.email : " "}
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={row.isVerified}
                      onChange={() => handleUpdate(row._id)}
                    />
                  </TableCell>
                  <TableCell align="right"> {row.orders} </TableCell>
                  <TableCell align="right">
                    <DeleteOutlined
                      onClick={() => handleDelete(row._id)}
                      className={"pointer"}
                    />
                  </TableCell>
                </TableRow>
                )}})}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default UserTable;
