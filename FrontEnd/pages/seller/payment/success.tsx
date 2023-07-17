import {NextPage} from "next";
import Box from "@mui/material/Box";
import {CircularProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import GenNav from "../../../Components/Layouts/GenNav";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import Container from "@mui/material/Container";
import {useVerifyPayment} from "../../../hooks/useDataFetch";
import StoreInfo from "../../../Components/Seller/StoreInfo";

const PaymentSuccess :  NextPage = () => {
        const onSuccess = (data : any) =>{
            setIsVerified(true)
         }
         const {isLoading, mutate: verifySeller} = useVerifyPayment(onSuccess);
        const [isVerified, setIsVerified] = useState(false)
     useEffect(() => {
         const data  = {}
         const timeout = setTimeout(() => {
             verifySeller(data)
         }, 1000)
         return () => clearTimeout(timeout)
        }, [verifySeller])
    return (
    <Container component={'main'} maxWidth={'lg'}  >
        <>
            <CssBaseline />
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

            {!isVerified && <Typography variant={'h6'}>
                You will be redirected shortly {isLoading && <CircularProgress/>}
            </Typography>}
            {isVerified && <StoreInfo/>}
        </Box>
        </>
    </Container>
    )
}

export default PaymentSuccess;