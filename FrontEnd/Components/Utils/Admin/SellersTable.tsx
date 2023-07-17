import React, { useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Switch, Typography } from "@mui/material";
import { numberWithCommas } from "../../../Helpers/utils";
import { DeleteOutlined } from "@mui/icons-material";
import { TAdminSeller } from "../../../Helpers/Types";
import {
  useDeleteAdminSeller,
  useUpdateAdminSellers,
} from "../../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { deleteModalOpen } from "../../../Store/Modal";
import { currencies } from "../../Layouts/Seller/Dashboard";
interface IAdminSeller1 {
  store: TAdminSeller,
  length: number
}
interface IAdminSeller {
  sellers: IAdminSeller1[];
  handleRefetch: () => void;
}
const SellersTable: React.FC<IAdminSeller> = ({ sellers, handleRefetch }) => {
  const handleUpdate = (id: string) => {
    const data = {
      id,
    };
    updateSeller(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const dispatch = useDispatch();
  const handleDelete = (id: string) => {
    // const data = {
    //     id
    // }
    dispatch(deleteModalOpen({ id, type: "something" }));
    // deleteAdmin(data)
  };
  const getCurrency = useCallback((label: string) => {
    const currency = currencies.find((x) => x.value === label);
    return currency.label;
  }, []);
  const { mutate: updateSeller } = useUpdateAdminSellers(onSuccess);
  const { mutate: deleteAdmin } = useDeleteAdminSeller(onSuccess);

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
              <TableCell>Store name</TableCell>
              <TableCell align="left">Plan</TableCell>
              <TableCell align="left">Store balance</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Listing</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map(({length, store}, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {store.name}
                  </TableCell>
                  <TableCell align="left"> {store.owner.package} </TableCell>
                  <TableCell align="left">
                    {getCurrency(store.currency)}
                    {numberWithCommas(store.balance)}
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={store.isVerified}
                      onChange={() => handleUpdate(store._id)}
                    />
                  </TableCell>
                  <TableCell align="right"> {length} </TableCell>
                  <TableCell align="right">
                    <DeleteOutlined
                      onClick={() => handleDelete(store._id)}
                      className={"pointer"}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sellers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default SellersTable;
