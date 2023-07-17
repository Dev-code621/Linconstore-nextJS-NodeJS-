import React, { useCallback, useState } from "react";
import Head from "next/head";
import {
  Card,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import Search from "../Utils/Search";
import OrdersAccordion from "../Utils/OrdersAccordion";
import { useRouter } from "next/router";
import { useSellerCancelledOrder } from "../../hooks/useDataFetch";
import {
  addAddress,
  IAdminProducts,
  IUser,
  IVariants,
} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import {useTokenRefetch} from "../../hooks/useRefresh";

interface IOrders {
  userId: IUser;
  productId: IAdminProducts;
  _id: string;
  status: string;
  active: boolean;
  address: string;
  type: string;
  shipping: string;
  variants: IVariants[];
  shippingProvider: string;
  trackingId: string;
  quantity: number;
  createdAt: Date;
}
interface INewOrders {
  order: IOrders;
  address: addAddress;
}
const OrdersProcessed: React.FC = () => {
  const [search, setSearch] = useState("");
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchItem = event.target.value.toLowerCase();
      setSearch(searchItem);
      const orderPlaceholder = data?.filter((x) =>
        x?.order?.name.toLowerCase().includes(searchItem)
      );
      setOrders(orderPlaceholder);
    },
    [search]
  );

  const [orders, setOrders] = useState<INewOrders[]>([]);
  const onSuccess = (data: INewOrders[] | string) => {
    if (data !== "No Orders") {
      // @ts-ignore
      setOrders(data);
    }
  };
  const { data, isLoading, isFetched, refetch } = useSellerCancelledOrder(onSuccess);

  useTokenRefetch(refetch)
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Orders processed | seller dashboard linconstore</title>
        <meta
          name={"Orders processed"}
          content={"These are Orders processed"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
          <Typography variant={"h6"}>
            {t("seller.orderProcessed.orders_processed")}
          </Typography>
        </Box>
        <Search search={search} handleChange={handleChange} />
        {isFetched && orders?.length > 0 ? (
          <>
            <Typography variant={"h6"}>
              {t("seller.orderProcessed.orders_processed")} {orders.length}
            </Typography>
            {orders.map(({ order, address }, index) => (
              <OrdersAccordion order={order} address={address} key={index} />
            ))}
          </>
        ) : (
          <Typography variant={"h6"}>
            {t("seller.orderProcessed.alert_text")}
          </Typography>
        )}
        {isLoading && <CircularProgress />}
      </Card>
    </>
  );
};
export default OrdersProcessed;
