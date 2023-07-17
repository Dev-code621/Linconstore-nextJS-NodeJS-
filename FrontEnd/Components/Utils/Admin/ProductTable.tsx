import React, {useCallback, useContext, useEffect, useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress, Switch, Typography } from "@mui/material";
import { AddTaskOutlined, DeleteOutline } from "@mui/icons-material";
import { numberWithCommas } from "../../../Helpers/utils";
import { IAdminProducts } from "../../../Helpers/Types";
import {
  useDeleteAdminProduct,
  useUpdateAdminProducts,
} from "../../../hooks/useDataFetch";
import Truncate from "../../../Helpers/Truncate";
import ContextApi from "../../../Store/context/ContextApi";
interface IProducts {
  products: IAdminProducts[];
  handleRefetch: () => void;
}
const ProductTable: React.FC<IProducts> = ({ products, handleRefetch }) => {
  const handleChange = (id: string) => {
    const data = {
      id,
    };
    updateProduct(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const { mutate: updateProduct } = useUpdateAdminProducts(onSuccess);
  const [currentId, setCurrentId] = useState<string>("");
  const handleDeleteProduct = useCallback((id: string) => {
    setCurrentId(id);
    const data = { id };
    deleteProduct(data);
  }, []);
  const onDeleteSuccess = () => {
    handleRefetch();
  };
  const { mutate: deleteProduct, isLoading: isDeleting } =
    useDeleteAdminProduct(onDeleteSuccess);

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
  const adminRate : number = useContext(ContextApi).adminRate;

  return (
    <>
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Published</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {Truncate(row.title, 40)}
                  </TableCell>
                  <TableCell align="right"> {row.category.title} </TableCell>
                  <TableCell align="right">
                    £ {numberWithCommas(adminRate * row.price)}
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      onChange={() => handleChange(row._id)}
                      checked={row.active}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isDeleting && currentId === row._id && (
                      <CircularProgress />
                    )}
                    <DeleteOutline
                      className={"pointer"}
                      onClick={() => handleDeleteProduct(row._id)}
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default ProductTable;
