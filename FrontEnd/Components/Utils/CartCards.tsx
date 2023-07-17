import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  AddCircleOutlined,
  DeleteOutline,
  FavoriteBorderOutlined,
  RemoveCircleOutlined,
} from "@mui/icons-material";
import {useAddUserWishlist, useDecrementCart, useDeleteCart, useIncrementCart} from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import Truncate from "../../Helpers/Truncate";
import ContextApi from "../../Store/context/ContextApi";
import {IProducts} from "../../Helpers/Types";
import { groupByKey } from "../Product/Index";
type TVariant = {
  option: string;
  variant: string;
};
type IVariant = {
  option: string;
  stock: number;
  price: number;
};
type IMain = {
  variant: string;
  options: IVariant[];
};
type TProductCart = {
  productId: IProducts;
  name: string;
  quantity: number;
  price: number;
  variants: TVariant[];
  photo: string;
};
interface IProductCart {
  cart: TProductCart;
  handleRefetch: () => void;
  deleteHandler: (id: string) => void;
}
const CartCards: React.FC<IProductCart> = ({
  cart,
  handleRefetch,
  deleteHandler,
}) => {
  const {
    quantity: initialQuantity,
    price: initialPrice,
    name,
    photo,
    productId,
    variants,
  } = cart;
  const [value, setValue] = useState<number>(initialQuantity);
  const [price, setPrice] = useState<number>(initialPrice);
  const isMatches = useMediaQuery("(max-width: 460px)");
  const handleCartChange = useContext(ContextApi).handleCartChange;
  const handleUpdateCart = useContext(ContextApi).handleUpdateCart
  const onIncrementSuccess = () => {
    handleUpdateCart()
  }
  const onDecrementSuccess = () => {
    handleUpdateCart()
  }
  const {mutate: incrementCart} = useIncrementCart(onIncrementSuccess)
  const {mutate: decrementCart} = useDecrementCart(onDecrementSuccess)
  const [variantLimit, setVariantLimit] = useState<number>(productId.quantity)
  const increment = useCallback(() => {
    if (value === variantLimit) return;
    const data = {
      productId: productId._id
    }
    incrementCart(data)
    setValue((cur) => cur + 1);
  }, [value, variantLimit]);
  const decrement = useCallback(() => {
    if (value === 1) {
      return;
    }
    const data = {
      productId: productId._id
    }
    decrementCart(data)
    setValue((cur) => cur - 1);
  }, [value]);
  const handleDelete = (id: string) => {
    deleteHandler(id);
    deleteCart(id);
  };
  const handleFavourite = (id: string) => {
    const data = { productId: id, variants, price };
    addToFav(data);
    deleteHandler(id);
    // handleDelete(id)
  };
  const dispatch = useDispatch();
  const onDeleteSuccess = () => {
    handleCartChange();
    dispatch(
      snackBarOpen({
        message: "success",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setTimeout(() => {
      handleRefetch();
    }, 2000);
  };
  useEffect(() => {
    if (isError || isDeleteError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong",
          severity: "error",
          snackbarOpen: true,
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, []);

  const {
    mutate: deleteCart,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useDeleteCart(onDeleteSuccess);
  const {
    mutate: addToFav,
    isLoading,
    isError,
  } = useAddUserWishlist(onDeleteSuccess);
  const [variant, setVariants] = useState<IMain[]>([]);

  useEffect(() => {
    if(!cart) return
    const groupedVariant = groupByKey(productId.variants, "variant", {
      omitKey: true,
    });
    if(!groupedVariant) return
    const variantPlaceholder: IMain[] = [];
    Object.entries(groupedVariant).map((x) => {
      const data = {
        variant: x[0] as string,
        options: x[1] as IVariant[],
      };
      variantPlaceholder.push(data);
    });
    setVariants(variantPlaceholder);
  }, []);
  useEffect(() => {
      if(variants.length === 0) return
      let option1 = variants[0].option ;
      let option2 = variants.length > 1 ? variants[1].option : '';
      let stock = 1000000;
      variant.map(x => {
        x.options.map(y => {
          if(y.option === option1){
            if(y.stock < stock){
              stock = y.stock
            }
          }
          if(variants.length > 1){
            if(y.option === option2){
              if(y.stock < stock){
                stock = y.stock
              }
            }
          }
        })
      })
        setVariantLimit(stock)
  },[value, variant])
  return (
    <Card className={'cartMax'} sx={{ my: 1, maxWidth: 405, minWidth: 300 }}>
      {/* design a cart card */}
      <Box sx={{ display: "flex" }}>
        <img
          src={photo}
          width={"200px"}
          height={"120px"}
          placeholder={"blur"}
          className={"cartMin"}
          alt={"photo image"}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction={"row"}
            spacing={3}
            sx={{ p: 1, display: "flex", justifyContent: "space-between" }}
          >
            <Stack>
              <Typography variant={isMatches ? "body2" : "body1"}>
                <b> {Truncate(name, 22)}</b>
              </Typography>
              {variants.length > 0 && (
                <Typography gutterBottom variant={"body2"}>
                  {variants[0].variant + " - " + variants[0].option}
                </Typography>
              )}
              {variants.length > 1 && (
                <Typography gutterBottom variant={"body2"}>
                  {variants[1].variant + " - " + variants[1].option}
                </Typography>
              )}
            </Stack>
            <span style={{ marginTop: 1 }}>
              <Typography
                sx={{ minWidth: 46, ml: 2 }}
                variant={isMatches ? "body2" : "body1"}
              >
                <b>${Number((value * price).toFixed(2))}</b>{" "}
              </Typography>
            </span>
          </Stack>
          {isLoading && (
            <Typography variant={"body1"}>
              {" "}
              adding... <CircularProgress />{" "}
            </Typography>
          )}
          {isDeleting && (
            <Typography variant={"body1"}>
              {" "}
              deleting... <CircularProgress />{" "}
            </Typography>
          )}
          <Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
            <Stack direction={"row"} spacing={2}>
              <DeleteOutline
                onClick={() => handleDelete(productId._id)}
                className={"pointer"}
              />
              <FavoriteBorderOutlined
                onClick={() => handleFavourite(productId._id)}
                className={"pointer"}
              />
            </Stack>
            <Stack direction={"row"}>
              <RemoveCircleOutlined onClick={decrement} className={"pointer"} />
              {value}
              <AddCircleOutlined onClick={increment} className={"pointer"} />
            </Stack>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
export default CartCards;
