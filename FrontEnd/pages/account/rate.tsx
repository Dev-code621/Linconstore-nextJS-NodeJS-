import {NextPage} from "next";
import RateExperience from "../../Components/user/Rate";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useVerifyUserPayment} from "../../hooks/useDataFetch";
import {CircularProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const RatePage : NextPage = () => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState<Boolean>(false);
    const onSuccess = () => {
        setIsVerified(true);
        localStorage.removeItem('pay_id')
    }

    const {isLoading, mutate: verify, isError} = useVerifyUserPayment(onSuccess);
    useEffect(() => {

        setTimeout(() => {
            verify()
        },500)
    }, [router, verify])
    const retryVerification = () => {
        verify()
    }
    return (
        <>
            {!isVerified && <Typography variant={'h6'} textAlign={'center'}> Verifying ...  {isLoading && <CircularProgress/>} </Typography>}
            {isVerified && <RateExperience/>}

            {isError && <Stack direction={'row'}> <Typography variant={'subtitle1'}>Sorry We could not verify your payment  </Typography>
                <Button size={'small'} onClick={retryVerification} > Retry</Button> </Stack>}
        </>
    )
}
export default RatePage;
