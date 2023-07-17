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
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { TAdminSeller, TSellerStore, TStoreId } from "../../../Helpers/Types";
import {
  useDeleteAdminSeller,
  useUpdateAdminSellers,
} from "../../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { deleteModalOpen } from "../../../Store/Modal";
import { currencies } from "../../Layouts/Seller/Dashboard";
import { openModal } from "../../../Store/Payout";
import Button from "@mui/material/Button";
interface IAdminPayout  {
  seller: TSellerStore,
  length: number,
  balance: number
}

interface IAdminSeller {
  stores: IAdminPayout[];
  handleRefetch: () => void;
}
const StoreTable: React.FC<IAdminSeller> = ({ stores, handleRefetch }) => {
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
    dispatch(openModal({ storeId: id, open: true, isUpdating: false }));
    // deleteAdmin(data)
  };

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
  const getStoreCurrency = (currency: string) :string =>{
        if (currency === 'Pounds') return  'GBP'
          return currency
  }
  return (
    <>
      <Typography variant={"h6"} my={2}>
        {" "}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Store name</TableCell>
              <TableCell align="left">Seller Email</TableCell>
              <TableCell align="left">Store balance</TableCell>
              <TableCell align="left">Update Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map(({seller, balance, length}, index) => {
                if (seller.storeId) {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {seller.storeId?.name}
                      </TableCell>
                      <TableCell align="left"> {seller.owner?.email} </TableCell>
                      <TableCell align="left">
                        {" "}
                        { getStoreCurrency(seller.storeId?.currency) + " " + seller.storeId?.balance.toFixed(2)}
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        <Button
                          disabled={seller.storeId?.disabled}
                          onClick={() => handleDelete(seller.storeId._id)}
                          className={"pointer"}
                        >
                          <EditOutlined />
                        </Button>{" "}
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={stores.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default StoreTable;
