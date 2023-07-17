import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    Card,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    Stack,
    Typography
} from "@mui/material";
import {numberWithCommas, round} from "../../Helpers/utils";
import Stats from "../Utils/Admin/Stats";
import ChartComponent from "../Utils/Admin/Charts";
import Box from "@mui/material/Box";
import DashboardOrders from "../Utils/Admin/DashboardOrders";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    useFetchAllOrders,
    useGetAppStats,
    // useGetOrdersMonthly,
    useGetOrdersMonthly2,
    useGetOrdersStats, useSendDeliveredOrders
} from "../../hooks/useDataFetch";
import {IYearlyStats} from "../../Helpers/Types";
import {getCurrentYear} from "../../Helpers/getDate";
import {handleRateChange, key} from "../../Helpers/Exchange";
import ContextApi from "../../Store/context/ContextApi";
import axios from "axios";
import {useTokenRefetch} from "../../hooks/useRefresh";
import Button from "@mui/material/Button";

type data = {
    title: string,
    amount: number,
    percent: number,
    color: string
}

interface IAppStats {
    userStats: number,
    userNext: number,
    sellerStats: number,
    sellerNext: number,
    orderStats: number,
    orderNext : number,
    userSign: boolean,
    sellerSign: boolean,
    orderSign: boolean
}
interface IOrders {
    totalSales: number,
    totalOrders: number
}
type TOrders = {
    _id: string,
    name: string,
    price: number,
    status: string,
    quantity: number,
    shippingCost: number
}

const schema = yup.object().shape({
    type: yup.string().min(3)
})
type Itype = {
    type: string
}
    const DashboardAdmin : React.FC = () => {
    const {  handleSubmit, control, getValues, setValue, reset, watch, formState: {errors} } = useForm<Itype>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
        type: 'All',
    }
})
        const handleRate = useContext(ContextApi).handleRateChange;
        const [orders, setOrders] = useState<TOrders[]>([]);
        const [totalSales, setTotalSales] = useState<number>(0);
        const [totalOrders, setTotalOrders] = useState<number>(0);
    const onSuccess = (data : TOrders[]) => {
        setOrders(data)
    }
        const { refetch, data: ordersData} = useFetchAllOrders(onSuccess);
        const handleAdminRate = useContext(ContextApi).handleAdminRate;
        useTokenRefetch(refetch)
        const [rate, setRate] = useState<number>(0)
        useEffect( () => {
            const handleRateChange = async () => {
                const response = await axios.get('https://api.striperates.com/rates/usd', {
                    headers : {
                        'x-api-key' : key
                    }
                });
                const data = response.data;
                const gbp =  data.data[0].rates.gbp
                setRate(gbp)
                handleAdminRate(gbp)
            }
            handleRateChange()
            }, []);

        const [stats, setStats] = useState<data[]>([])
        const onOrderStatSuccess = async (data : IOrders) => {
            setTotalOrders(data.totalOrders)
            setTotalSales(data.totalSales);
        }
        const onAppStatsSuccess = (data : IAppStats) => {
            const stats : data[] = [
                {
                    title: 'Users',
                    amount: data.userNext,
                    percent: data.userStats,
                    color: data.userSign ? 'green' : 'red'
                },
                {
                    title: 'Sellers',
                    amount: data.sellerNext,
                    percent: data.sellerStats,
                    color: data?.sellerSign ? 'green' : 'red'
                },
                {
                    title: 'Visitors',
                    amount: 75000,
                    percent: 31,
                    color: 'red'
                },
                {
                    title: 'Sales',
                    amount: data?.orderNext,
                    percent: data?.orderStats,
                    color: data.orderSign ?  'green' : 'red'
                },
            ];
            setStats(stats)
        }
        const {isLoading, refetch: appRefetch} = useGetAppStats(onAppStatsSuccess)
        useTokenRefetch(appRefetch)
        const {refetch: statRefetch} = useGetOrdersStats(onOrderStatSuccess);
        useTokenRefetch(statRefetch)


    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [monthlyStats, setMonthlyStats] = useState<number []>([]);
    const onYearlySuccess = useCallback((data : IYearlyStats) => {
        // const newStats : number [] = [];
        // newStats.push(data.july, data.aug, data.sept, data.oct, data.nov, data.dec);
        // if (monthlyStats.length > 0) {
        //     setMonthlyStats(prevState => [...prevState, ...newStats])
        // }else {
        //     setTimeout(() => {
        //         setMonthlyStats(prevState => [...prevState, ...newStats])
        //
        //     }, 1000)
        // }
    },[isUpdated])
    const onYearly2Success = (data : number []) => {
        // const newStats : number[] = [];
        // newStats.push(data.jan, data.feb, data.march,data.april, data.may, data.jun);
        setMonthlyStats(data);
        // setIsUpdated(prevState => !prevState)
    }
    // useGetOrdersMonthly(onYearlySuccess);
        const onSendDeliveredOrderSuccess = () => {
            refetch()
            setValue('type', 'All')
        }

        const {isLoading : isSending, mutate: sendOrder, isSuccess} =  useSendDeliveredOrders(onSendDeliveredOrderSuccess);

        const handleSendOrder = () => {
            sendOrder()
        }
   const {isLoading : isFetching, refetch: orderRefetch} = useGetOrdersMonthly2(onYearly2Success)
        useTokenRefetch(orderRefetch)
const onSubmit: SubmitHandler<Itype> = async (data) => {
    reset()
};
    const type = watch('type');
    useEffect(() => {
        const type = watch('type');
        if (type !== 'All'){
       const newOrders =   ordersData?.filter(order => order.status === type.toLowerCase());
         return    setOrders(newOrders)
        }
        setOrders(ordersData)

    }, [watch('type')])

        const handleFix = (value: number) => value.toFixed(2)
        const handleRefresh = () => {
            refetch()
        }


return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        bgcolor: '#f3f2f2',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    {isFetching && <Typography textAlign={'center'}> <CircularProgress/></Typography>}
                    {monthlyStats.length > 0  && <ChartComponent  rate={rate} chart={monthlyStats} />}
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            {isLoading   && <CircularProgress/>}
            <Grid item xs={12} md={4} lg={3} >
                <Grid item container direction={'column'} spacing={2}>
                    <Grid item xs={6}>
                        <Paper
                            sx={{
                                p: 2,
                                minHeight:'250px',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: '#f3f2f2',
                                justifyContent: 'space-between',
                                border: '2px solid black'
                            }}
                        >
                            <Typography variant={'h6'}> Unit Sold </Typography>
                            <Typography variant={'h6'} textAlign={'center'} >{numberWithCommas(totalOrders)}</Typography>

                            <Typography variant={'body1'} textAlign={'right'}><i>for {getCurrentYear()}</i></Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            sx={{
                                p: 2,
                                minHeight:'250px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                bgcolor: '#f3f2f2',
                                border: '2px solid black'
                            }}
                        >
                            <Typography variant={'h6'}> Gross Sales </Typography>
                            <Typography variant={'h6'} textAlign={'center'}>£{handleFix(totalSales * rate)}</Typography>

                            <Typography variant={'body1'} textAlign={'right'}><i>for {getCurrentYear()}</i></Typography>
                        </Paper>
                    </Grid>
                </Grid>

            </Grid>
            {/* Recent Orders */}
            {stats?.length > 0 && stats.map((data, index) => (
                <Grid key={index} item xs={3}>
                    <Stats title={data.title} amount={data.amount} percent={data.percent} color={data.color}/>
                </Grid>
            ))}
        </Grid>
        {isSuccess && <FormHelperText>Sent Successfully</FormHelperText>}
        <Card sx={{bgcolor: '#f3f2f2', my:3}}>
            <Box sx={{display: 'flex', flexDirection: 'row', mx:2}}>

            <Box sx={{display: 'flex', flexGrow:1,  width: 'auto', flexDirection: 'column', p:2}}>
                <Stack direction={'row'} spacing={2}> <Typography variant={'h6'} sx={{mt:2}}> Orders</Typography>
                    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormControl sx={{minWidth: 170}}  >
                            <InputLabel  id="demo-simple-select-label"  shrink={false}>
                                {watch('type') === 'All'  &&    'All'}</InputLabel>
                            <Controller
                                name='type'
                                control={control}
                                render={({field, formState: {errors}}) => (
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        {...field}
                                        variant={'outlined'}
                                    sx={{bgcolor: 'transparent !important', textTransform: 'none',  color: '#000',
                                        "& .MuiSvgIcon-root": {
                                            color: "black",
                                        },
                                        '& fieldset' : {
                                            border: '0px !important',
                                            outline: 'none !important'
                                        },
                                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border: "0px !important",
                                            borderRadius: "0px !important"
                                        },
                                        '& ..MuiOutlinedInput-notchedOutline:hover' : {
                                            border: '0px !important',
                                            outline: 'none !important'
                                        }
                                    }}
                                    >
                                        <MenuItem value={"All"}>All </MenuItem>
                                        <MenuItem value={'Placed'}>Placed </MenuItem>
                                        <MenuItem value={'Processed'}>Processed</MenuItem>
                                        <MenuItem value={'Shipped'}>Shipped</MenuItem>
                                        <MenuItem value={'delivered'}>Delivered</MenuItem>
                                    </Select>
                                )
                                }
                            />
                        </FormControl>
                    </Box>
                    <Stack>
                        <Box sx={{mt:2}}/>
                        <Typography variant={'h6'} > {orders?.length}</Typography>
                    </Stack>
                </Stack>
                {orders?.length > 0 &&
                <DashboardOrders rate={rate}  handleRefresh={handleRefresh} orders={orders}/>
                }
            </Box>
                {type === 'Shipped' && <Button
                    disabled={isSending}
                    onClick={handleSendOrder}
                    sx={{width: 'auto', height: '40px', my:4, display: 'flex'}} variant={'contained'}>
                    {isSending && <CircularProgress/>} Send Email
                </Button>
                }
            </Box>

        </Card>
    </Container>
)
}
export default DashboardAdmin;