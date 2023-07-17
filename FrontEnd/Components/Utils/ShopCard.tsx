import React from "react";
import {Card, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import ChartBar from "./Chart";
import Grid from "@mui/material/Grid";
import {getCurrentDate} from "../../Helpers/getDate";
import {useSelector} from "react-redux";

interface IShopCart {
    chart : number[]
}
type TCurrency = {
    currency: string
}

interface ICurrency {
    currency : TCurrency
}
const ShopCard : React.FC<IShopCart> = ({chart}) => {
    const currency : string  = useSelector((state: ICurrency) => state.currency.currency);

    return      (
                  <Card elevation={3} sx={{p:3}} className={'chart'}  >
                      <Box sx={{width: {lg:'800px', md: 600, xs:300}}}>
                          <Typography variant={'body2'}> {currency}</Typography>
                          <Typography textAlign={'center'} variant={'subtitle2'}> {getCurrentDate(0)} - {getCurrentDate(6)}
                          </Typography>
                          <ChartBar chart={chart}  />
                      </Box>
                  </Card>

                )

}
export default ShopCard;