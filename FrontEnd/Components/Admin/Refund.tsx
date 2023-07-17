import React, {useState} from "react";
import {Card, CircularProgress, Stack, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import RatingTable from "../Utils/Admin/RatingTable";
import RefundTable from "../Utils/Admin/RefundTable";
import {useFetchRefunds} from "../../hooks/useDataFetch";
import {TRefunds} from "../../Helpers/Types";
import {useTokenRefetch} from "../../hooks/useRefresh";

const Refund : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter();
    const [refunds, setRefunds] = useState<TRefunds[]>([])
    const onSuccess = (data : TRefunds[]) => {
        setRefunds(data)
    }
    const {isFetched, isLoading, refetch} = useFetchRefunds(onSuccess);
    useTokenRefetch(refetch)
    return (
        <Card elevation={0} sx={{ background:'#f3f2f2', mt:1, p:2, minHeight: '90vh'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {isMobile && <ArrowBack  onClick={() => router.back()} className={'pointer'}/> }
            </Box>

            <Box>
                {isLoading && <Typography textAlign={'center'}> {<CircularProgress/>}</Typography>}
                <Typography variant={'h6'}>Refund Status</Typography>
                {isFetched && refunds.length === 0 && <Typography textAlign={'center'}>Such Empty !</Typography> }
                {isFetched && refunds.length > 0 &&
                <RefundTable refunds={refunds}/>
                }
            </Box>
        </Card>
    )


}
export default Refund;